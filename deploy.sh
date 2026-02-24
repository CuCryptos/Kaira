#!/bin/bash
set -e

# === CONFIGURATION ===
# Fill these in before first use, or set as environment variables
SITE_URL="https://explorewithkaira.com"
WP_USER="${WP_USER:-}"          # Set via env or edit here
WP_APP_PASS="${WP_APP_PASS:-}"  # Set via env or edit here
GITHUB_REPO="CuCryptos/Kaira"
THEME_SLUG="kaira-theme"
COOKIE_JAR="/tmp/kaira_wp_cookies.txt"

if [ -z "$WP_USER" ] || [ -z "$WP_APP_PASS" ]; then
  echo "ERROR: Set WP_USER and WP_APP_PASS environment variables."
  echo "  export WP_USER='your_username'"
  echo "  export WP_APP_PASS='xxxx xxxx xxxx xxxx xxxx xxxx'"
  exit 1
fi

# === 1. Push to GitHub ===
echo "==> Pushing master to GitHub..."
git push origin master

# === 2. Update deploy branch (subtree of kaira-theme/) ===
echo "==> Updating deploy branch..."
git subtree split --prefix=kaira-theme -b deploy
git push origin deploy --force

# === 3. Get admin cookies via Bluehost SSO ===
echo "==> Authenticating via Bluehost SSO..."
SSO_URL=$(curl -s "$SITE_URL/wp-json/newfold-sso/v1/sso" \
  -u "$WP_USER:$WP_APP_PASS" \
  -c "$COOKIE_JAR" | tr -d '"')

if [ -z "$SSO_URL" ] || [ "$SSO_URL" = "null" ]; then
  echo "ERROR: SSO endpoint returned empty. Check credentials."
  exit 1
fi

curl -s -L -b "$COOKIE_JAR" -c "$COOKIE_JAR" "$SSO_URL" -o /dev/null

# === 4. Get WP Pusher nonce ===
echo "==> Getting deploy nonce..."
NONCE=$(curl -s -b "$COOKIE_JAR" \
  "$SITE_URL/wp-admin/admin.php?page=wppusher-themes" \
  | grep -oE '"_wpnonce"[^/]*value="[^"]*"' | grep -oE '[a-f0-9]{10}')

if [ -z "$NONCE" ]; then
  echo "ERROR: Could not get nonce. Is WP Pusher installed?"
  exit 1
fi

# === 5. Trigger theme update ===
echo "==> Deploying theme via WP Pusher..."
RESULT=$(curl -s -X POST -b "$COOKIE_JAR" \
  "$SITE_URL/wp-admin/admin.php?page=wppusher-themes" \
  -d "_wpnonce=$NONCE" \
  -d "_wp_http_referer=/wp-admin/admin.php?page=wppusher-themes" \
  -d "wppusher[action]=update-theme" \
  -d "wppusher[repository]=$GITHUB_REPO" \
  -d "wppusher[stylesheet]=$THEME_SLUG")

if echo "$RESULT" | grep -q "successfully updated"; then
  echo "==> Theme deployed successfully!"
else
  echo "WARNING: Could not confirm deploy. Check wp-admin manually."
fi

# === 6. Clear caches ===
echo "==> Clearing caches..."

# WP Super Cache
curl -s -X POST "$SITE_URL/wp-json/wp-super-cache/v1/cache" \
  -u "$WP_USER:$WP_APP_PASS" \
  -H 'Content-Type: application/json' -d '{"wp_delete_cache":true}' > /dev/null 2>&1

# Bluehost Endurance/Nginx cache
curl -s -b "$COOKIE_JAR" \
  "$SITE_URL/wp-admin/admin.php?page=wppusher-themes&nfd_purge_all=1" -o /dev/null

# Clean up
rm -f "$COOKIE_JAR"

echo "==> Done! Version $(grep "KAIRA_VERSION" kaira-theme/functions.php | grep -oE "'[0-9.]+'") deployed."
