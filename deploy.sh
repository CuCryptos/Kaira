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

echo "==> Push complete."

# === 3. Rebuild theme zip ===
echo "==> Building kaira-theme.zip..."
rm -f kaira-theme.zip
(cd kaira-theme && zip -rq ../kaira-theme.zip . -x '*.DS_Store' '*__MACOSX*' '*.git*')
echo "    kaira-theme.zip ready ($(du -h kaira-theme.zip | cut -f1))"
echo ""
echo "==> Upload kaira-theme.zip via wp-admin > Themes > Add New > Upload Theme"
echo "    Then hard refresh (Cmd+Shift+R) to see changes."

echo "==> Done! Version $(grep "KAIRA_VERSION" kaira-theme/functions.php | grep -oE "'[0-9.]+'") ready to deploy."
