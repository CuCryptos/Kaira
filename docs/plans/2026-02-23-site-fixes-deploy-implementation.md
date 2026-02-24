# Site Fixes & Automated Deployment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix live site rendering issues caused by Bluehost's NFD framework overriding theme styles, and set up automated git-based deployment via WP Pusher.

**Architecture:** Two-part fix. Part A modifies `functions.php` (NFD dequeue + template reset) and `custom.css` (specificity hardening + hero fallback). Part B makes the repo public, creates a deploy branch via git subtree, and adds a `deploy.sh` script following the WP Pusher deploy guide.

**Tech Stack:** WordPress block theme (PHP), CSS, Bash, WP Pusher, Bluehost SSO

---

### Task 1: NFD Dequeue + Template Reset in functions.php

**Files:**
- Modify: `kaira-theme/functions.php`

**Context:** Bluehost injects NFD (Newtonify Design Framework) stylesheets and scripts that override our theme CSS. WordPress also stores Site Editor customizations in the database as `wp_template` and `wp_template_part` posts, which override our theme file templates. We need to dequeue NFD assets and reset stale template overrides when the theme version bumps.

**Step 1: Bump KAIRA_VERSION to 1.1.0**

In `kaira-theme/functions.php`, change line 9:

```php
define( 'KAIRA_VERSION', '1.1.0' );
```

**Step 2: Add NFD dequeue function**

Add this after the existing `add_action( 'wp_enqueue_scripts', 'kaira_enqueue_assets' );` line (after line 59):

```php
/**
 * Remove Bluehost/NFD framework styles and scripts that conflict with theme CSS.
 */
function kaira_dequeue_nfd_assets() {
    global $wp_styles, $wp_scripts;

    $blocked_prefixes = array( 'nfd-', 'jeep-', 'bluehost-', 'newfold-', 'wonder-', 'jeep_starter' );

    if ( ! empty( $wp_styles->registered ) ) {
        foreach ( $wp_styles->registered as $handle => $dep ) {
            foreach ( $blocked_prefixes as $prefix ) {
                if ( strpos( $handle, $prefix ) === 0 ) {
                    wp_dequeue_style( $handle );
                    wp_deregister_style( $handle );
                    break;
                }
            }
        }
    }

    if ( ! empty( $wp_scripts->registered ) ) {
        foreach ( $wp_scripts->registered as $handle => $dep ) {
            foreach ( $blocked_prefixes as $prefix ) {
                if ( strpos( $handle, $prefix ) === 0 ) {
                    wp_dequeue_script( $handle );
                    wp_deregister_script( $handle );
                    break;
                }
            }
        }
    }
}
add_action( 'wp_enqueue_scripts', 'kaira_dequeue_nfd_assets', 999 );
```

**Step 3: Add template reset function**

Add this after the NFD dequeue function:

```php
/**
 * Reset Site Editor template overrides when theme version changes.
 * Forces WordPress to use our theme file templates instead of stale DB copies.
 */
function kaira_reset_templates_on_update() {
    $stored = get_option( 'kaira_template_version', '' );
    if ( $stored === KAIRA_VERSION ) {
        return;
    }

    $templates = get_posts( array(
        'post_type'      => array( 'wp_template', 'wp_template_part' ),
        'posts_per_page' => -1,
        'no_found_rows'  => true,
        'tax_query'      => array(
            array(
                'taxonomy' => 'wp_theme',
                'field'    => 'slug',
                'terms'    => get_stylesheet(),
            ),
        ),
    ) );

    foreach ( $templates as $template ) {
        wp_delete_post( $template->ID, true );
    }

    update_option( 'kaira_template_version', KAIRA_VERSION );
}
add_action( 'after_setup_theme', 'kaira_reset_templates_on_update' );
```

**Step 4: Verify the complete file looks correct**

Read `kaira-theme/functions.php` and confirm all three additions are in place: version bump, NFD dequeue, template reset.

**Step 5: Commit**

```bash
git add kaira-theme/functions.php
git commit -m "fix: dequeue NFD styles and reset Site Editor template overrides"
```

---

### Task 2: Harden CSS Specificity + Homepage Hero Fallback

**Files:**
- Modify: `kaira-theme/assets/css/custom.css`

**Context:** Even after dequeuing NFD, residual styles or cached CSS could still compete with our selectors. We boost specificity on critical selectors by prefixing with `body`. We also add a fallback radial gradient on the homepage hero so it looks good even without a background image.

**Step 1: Boost header specificity**

In `kaira-theme/assets/css/custom.css`, replace the Navigation section (lines 75-103) with:

```css
body .kaira-header {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 1000;
	background: transparent;
	transition: background 0.3s ease, backdrop-filter 0.3s ease;
}

body .kaira-header.scrolled {
	background: rgba(10, 10, 10, 0.95);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
}

body .kaira-nav-link {
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.15em;
	color: var(--wp--preset--color--heading);
	text-decoration: none;
	transition: color 0.3s ease;
}

body .kaira-nav-link:hover,
body .kaira-nav-link:focus {
	color: var(--wp--preset--color--accent);
}
```

**Step 2: Boost hero specificity**

Replace the hero section selectors (lines 110-150) with:

```css
body .kaira-hero {
	position: relative;
	width: 100%;
	height: 100vh;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
}

body .kaira-hero img,
body .kaira-hero video {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
}

body .kaira-hero-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(to bottom,
		rgba(10, 10, 10, 0.5) 0%,
		rgba(201, 168, 76, 0.1) 20%,
		rgba(201, 168, 76, 0.05) 40%,
		rgba(10, 10, 10, 0.6) 60%,
		rgba(10, 10, 10, 0.9) 100%
	);
	z-index: 1;
}

/* Ensure hero text sits above overlay and diamond pattern */
body .kaira-hero .wp-block-cover__inner-container {
	position: relative;
	z-index: 3;
}
```

**Step 3: Add homepage hero fallback gradient**

Add this rule after the `.kaira-hero--50vh` block (after line 191):

```css
/* Homepage hero fallback — visible even without a background image */
body .kaira-hero-home {
	background: radial-gradient(
		ellipse at 50% 40%,
		rgba(201, 168, 76, 0.08) 0%,
		rgba(10, 10, 10, 1) 70%
	);
}
```

**Step 4: Boost category pill and meta specificity**

Replace the `.kaira-hero-category` and `.kaira-hero-meta` rules (lines 258-296) with:

```css
/* Category pill — sits above hero title */
body .kaira-hero-category {
	display: flex;
	justify-content: center;
	gap: 0.5rem;
	margin-bottom: 1.5rem;
}

body .kaira-hero-category a {
	display: inline-block;
	background: var(--wp--preset--color--accent);
	color: var(--wp--preset--color--background);
	font-family: var(--wp--preset--font-family--body);
	font-size: 0.75rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	padding: 0.25rem 1rem;
	border-radius: 9999px;
	text-decoration: none;
	transition: filter 0.3s ease;
}

body .kaira-hero-category a:hover {
	filter: brightness(1.2);
}

/* Post meta line in hero */
body .kaira-hero-meta {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1.5rem;
	color: var(--wp--preset--color--muted);
	font-size: 0.875rem;
	font-family: var(--wp--preset--font-family--body);
	letter-spacing: 0.05em;
	margin-top: 1rem;
}

body .kaira-hero-meta span + span::before {
	content: '\2022';
	color: var(--wp--preset--color--accent);
	margin-right: 1.5rem;
	font-size: 0.75em;
}
```

**Step 5: Commit**

```bash
git add kaira-theme/assets/css/custom.css
git commit -m "fix: harden CSS specificity and add homepage hero fallback gradient"
```

---

### Task 3: Make Repo Public + Create Deploy Branch

**Files:**
- No theme files changed

**Context:** WP Pusher free requires a public GitHub repo. We also need a `deploy` branch that contains only the `kaira-theme/` files at root, since WP Pusher expects theme files at repo root.

**Step 1: Make repo public**

```bash
gh repo edit CuCryptos/Kaira --visibility public
```

**Step 2: Push latest master to remote**

```bash
git push origin master
```

**Step 3: Create deploy branch via subtree**

```bash
git subtree split --prefix=kaira-theme -b deploy
git push origin deploy
```

This creates a `deploy` branch containing only the contents of `kaira-theme/` at root level — exactly what WP Pusher expects.

---

### Task 4: Create deploy.sh Script

**Files:**
- Create: `deploy.sh`

**Context:** Based on the WP Pusher deploy setup guide (`wp-pusher-deploy-setup-guide.md`), create a one-command deploy script. The user will need to fill in credentials before first use.

**Step 1: Create deploy.sh**

```bash
#!/bin/bash
set -e

# === CONFIGURATION ===
# Fill these in before first use
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
```

**Step 2: Make executable**

```bash
chmod +x deploy.sh
```

**Step 3: Commit**

```bash
git add deploy.sh
git commit -m "feat: add automated deploy script for WP Pusher + Bluehost"
```

---

### Task 5: Rebuild Theme Zip + Push + First Deploy

**Files:**
- Modify: `kaira-theme.zip` (rebuilt)

**Step 1: Rebuild theme zip**

```bash
rm -f kaira-theme.zip
cd kaira-theme && zip -r ../kaira-theme.zip . -x '*.DS_Store' '*__MACOSX*' '*.git*' && cd ..
```

**Step 2: Commit and push everything**

```bash
git add kaira-theme.zip
git commit -m "chore: rebuild theme zip with site fixes"
git push origin master
```

**Step 3: Update deploy branch**

```bash
git subtree split --prefix=kaira-theme -b deploy
git push origin deploy --force
```

**Step 4: Manual first deploy**

Since WP Pusher is not yet installed, the first deploy is manual:
1. Upload `kaira-theme.zip` via WordPress admin (Appearance > Themes > Add New > Upload)
2. Activate the theme
3. Visit the homepage — the template reset will run on first load (version 1.0.0 → 1.1.0), clearing stale DB templates
4. Hard refresh the page (Cmd+Shift+R) to see the fixed styles

**Step 5: Install WP Pusher for future deploys**

1. Download WP Pusher from https://wppusher.com/
2. In wp-admin: Plugins > Add New > Upload Plugin, upload and activate
3. Go to WP Pusher > Install Theme
4. Repository: `CuCryptos/Kaira`
5. Branch: `deploy`
6. Check "Link to existing theme" and select `kaira-theme`
7. Click Install Theme

After this, future deploys use `./deploy.sh` from the CLI.
