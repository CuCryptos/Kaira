# Site Fixes & Automated Deployment Design

## Goal

Fix visual rendering issues on the live site (explorewithkaira.com) caused by Bluehost's NFD framework overriding theme styles and missing Site Editor template resets, then set up automated deployment via WP Pusher so future changes deploy with a single script.

## Architecture

Two-part fix: (A) harden the theme against hosting framework conflicts, (B) replace manual zip uploads with git-based deployment.

## Part A: Code Fixes

### 1. Dequeue NFD/Bluehost Styles

In `functions.php`, add a `wp_enqueue_scripts` hook at priority 999 that removes all Bluehost-injected stylesheets and scripts matching `nfd-*`, `jeep-*`, `bluehost-*`, `newfold-*`, and `wonder-*` patterns.

### 2. Reset Site Editor Template Overrides

WordPress stores Site Editor customizations as `wp_template` and `wp_template_part` posts in the database, which override theme file templates. Add a version-gated function that:
- Checks stored version against `KAIRA_VERSION`
- On mismatch, deletes all database template/template-part records for the Kaira theme
- Updates the stored version

Bump `KAIRA_VERSION` to `1.1.0` to trigger the reset on next page load.

### 3. Harden CSS Specificity

Prefix critical selectors with `body` to beat NFD's specificity:
- `body .kaira-header` — fixed, transparent, z-index 1000
- `body .kaira-header.scrolled` — frosted glass state
- `body .kaira-hero` — position, overflow, display
- `body .kaira-hero .wp-block-cover__inner-container` — z-index 3

### 4. Homepage Hero Fallback

The Cover block has no background image URL, so the hero renders as pure black. Add a subtle radial gradient on `.kaira-hero-home` so even without a photo, gold tint and depth are visible. Bokeh particles and heading remain above the overlay.

## Part B: Automated Deployment

### 5. Make Repo Public

Change `CuCryptos/Kaira` from private to public so WP Pusher free can access it.

### 6. Deploy Branch via Subtree

WP Pusher expects theme files at repo root. Use `git subtree push --prefix=kaira-theme` to create a `deploy` branch containing only theme files at root. WP Pusher watches this branch.

### 7. Deploy Script (`deploy.sh`)

Based on the WP Pusher deploy setup guide, customized for Kaira:
1. Bump version, commit, push to `master`
2. Subtree push `kaira-theme/` to `deploy` branch
3. SSO into Bluehost via newfold endpoint
4. Get WP Pusher nonce from admin page
5. Trigger theme update via POST
6. Clear all 3 cache layers (WP Super Cache, Bluehost Nginx, Cloudflare version bust)

### 8. Install WP Pusher (Manual Step)

User installs WP Pusher plugin in wp-admin, connects to `CuCryptos/Kaira` repo on `deploy` branch, links to existing `kaira-theme`.

## Files Changed

| File | Change |
|------|--------|
| `kaira-theme/functions.php` | Bump to 1.1.0, add NFD dequeue hook, add template reset function |
| `kaira-theme/assets/css/custom.css` | Boost specificity on header/hero/nav selectors, add hero fallback gradient |
| `deploy.sh` (new) | All-in-one deploy script |

## What Stays Unchanged

- Template HTML files (already correct)
- theme.json design tokens
- main.js scroll behavior
- MCP server code
- Replicate integration
