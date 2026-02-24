#!/bin/bash
set -e

# === CONFIGURATION ===
SITE_URL="https://explorewithkaira.com"
WP_USER="${WP_USER:-}"
WP_APP_PASS="${WP_APP_PASS:-}"

# === 1. Push master to GitHub ===
echo "==> Pushing master to GitHub..."
git push origin master

# === 2. Update deploy branch (subtree of kaira-theme/) ===
echo "==> Updating deploy branch..."
git subtree split --prefix=kaira-theme -b deploy
git push origin deploy --force

echo "==> Push complete. WP Pusher webhook will auto-deploy."
echo "    Waiting 15 seconds for deploy to complete..."
sleep 15

# === 3. Clear caches (optional, requires credentials) ===
if [ -n "$WP_USER" ] && [ -n "$WP_APP_PASS" ]; then
  echo "==> Clearing WP Super Cache..."
  curl -s -X POST "$SITE_URL/wp-json/wp-super-cache/v1/cache" \
    -u "$WP_USER:$WP_APP_PASS" \
    -H 'Content-Type: application/json' \
    -d '{"wp_delete_cache":true}' > /dev/null 2>&1 || true

  echo "==> Purging Bluehost cache..."
  curl -s -X DELETE "$SITE_URL/wp-json/newfold-caching/v1/cache" \
    -u "$WP_USER:$WP_APP_PASS" > /dev/null 2>&1 || true
else
  echo "    (Skipping cache clear -- set WP_USER and WP_APP_PASS to enable)"
fi

echo "==> Done! Version $(grep "KAIRA_VERSION" kaira-theme/functions.php | grep -oE "'[0-9.]+'") deployed."
