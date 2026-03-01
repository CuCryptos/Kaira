# WP Pusher Theme Deployment Setup Guide

> Step-by-step instructions for setting up automated theme deployment from GitHub to a WordPress site on Bluehost using WP Pusher. No FTP, no manual uploads — just git push and deploy.

---

## What This Sets Up

- Edit theme files locally
- Commit and push to GitHub
- Trigger a deploy from the CLI (no browser needed)
- Clear all caches so changes appear immediately

---

## Prerequisites

- WordPress site on Bluehost (or any host)
- GitHub account
- Local development environment (Local by Flywheel, MAMP, etc.)
- Claude Code or terminal access

---

## Step 1: Create a GitHub Repository for Your Theme

```bash
# Navigate to your child theme directory
cd /path/to/wp-content/themes/your-child-theme

# Initialize git
git init
git add .
git commit -m "Initial theme commit"

# Create repo on GitHub (public repos are free with WP Pusher)
gh repo create YourUsername/your-child-theme --public --source=. --push
```

If you don't have the `gh` CLI, create the repo on github.com first, then:

```bash
git remote add origin https://github.com/YourUsername/your-child-theme.git
git branch -M main
git push -u origin main
```

---

## Step 2: Install WP Pusher on Your WordPress Site

1. Download WP Pusher from https://wppusher.com/ (free for public GitHub repos)
2. In WordPress admin: **Plugins → Add New → Upload Plugin**
3. Upload the WP Pusher zip file and activate it
4. Go to **WP Pusher → GitHub** — no token needed for public repos (add a Personal Access Token if using private repos)

---

## Step 3: Connect Your Theme to WP Pusher

1. Go to **WP Pusher → Install Theme**
2. Enter your repository: `YourUsername/your-child-theme`
3. Set branch to `main`
4. Check "Link to existing theme" if the theme is already installed, or let WP Pusher install it
5. Click **Install Theme**

WP Pusher will pull the theme from GitHub and install it.

---

## Step 4: Create a WordPress Application Password

This lets you authenticate REST API requests without your admin password.

1. Go to **Users → Profile** in wp-admin
2. Scroll to **Application Passwords**
3. Enter a name (e.g., "Claude Code Deploy")
4. Click **Add New Application Password**
5. **Copy the password immediately** — it won't be shown again
6. The password looks like: `xxxx xxxx xxxx xxxx xxxx xxxx`

Save these credentials:
- **Username:** your WordPress username
- **App Password:** the generated password
- **Site URL:** https://your-site.com

---

## Step 5: Test REST API Access

```bash
# Verify REST API works with your credentials
curl -s "https://your-site.com/wp-json/wp/v2/users/me" \
  -u 'your_username:xxxx xxxx xxxx xxxx xxxx xxxx'
```

You should get back a JSON object with your user info.

---

## Step 6: Deploy Workflow

### The Manual Way (browser)

1. Push changes to GitHub: `git push origin main`
2. Go to **WP Pusher → Themes** in wp-admin
3. Click **Update Theme** next to your theme

### The CLI Way (no browser needed)

This is a 4-step process: push → get admin cookies → get nonce → trigger deploy.

#### 6a. Push to GitHub

```bash
cd /path/to/your-child-theme
git add .
git commit -m "Your change description"
git push origin main
```

#### 6b. Get Admin Cookies via SSO (Bluehost only)

Bluehost provides an SSO endpoint that gives you admin session cookies:

```bash
# Get SSO login URL
SSO_URL=$(curl -s "https://your-site.com/wp-json/newfold-sso/v1/sso" \
  -u 'your_username:xxxx xxxx xxxx xxxx xxxx xxxx' \
  -c /tmp/wp_cookies.txt | tr -d '"')

# Follow the SSO URL to get full admin cookies
curl -s -L -b /tmp/wp_cookies.txt -c /tmp/wp_cookies.txt "$SSO_URL" -o /dev/null
```

> **Not on Bluehost?** You'll need to get admin cookies another way. Options:
> - Log in via browser and export cookies
> - Use a cookie extraction browser extension
> - Use wp-cli if you have SSH access: `wp user session create <user_id>`

#### 6c. Get WP Pusher Nonce

```bash
NONCE=$(curl -s -b /tmp/wp_cookies.txt \
  'https://your-site.com/wp-admin/admin.php?page=wppusher-themes' \
  | grep -oE '"_wpnonce"[^/]*value="[^"]*"' | grep -oE '[a-f0-9]{10}')
echo "Nonce: $NONCE"
```

#### 6d. Trigger Theme Update

```bash
curl -s -X POST -b /tmp/wp_cookies.txt \
  'https://your-site.com/wp-admin/admin.php?page=wppusher-themes' \
  -d "_wpnonce=$NONCE" \
  -d '_wp_http_referer=/wp-admin/admin.php?page=wppusher-themes' \
  -d 'wppusher[action]=update-theme' \
  -d 'wppusher[repository]=YourUsername/your-child-theme' \
  -d 'wppusher[stylesheet]=your-child-theme'
```

Look for "Theme was successfully updated." in the response.

---

## Step 7: Clear Caches After Deploy

Bluehost has triple-layer caching. Clear all three:

```bash
# 1. WP Super Cache (if installed) — REST API, no cookies needed
curl -s -X POST 'https://your-site.com/wp-json/wp-super-cache/v1/cache' \
  -u 'your_username:xxxx xxxx xxxx xxxx xxxx xxxx' \
  -H 'Content-Type: application/json' -d '{"wp_delete_cache":true}'

# 2. Bluehost Endurance/Nginx cache — requires admin cookies
curl -s -b /tmp/wp_cookies.txt \
  'https://your-site.com/wp-admin/admin.php?page=wppusher-themes&nfd_purge_all=1' \
  -o /dev/null

# 3. Cloudflare CDN — no direct purge available
# Use version parameter cache busting instead (see Step 8)
```

---

## Step 8: Cache Busting for CSS/JS

Cloudflare and browser caches serve files based on URL. Add a version constant to your theme and bump it whenever you change CSS or JS:

**In functions.php:**

```php
define('MY_THEME_VERSION', '1.0.1'); // Bump this with every CSS/JS change

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('my-child-style',
        get_stylesheet_directory_uri() . '/style.css',
        ['kadence-parent'],
        MY_THEME_VERSION  // Appends ?ver=1.0.1 to the URL
    );
});
```

When you change CSS/JS:
1. Edit your files
2. Bump the version number (e.g., `1.0.1` → `1.0.2`)
3. Commit, push, deploy, clear caches

The `?ver=1.0.2` parameter makes it a new URL, bypassing all caches.

---

## Step 9: Verify Deployment

```bash
# Check that the CSS version parameter updated
curl -s "https://your-site.com/?v=$(date +%s)" | grep -oE "style\.css\?ver=[0-9.]+"

# Check a specific page loads correctly
curl -s -o /dev/null -w "%{http_code}" "https://your-site.com/"
```

---

## All-in-One Deploy Script

Save this as `deploy.sh` in your theme directory and customize the variables:

```bash
#!/bin/bash
set -e

# === CONFIGURATION ===
SITE_URL="https://your-site.com"
WP_USER="your_username"
WP_APP_PASS="xxxx xxxx xxxx xxxx xxxx xxxx"
GITHUB_REPO="YourUsername/your-child-theme"
THEME_SLUG="your-child-theme"
COOKIE_JAR="/tmp/wp_cookies.txt"

# === 1. Push to GitHub ===
echo "Pushing to GitHub..."
git push origin main

# === 2. Get admin cookies via SSO ===
echo "Getting admin cookies..."
SSO_URL=$(curl -s "$SITE_URL/wp-json/newfold-sso/v1/sso" \
  -u "$WP_USER:$WP_APP_PASS" \
  -c "$COOKIE_JAR" | tr -d '"')
curl -s -L -b "$COOKIE_JAR" -c "$COOKIE_JAR" "$SSO_URL" -o /dev/null

# === 3. Get WP Pusher nonce ===
echo "Getting deploy nonce..."
NONCE=$(curl -s -b "$COOKIE_JAR" \
  "$SITE_URL/wp-admin/admin.php?page=wppusher-themes" \
  | grep -oE '"_wpnonce"[^/]*value="[^"]*"' | grep -oE '[a-f0-9]{10}')

if [ -z "$NONCE" ]; then
  echo "ERROR: Could not get nonce. Check cookies."
  exit 1
fi

# === 4. Trigger theme update ===
echo "Deploying theme..."
RESULT=$(curl -s -X POST -b "$COOKIE_JAR" \
  "$SITE_URL/wp-admin/admin.php?page=wppusher-themes" \
  -d "_wpnonce=$NONCE" \
  -d "_wp_http_referer=/wp-admin/admin.php?page=wppusher-themes" \
  -d "wppusher[action]=update-theme" \
  -d "wppusher[repository]=$GITHUB_REPO" \
  -d "wppusher[stylesheet]=$THEME_SLUG")

if echo "$RESULT" | grep -q "successfully updated"; then
  echo "Theme deployed successfully!"
else
  echo "WARNING: Could not confirm deploy. Check wp-admin manually."
fi

# === 5. Clear caches ===
echo "Clearing caches..."
curl -s -X POST "$SITE_URL/wp-json/wp-super-cache/v1/cache" \
  -u "$WP_USER:$WP_APP_PASS" \
  -H 'Content-Type: application/json' -d '{"wp_delete_cache":true}' > /dev/null 2>&1

curl -s -b "$COOKIE_JAR" \
  "$SITE_URL/wp-admin/admin.php?page=wppusher-themes&nfd_purge_all=1" -o /dev/null

echo "Done! Caches cleared."
```

Make it executable: `chmod +x deploy.sh`

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| WP Pusher says "Theme not found" | Make sure the GitHub repo name matches exactly (case-sensitive) |
| Deploy pulls old code | You pushed to the wrong repo — check `git remote -v` |
| CSS changes not visible | Bump the version constant, clear all 3 cache layers |
| SSO endpoint returns error | Check that REST API is accessible and app password is correct |
| Nonce extraction fails | Admin cookies may have expired — re-run the SSO step |
| "Theme was successfully updated" not in response | Check WP Pusher → Themes in wp-admin manually |
| PHP fatal error after deploy | Use cPanel File Manager to fix the file directly, then push a fix to GitHub |

---

## Important Notes

- **Public repos only** with free WP Pusher. Paid version supports private repos.
- **No auto-deploy webhook** is configured — you must trigger deploys manually (via script or wp-admin). You can set up a GitHub webhook if you want auto-deploy on push.
- **The SSO endpoint** (`/wp-json/newfold-sso/v1/sso`) is specific to Bluehost/Newfold hosts. Other hosts won't have this.
- **Always bump your version constant** when changing CSS/JS. Cloudflare can cache for up to 24 hours otherwise.
- **Keep credentials out of git** — don't commit `deploy.sh` with real passwords. Use environment variables or a `.env` file instead.
