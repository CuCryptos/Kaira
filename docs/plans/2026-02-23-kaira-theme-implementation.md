# Kaira Custom Block Theme — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a custom WordPress FSE block theme for explorewithkaira.com with a dark luxurious aesthetic, photo/video galleries, blog, WooCommerce shop, and Replicate AI image generation integration.

**Architecture:** Custom WordPress block theme using Full Site Editing (FSE). Theme defines all styles via `theme.json`, layouts via block templates/parts, and extends WordPress with custom post types (Gallery, Destination), custom blocks (gallery mosaic, hero slider), and a Replicate API integration in the admin panel. WooCommerce handles the shop.

**Tech Stack:** WordPress 6.x FSE, PHP 8.x, HTML block templates, CSS custom properties, vanilla JS, WooCommerce, Replicate HTTP API

---

### Task 1: Scaffold Theme Directory Structure

**Files:**
- Create: `kaira-theme/style.css`
- Create: `kaira-theme/functions.php`
- Create: `kaira-theme/theme.json`
- Create: `kaira-theme/templates/` (directory)
- Create: `kaira-theme/parts/` (directory)
- Create: `kaira-theme/assets/css/` (directory)
- Create: `kaira-theme/assets/js/` (directory)
- Create: `kaira-theme/assets/fonts/` (directory)
- Create: `kaira-theme/assets/images/` (directory)
- Create: `kaira-theme/inc/` (directory)
- Create: `kaira-theme/blocks/` (directory)

**Step 1: Create theme directory and subdirectories**

```bash
mkdir -p kaira-theme/{templates,parts,assets/{css,js,fonts,images},inc,blocks}
```

**Step 2: Create style.css with theme metadata**

```css
/*
Theme Name: Kaira - Explore With Kaira
Theme URI: https://explorewithkaira.com
Author: Kaira Team
Author URI: https://explorewithkaira.com
Description: A dark, luxurious custom block theme for Kaira — AI virtual influencer, luxury travel & lifestyle.
Version: 1.0.0
Requires at least: 6.4
Tested up to: 6.7
Requires PHP: 8.0
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: kaira
Tags: full-site-editing, block-patterns, custom-colors, custom-fonts, e-commerce
*/
```

**Step 3: Create minimal functions.php**

```php
<?php
/**
 * Kaira Theme functions and definitions.
 *
 * @package Kaira
 */

if ( ! defined( 'KAIRA_VERSION' ) ) {
    define( 'KAIRA_VERSION', '1.0.0' );
}

function kaira_setup() {
    add_theme_support( 'wp-block-styles' );
    add_theme_support( 'editor-styles' );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', array(
        'height'      => 60,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ) );
}
add_action( 'after_setup_theme', 'kaira_setup' );

function kaira_enqueue_assets() {
    wp_enqueue_style(
        'kaira-style',
        get_stylesheet_uri(),
        array(),
        KAIRA_VERSION
    );

    wp_enqueue_style(
        'kaira-custom',
        get_template_directory_uri() . '/assets/css/custom.css',
        array(),
        KAIRA_VERSION
    );
}
add_action( 'wp_enqueue_scripts', 'kaira_enqueue_assets' );
```

**Step 4: Verify theme structure**

```bash
find kaira-theme -type f | sort
```

Expected: `style.css`, `functions.php` listed with all directories created.

**Step 5: Commit**

```bash
git add kaira-theme/
git commit -m "feat: scaffold kaira theme directory structure"
```

---

### Task 2: Define Design System in theme.json

**Files:**
- Create: `kaira-theme/theme.json`

**Step 1: Write theme.json with full design system**

```json
{
    "$schema": "https://schemas.wp.org/trunk/theme.json",
    "version": 3,
    "settings": {
        "appearanceTools": true,
        "useRootPaddingAwareAlignments": true,
        "layout": {
            "contentSize": "1200px",
            "wideSize": "1400px"
        },
        "color": {
            "palette": [
                {
                    "slug": "background",
                    "color": "#0a0a0a",
                    "name": "Background"
                },
                {
                    "slug": "surface",
                    "color": "#141414",
                    "name": "Surface"
                },
                {
                    "slug": "accent",
                    "color": "#c9a84c",
                    "name": "Accent Gold"
                },
                {
                    "slug": "text",
                    "color": "#f5f0e8",
                    "name": "Text"
                },
                {
                    "slug": "heading",
                    "color": "#ffffff",
                    "name": "Heading"
                },
                {
                    "slug": "muted",
                    "color": "#8a8275",
                    "name": "Muted"
                }
            ],
            "gradients": [
                {
                    "slug": "dark-overlay",
                    "gradient": "linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.85) 100%)",
                    "name": "Dark Overlay"
                },
                {
                    "slug": "gold-shimmer",
                    "gradient": "linear-gradient(135deg, #c9a84c 0%, #e8d48b 50%, #c9a84c 100%)",
                    "name": "Gold Shimmer"
                }
            ]
        },
        "typography": {
            "fontFamilies": [
                {
                    "fontFamily": "'Playfair Display', Georgia, serif",
                    "slug": "heading",
                    "name": "Playfair Display",
                    "fontFace": [
                        {
                            "fontFamily": "Playfair Display",
                            "fontWeight": "400 900",
                            "fontStyle": "normal",
                            "fontDisplay": "swap",
                            "src": ["file:./assets/fonts/PlayfairDisplay-VariableFont_wght.woff2"]
                        },
                        {
                            "fontFamily": "Playfair Display",
                            "fontWeight": "400 900",
                            "fontStyle": "italic",
                            "fontDisplay": "swap",
                            "src": ["file:./assets/fonts/PlayfairDisplay-Italic-VariableFont_wght.woff2"]
                        }
                    ]
                },
                {
                    "fontFamily": "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                    "slug": "body",
                    "name": "Inter",
                    "fontFace": [
                        {
                            "fontFamily": "Inter",
                            "fontWeight": "300 700",
                            "fontStyle": "normal",
                            "fontDisplay": "swap",
                            "src": ["file:./assets/fonts/Inter-VariableFont_opsz,wght.woff2"]
                        }
                    ]
                }
            ],
            "fontSizes": [
                { "slug": "small", "size": "0.875rem", "name": "Small" },
                { "slug": "medium", "size": "1rem", "name": "Medium" },
                { "slug": "large", "size": "1.25rem", "name": "Large" },
                { "slug": "x-large", "size": "2rem", "name": "X-Large" },
                { "slug": "xx-large", "size": "3.5rem", "name": "XX-Large" },
                { "slug": "hero", "size": "clamp(2.5rem, 5vw, 5rem)", "name": "Hero" }
            ]
        },
        "spacing": {
            "units": ["px", "rem", "vh", "vw", "%"],
            "spacingSizes": [
                { "slug": "10", "size": "0.5rem", "name": "XS" },
                { "slug": "20", "size": "1rem", "name": "S" },
                { "slug": "30", "size": "1.5rem", "name": "M" },
                { "slug": "40", "size": "2rem", "name": "L" },
                { "slug": "50", "size": "3rem", "name": "XL" },
                { "slug": "60", "size": "5rem", "name": "XXL" },
                { "slug": "70", "size": "8rem", "name": "XXXL" }
            ]
        }
    },
    "styles": {
        "color": {
            "background": "var(--wp--preset--color--background)",
            "text": "var(--wp--preset--color--text)"
        },
        "typography": {
            "fontFamily": "var(--wp--preset--font-family--body)",
            "fontSize": "var(--wp--preset--font-size--medium)",
            "lineHeight": "1.7"
        },
        "spacing": {
            "padding": {
                "top": "0",
                "right": "var(--wp--preset--spacing--30)",
                "bottom": "0",
                "left": "var(--wp--preset--spacing--30)"
            }
        },
        "elements": {
            "heading": {
                "typography": {
                    "fontFamily": "var(--wp--preset--font-family--heading)",
                    "fontWeight": "700",
                    "lineHeight": "1.2"
                },
                "color": {
                    "text": "var(--wp--preset--color--heading)"
                }
            },
            "h1": {
                "typography": {
                    "fontSize": "var(--wp--preset--font-size--hero)"
                }
            },
            "h2": {
                "typography": {
                    "fontSize": "var(--wp--preset--font-size--xx-large)"
                }
            },
            "h3": {
                "typography": {
                    "fontSize": "var(--wp--preset--font-size--x-large)"
                }
            },
            "link": {
                "color": {
                    "text": "var(--wp--preset--color--accent)"
                },
                ":hover": {
                    "color": {
                        "text": "var(--wp--preset--color--heading)"
                    }
                }
            },
            "button": {
                "color": {
                    "background": "var(--wp--preset--color--accent)",
                    "text": "var(--wp--preset--color--background)"
                },
                "typography": {
                    "fontFamily": "var(--wp--preset--font-family--body)",
                    "fontSize": "var(--wp--preset--font-size--small)",
                    "fontWeight": "600",
                    "textTransform": "uppercase",
                    "letterSpacing": "0.1em"
                },
                "border": {
                    "radius": "0"
                },
                ":hover": {
                    "color": {
                        "background": "var(--wp--preset--color--heading)",
                        "text": "var(--wp--preset--color--background)"
                    }
                }
            }
        },
        "blocks": {
            "core/separator": {
                "color": {
                    "text": "var(--wp--preset--color--accent)"
                },
                "border": {
                    "width": "1px"
                }
            },
            "core/quote": {
                "typography": {
                    "fontFamily": "var(--wp--preset--font-family--heading)",
                    "fontStyle": "italic"
                },
                "border": {
                    "left": {
                        "color": "var(--wp--preset--color--accent)",
                        "width": "3px"
                    }
                }
            }
        }
    },
    "templateParts": [
        { "name": "header", "title": "Header", "area": "header" },
        { "name": "footer", "title": "Footer", "area": "footer" }
    ],
    "customTemplates": [
        { "name": "page-gallery", "title": "Gallery Page", "postTypes": ["page"] },
        { "name": "page-about", "title": "About Page", "postTypes": ["page"] },
        { "name": "blank", "title": "Blank (No Header/Footer)", "postTypes": ["page", "post"] }
    ]
}
```

**Step 2: Verify JSON is valid**

```bash
python3 -c "import json; json.load(open('kaira-theme/theme.json')); print('Valid JSON')"
```

Expected: `Valid JSON`

**Step 3: Commit**

```bash
git add kaira-theme/theme.json
git commit -m "feat: define design system in theme.json — colors, typography, spacing"
```

---

### Task 3: Download and Add Web Fonts

**Files:**
- Create: `kaira-theme/assets/fonts/PlayfairDisplay-VariableFont_wght.woff2`
- Create: `kaira-theme/assets/fonts/PlayfairDisplay-Italic-VariableFont_wght.woff2`
- Create: `kaira-theme/assets/fonts/Inter-VariableFont_opsz,wght.woff2`

**Step 1: Download Playfair Display variable font files**

Download from Google Fonts and convert to woff2. Use `fontsource` npm packages or download directly:

```bash
curl -L -o /tmp/playfair.zip "https://fonts.google.com/download?family=Playfair+Display"
unzip /tmp/playfair.zip -d /tmp/playfair/
# Copy variable font woff2 files to kaira-theme/assets/fonts/
# If only .ttf available, convert with woff2 tool or use a CDN fallback
```

Alternatively, use the Google Fonts API woff2 URLs directly in theme.json as remote sources. For best performance, self-host.

**Step 2: Download Inter variable font**

```bash
curl -L -o /tmp/inter.zip "https://fonts.google.com/download?family=Inter"
unzip /tmp/inter.zip -d /tmp/inter/
```

**Step 3: Place font files in theme**

```bash
cp /tmp/playfair/PlayfairDisplay-VariableFont_wght.ttf kaira-theme/assets/fonts/
cp /tmp/playfair/PlayfairDisplay-Italic-VariableFont_wght.ttf kaira-theme/assets/fonts/
cp /tmp/inter/Inter-VariableFont_opsz,wght.ttf kaira-theme/assets/fonts/
```

Note: If .woff2 conversion is needed, use `woff2_compress` or update `theme.json` font paths to `.ttf`.

**Step 4: Verify fonts are in place**

```bash
ls -la kaira-theme/assets/fonts/
```

**Step 5: Commit**

```bash
git add kaira-theme/assets/fonts/
git commit -m "feat: add Playfair Display and Inter self-hosted fonts"
```

---

### Task 4: Create Custom CSS

**Files:**
- Create: `kaira-theme/assets/css/custom.css`

**Step 1: Write custom.css for styles beyond theme.json**

```css
/* ==========================================================================
   Kaira Theme — Custom Styles
   ========================================================================== */

/* --- Global --- */
*,
*::before,
*::after {
    box-sizing: border-box;
}

img {
    max-width: 100%;
    height: auto;
    display: block;
}

::selection {
    background: var(--wp--preset--color--accent);
    color: var(--wp--preset--color--background);
}

/* --- Gold Divider --- */
.kaira-divider {
    width: 60px;
    height: 1px;
    background: var(--wp--preset--color--accent);
    margin: 2rem auto;
    border: none;
}

/* --- Navigation --- */
.kaira-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    transition: background-color 0.3s ease, backdrop-filter 0.3s ease;
}

.kaira-header.scrolled {
    background-color: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(10px);
}

.kaira-nav-link {
    font-family: var(--wp--preset--font-family--body);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--wp--preset--color--heading);
    text-decoration: none;
    padding: 0.5rem 1rem;
    transition: color 0.2s ease;
}

.kaira-nav-link:hover {
    color: var(--wp--preset--color--accent);
}

/* --- Hero Section --- */
.kaira-hero {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.kaira-hero img,
.kaira-hero video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.kaira-hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        180deg,
        rgba(10, 10, 10, 0.3) 0%,
        rgba(10, 10, 10, 0.7) 100%
    );
}

.kaira-hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 2rem;
}

/* --- Card Grid --- */
.kaira-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
}

.kaira-card {
    background: var(--wp--preset--color--surface);
    overflow: hidden;
    transition: transform 0.3s ease;
}

.kaira-card:hover {
    transform: translateY(-4px);
}

.kaira-card-image {
    overflow: hidden;
    aspect-ratio: 3 / 4;
}

.kaira-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.kaira-card:hover .kaira-card-image img {
    transform: scale(1.05);
}

.kaira-card-body {
    padding: 1.5rem;
}

.kaira-card-meta {
    font-size: var(--wp--preset--font-size--small);
    color: var(--wp--preset--color--muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
}

/* --- Gallery Masonry --- */
.kaira-gallery-masonry {
    columns: 3;
    column-gap: 1rem;
}

.kaira-gallery-masonry .kaira-gallery-item {
    break-inside: avoid;
    margin-bottom: 1rem;
    overflow: hidden;
    cursor: pointer;
    position: relative;
}

.kaira-gallery-masonry .kaira-gallery-item img {
    width: 100%;
    transition: transform 0.5s ease;
}

.kaira-gallery-masonry .kaira-gallery-item:hover img {
    transform: scale(1.03);
}

.kaira-gallery-masonry .kaira-gallery-item::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 2px solid transparent;
    transition: border-color 0.3s ease;
    pointer-events: none;
}

.kaira-gallery-masonry .kaira-gallery-item:hover::after {
    border-color: var(--wp--preset--color--accent);
}

@media (max-width: 900px) {
    .kaira-gallery-masonry { columns: 2; }
}

@media (max-width: 600px) {
    .kaira-gallery-masonry { columns: 1; }
}

/* --- Lightbox --- */
.kaira-lightbox {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(10, 10, 10, 0.95);
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.kaira-lightbox.active {
    display: flex;
}

.kaira-lightbox img {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
}

.kaira-lightbox-close {
    position: absolute;
    top: 2rem;
    right: 2rem;
    background: none;
    border: none;
    color: var(--wp--preset--color--heading);
    font-size: 2rem;
    cursor: pointer;
}

/* --- Newsletter Section --- */
.kaira-newsletter {
    background: var(--wp--preset--color--surface);
    text-align: center;
    padding: 5rem 2rem;
}

.kaira-newsletter input[type="email"] {
    background: var(--wp--preset--color--background);
    border: 1px solid var(--wp--preset--color--muted);
    color: var(--wp--preset--color--text);
    padding: 0.875rem 1.25rem;
    font-size: 1rem;
    font-family: var(--wp--preset--font-family--body);
    min-width: 300px;
    outline: none;
    transition: border-color 0.2s ease;
}

.kaira-newsletter input[type="email"]:focus {
    border-color: var(--wp--preset--color--accent);
}

/* --- Gallery Filters --- */
.kaira-filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    margin-bottom: 3rem;
}

.kaira-filter-btn {
    background: transparent;
    border: 1px solid var(--wp--preset--color--muted);
    color: var(--wp--preset--color--muted);
    padding: 0.5rem 1.25rem;
    font-family: var(--wp--preset--font-family--body);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.2s ease;
}

.kaira-filter-btn:hover,
.kaira-filter-btn.active {
    border-color: var(--wp--preset--color--accent);
    color: var(--wp--preset--color--accent);
}

/* --- Footer --- */
.kaira-footer-social a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    color: var(--wp--preset--color--muted);
    transition: color 0.2s ease;
}

.kaira-footer-social a:hover {
    color: var(--wp--preset--color--accent);
}

/* --- Scroll Animations --- */
.kaira-fade-in {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}

.kaira-fade-in.visible {
    opacity: 1;
    transform: translateY(0);
}

/* --- WooCommerce Overrides --- */
.wc-block-grid__product {
    background: var(--wp--preset--color--surface);
}

.wc-block-grid__product-image img {
    transition: transform 0.5s ease;
}

.wc-block-grid__product:hover .wc-block-grid__product-image img {
    transform: scale(1.03);
}

.wp-block-button__link {
    border-radius: 0 !important;
}
```

**Step 2: Verify CSS parses correctly**

```bash
wc -l kaira-theme/assets/css/custom.css
```

Expected: ~250+ lines, file exists and is non-empty.

**Step 3: Commit**

```bash
git add kaira-theme/assets/css/custom.css
git commit -m "feat: add custom CSS — navigation, hero, cards, gallery, lightbox, newsletter"
```

---

### Task 5: Create Header Template Part

**Files:**
- Create: `kaira-theme/parts/header.html`

**Step 1: Write header block template**

```html
<!-- wp:group {"className":"kaira-header","layout":{"type":"constrained","contentSize":"1400px"},"style":{"spacing":{"padding":{"top":"1.5rem","bottom":"1.5rem"}}}} -->
<div class="wp-block-group kaira-header" style="padding-top:1.5rem;padding-bottom:1.5rem">

    <!-- wp:group {"layout":{"type":"flex","justifyContent":"space-between","flexWrap":"nowrap"}} -->
    <div class="wp-block-group">

        <!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
        <div class="wp-block-group">
            <!-- wp:site-title {"style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)","fontSize":"1.5rem","fontWeight":"700","letterSpacing":"0.05em","textTransform":"uppercase"},"elements":{"link":{"color":{"text":"var(--wp--preset--color--heading)"}}}}} /-->
        </div>
        <!-- /wp:group -->

        <!-- wp:navigation {"overlayMenu":"mobile","layout":{"type":"flex","justifyContent":"center"},"style":{"typography":{"fontSize":"0.75rem","fontWeight":"600","textTransform":"uppercase","letterSpacing":"0.15em"},"elements":{"link":{"color":{"text":"var(--wp--preset--color--heading)"}}}}} -->
            <!-- wp:navigation-link {"label":"Home","url":"/","kind":"custom"} /-->
            <!-- wp:navigation-link {"label":"Destinations","url":"/destinations/","kind":"custom"} /-->
            <!-- wp:navigation-link {"label":"Lifestyle","url":"/lifestyle/","kind":"custom"} /-->
            <!-- wp:navigation-link {"label":"Gallery","url":"/gallery/","kind":"custom"} /-->
            <!-- wp:navigation-link {"label":"Shop","url":"/shop/","kind":"custom"} /-->
            <!-- wp:navigation-link {"label":"About","url":"/about/","kind":"custom"} /-->
        <!-- /wp:navigation -->

        <!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
        <div class="wp-block-group">
            <!-- wp:search {"label":"Search","showLabel":false,"placeholder":"Search...","buttonText":"","buttonUseIcon":true,"style":{"elements":{"link":{"color":{"text":"var(--wp--preset--color--heading)"}}}}} /-->
        </div>
        <!-- /wp:group -->

    </div>
    <!-- /wp:group -->

</div>
<!-- /wp:group -->
```

**Step 2: Commit**

```bash
git add kaira-theme/parts/header.html
git commit -m "feat: add header template part — sticky nav with logo, links, search"
```

---

### Task 6: Create Footer Template Part

**Files:**
- Create: `kaira-theme/parts/footer.html`

**Step 1: Write footer block template**

```html
<!-- wp:group {"className":"kaira-footer","style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--60)","bottom":"var(--wp--preset--spacing--40)"}},"color":{"background":"var(--wp--preset--color--surface)"}},"layout":{"type":"constrained","contentSize":"1200px"}} -->
<div class="wp-block-group kaira-footer" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--40);background-color:var(--wp--preset--color--surface)">

    <!-- wp:columns -->
    <div class="wp-block-columns">

        <!-- wp:column {"width":"40%"} -->
        <div class="wp-block-column" style="flex-basis:40%">
            <!-- wp:heading {"level":3,"style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)","fontSize":"1.5rem"}}} -->
            <h3 style="font-family:var(--wp--preset--font-family--heading);font-size:1.5rem">Explore With Kaira</h3>
            <!-- /wp:heading -->

            <!-- wp:paragraph {"style":{"color":{"text":"var(--wp--preset--color--muted)"}}} -->
            <p style="color:var(--wp--preset--color--muted)">Luxury travel &amp; lifestyle through the eyes of Kaira, your AI-driven virtual influencer for unforgettable journeys.</p>
            <!-- /wp:paragraph -->

            <!-- wp:social-links {"className":"kaira-footer-social","layout":{"type":"flex"}} -->
            <ul class="wp-block-social-links kaira-footer-social">
                <!-- wp:social-link {"url":"#","service":"instagram"} /-->
                <!-- wp:social-link {"url":"#","service":"tiktok"} /-->
                <!-- wp:social-link {"url":"#","service":"youtube"} /-->
                <!-- wp:social-link {"url":"#","service":"x"} /-->
            </ul>
            <!-- /wp:social-links -->
        </div>
        <!-- /wp:column -->

        <!-- wp:column {"width":"20%"} -->
        <div class="wp-block-column" style="flex-basis:20%">
            <!-- wp:heading {"level":4,"style":{"typography":{"fontSize":"0.75rem","textTransform":"uppercase","letterSpacing":"0.15em","fontWeight":"600"},"color":{"text":"var(--wp--preset--color--accent)"}}} -->
            <h4 style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;font-weight:600;color:var(--wp--preset--color--accent)">Explore</h4>
            <!-- /wp:heading -->

            <!-- wp:list {"style":{"typography":{"fontSize":"0.875rem"},"spacing":{"blockGap":"0.5rem"}}} -->
            <ul style="font-size:0.875rem">
                <li><a href="/destinations/">Destinations</a></li>
                <li><a href="/lifestyle/">Lifestyle</a></li>
                <li><a href="/gallery/">Gallery</a></li>
                <li><a href="/shop/">Shop</a></li>
            </ul>
            <!-- /wp:list -->
        </div>
        <!-- /wp:column -->

        <!-- wp:column {"width":"40%"} -->
        <div class="wp-block-column" style="flex-basis:40%">
            <!-- wp:heading {"level":4,"style":{"typography":{"fontSize":"0.75rem","textTransform":"uppercase","letterSpacing":"0.15em","fontWeight":"600"},"color":{"text":"var(--wp--preset--color--accent)"}}} -->
            <h4 style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;font-weight:600;color:var(--wp--preset--color--accent)">Stay in the Loop</h4>
            <!-- /wp:heading -->

            <!-- wp:paragraph {"style":{"color":{"text":"var(--wp--preset--color--muted)"},"typography":{"fontSize":"0.875rem"}}} -->
            <p style="color:var(--wp--preset--color--muted);font-size:0.875rem">Get luxury travel tips, exclusive content, and updates delivered to your inbox.</p>
            <!-- /wp:paragraph -->

            <!-- wp:html -->
            <form class="kaira-newsletter" style="background:transparent;padding:0;text-align:left;">
                <div style="display:flex;gap:0;">
                    <input type="email" placeholder="Enter your email" style="flex:1;" />
                    <button type="submit" class="wp-block-button__link" style="background:var(--wp--preset--color--accent);color:var(--wp--preset--color--background);padding:0.875rem 1.5rem;border:none;font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;cursor:pointer;">Subscribe</button>
                </div>
            </form>
            <!-- /wp:html -->
        </div>
        <!-- /wp:column -->

    </div>
    <!-- /wp:columns -->

    <!-- wp:separator {"className":"kaira-divider","style":{"spacing":{"margin":{"top":"3rem","bottom":"2rem"}}}} -->
    <hr class="wp-block-separator kaira-divider" style="margin-top:3rem;margin-bottom:2rem"/>
    <!-- /wp:separator -->

    <!-- wp:paragraph {"align":"center","style":{"color":{"text":"var(--wp--preset--color--muted)"},"typography":{"fontSize":"0.75rem"}}} -->
    <p class="has-text-align-center" style="color:var(--wp--preset--color--muted);font-size:0.75rem">&copy; 2026 Explore With Kaira. All rights reserved.</p>
    <!-- /wp:paragraph -->

</div>
<!-- /wp:group -->
```

**Step 2: Commit**

```bash
git add kaira-theme/parts/footer.html
git commit -m "feat: add footer template part — branding, links, newsletter, social"
```

---

### Task 7: Create Front Page Template

**Files:**
- Create: `kaira-theme/templates/front-page.html`

**Step 1: Write front page template**

```html
<!-- wp:template-part {"slug":"header","area":"header"} /-->

<!-- wp:group {"className":"kaira-hero","tagName":"section","layout":{"type":"default"}} -->
<section class="wp-block-group kaira-hero">
    <!-- wp:image {"className":"kaira-hero-bg","sizeSlug":"full"} -->
    <figure class="wp-block-image size-full kaira-hero-bg">
        <img src="" alt="Kaira hero image" />
    </figure>
    <!-- /wp:image -->

    <div class="kaira-hero-overlay"></div>

    <!-- wp:group {"className":"kaira-hero-content","layout":{"type":"constrained","contentSize":"800px"}} -->
    <div class="wp-block-group kaira-hero-content">
        <!-- wp:heading {"level":1,"textAlign":"center","style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)","fontSize":"var(--wp--preset--font-size--hero)"}}} -->
        <h1 class="has-text-align-center" style="font-family:var(--wp--preset--font-family--heading);font-size:var(--wp--preset--font-size--hero)">Explore With Kaira</h1>
        <!-- /wp:heading -->

        <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.125rem","letterSpacing":"0.05em"},"color":{"text":"var(--wp--preset--color--text)"}}} -->
        <p class="has-text-align-center" style="font-size:1.125rem;letter-spacing:0.05em;color:var(--wp--preset--color--text)">Luxury travel &amp; lifestyle through the eyes of your favorite AI influencer</p>
        <!-- /wp:paragraph -->

        <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"2rem"}}}} -->
        <div class="wp-block-buttons" style="margin-top:2rem">
            <!-- wp:button -->
            <div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="/destinations/">Begin the Journey</a></div>
            <!-- /wp:button -->
        </div>
        <!-- /wp:buttons -->
    </div>
    <!-- /wp:group -->
</section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--60)","bottom":"var(--wp--preset--spacing--60)"}}},"layout":{"type":"constrained","contentSize":"1200px"}} -->
<section class="wp-block-group" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">
    <!-- wp:heading {"textAlign":"center","style":{"typography":{"fontSize":"0.75rem","textTransform":"uppercase","letterSpacing":"0.2em","fontWeight":"600"},"color":{"text":"var(--wp--preset--color--accent)"}}} -->
    <h2 class="has-text-align-center" style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.2em;font-weight:600;color:var(--wp--preset--color--accent)">Latest from Kaira</h2>
    <!-- /wp:heading -->

    <!-- wp:heading {"textAlign":"center","style":{"typography":{"fontSize":"var(--wp--preset--font-size--xx-large)"},"spacing":{"margin":{"top":"1rem","bottom":"3rem"}}}} -->
    <h2 class="has-text-align-center" style="font-size:var(--wp--preset--font-size--xx-large);margin-top:1rem;margin-bottom:3rem">Stories &amp; Destinations</h2>
    <!-- /wp:heading -->

    <!-- wp:query {"queryId":1,"query":{"perPage":3,"offset":0,"postType":"post","order":"desc","orderBy":"date"},"className":"kaira-card-grid"} -->
    <div class="wp-block-query kaira-card-grid">
        <!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
            <!-- wp:group {"className":"kaira-card","layout":{"type":"default"}} -->
            <div class="wp-block-group kaira-card">
                <!-- wp:group {"className":"kaira-card-image","layout":{"type":"default"}} -->
                <div class="wp-block-group kaira-card-image">
                    <!-- wp:post-featured-image {"isLink":true} /-->
                </div>
                <!-- /wp:group -->
                <!-- wp:group {"className":"kaira-card-body","layout":{"type":"default"}} -->
                <div class="wp-block-group kaira-card-body">
                    <!-- wp:post-terms {"term":"category","className":"kaira-card-meta"} /-->
                    <!-- wp:post-title {"level":3,"isLink":true,"style":{"typography":{"fontSize":"1.25rem"}}} /-->
                    <!-- wp:post-excerpt {"moreText":"","excerptLength":20} /-->
                </div>
                <!-- /wp:group -->
            </div>
            <!-- /wp:group -->
        <!-- /wp:post-template -->
    </div>
    <!-- /wp:query -->
</section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","className":"kaira-newsletter","layout":{"type":"constrained","contentSize":"600px"}} -->
<section class="wp-block-group kaira-newsletter">
    <!-- wp:heading {"textAlign":"center","style":{"typography":{"fontSize":"0.75rem","textTransform":"uppercase","letterSpacing":"0.2em","fontWeight":"600"},"color":{"text":"var(--wp--preset--color--accent)"}}} -->
    <h2 class="has-text-align-center" style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.2em;font-weight:600;color:var(--wp--preset--color--accent)">Stay Connected</h2>
    <!-- /wp:heading -->

    <!-- wp:heading {"textAlign":"center","style":{"typography":{"fontSize":"var(--wp--preset--font-size--x-large)"},"spacing":{"margin":{"top":"1rem","bottom":"1rem"}}}} -->
    <h2 class="has-text-align-center" style="font-size:var(--wp--preset--font-size--x-large);margin-top:1rem;margin-bottom:1rem">Join the Journey</h2>
    <!-- /wp:heading -->

    <!-- wp:paragraph {"align":"center","style":{"color":{"text":"var(--wp--preset--color--muted)"}}} -->
    <p class="has-text-align-center" style="color:var(--wp--preset--color--muted)">Exclusive travel tips, behind-the-scenes content, and luxury lifestyle inspiration.</p>
    <!-- /wp:paragraph -->

    <!-- wp:html -->
    <form class="kaira-newsletter" style="background:transparent;">
        <div style="display:flex;gap:0;max-width:500px;margin:2rem auto 0;">
            <input type="email" placeholder="Enter your email" />
            <button type="submit" class="wp-block-button__link" style="background:var(--wp--preset--color--accent);color:var(--wp--preset--color--background);padding:0.875rem 1.5rem;border:none;font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;cursor:pointer;white-space:nowrap;">Subscribe</button>
        </div>
    </form>
    <!-- /wp:html -->
</section>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer"} /-->
```

**Step 2: Commit**

```bash
git add kaira-theme/templates/front-page.html
git commit -m "feat: add front page template — hero, latest posts, newsletter"
```

---

### Task 8: Create Index and Single Post Templates

**Files:**
- Create: `kaira-theme/templates/index.html`
- Create: `kaira-theme/templates/single.html`
- Create: `kaira-theme/templates/archive.html`

**Step 1: Write index.html (blog listing fallback)**

```html
<!-- wp:template-part {"slug":"header","area":"header"} /-->

<!-- wp:group {"tagName":"main","style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--70)","bottom":"var(--wp--preset--spacing--60)"}}},"layout":{"type":"constrained","contentSize":"1200px"}} -->
<main class="wp-block-group" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--60)">

    <!-- wp:query-title {"type":"archive","textAlign":"center","style":{"spacing":{"margin":{"bottom":"var(--wp--preset--spacing--50)"}}}} /-->

    <!-- wp:query {"queryId":2,"query":{"perPage":9,"offset":0,"postType":"post","order":"desc","orderBy":"date"}} -->
    <div class="wp-block-query">
        <!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
            <!-- wp:group {"className":"kaira-card","layout":{"type":"default"}} -->
            <div class="wp-block-group kaira-card">
                <!-- wp:group {"className":"kaira-card-image","layout":{"type":"default"}} -->
                <div class="wp-block-group kaira-card-image">
                    <!-- wp:post-featured-image {"isLink":true} /-->
                </div>
                <!-- /wp:group -->
                <!-- wp:group {"className":"kaira-card-body","layout":{"type":"default"}} -->
                <div class="wp-block-group kaira-card-body">
                    <!-- wp:post-terms {"term":"category","className":"kaira-card-meta"} /-->
                    <!-- wp:post-title {"level":3,"isLink":true,"style":{"typography":{"fontSize":"1.25rem"}}} /-->
                    <!-- wp:post-excerpt {"moreText":"","excerptLength":20} /-->
                </div>
                <!-- /wp:group -->
            </div>
            <!-- /wp:group -->
        <!-- /wp:post-template -->

        <!-- wp:query-pagination {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"var(--wp--preset--spacing--50)"}}}} -->
            <!-- wp:query-pagination-previous /-->
            <!-- wp:query-pagination-numbers /-->
            <!-- wp:query-pagination-next /-->
        <!-- /wp:query-pagination -->
    </div>
    <!-- /wp:query -->

</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer"} /-->
```

**Step 2: Write single.html (single post)**

```html
<!-- wp:template-part {"slug":"header","area":"header"} /-->

<!-- wp:group {"tagName":"article","style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--70)","bottom":"var(--wp--preset--spacing--60)"}}},"layout":{"type":"constrained","contentSize":"800px"}} -->
<article class="wp-block-group" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--60)">

    <!-- wp:post-terms {"term":"category","className":"kaira-card-meta","textAlign":"center","style":{"spacing":{"margin":{"bottom":"1rem"}}}} /-->

    <!-- wp:post-title {"textAlign":"center","style":{"spacing":{"margin":{"bottom":"1.5rem"}}}} /-->

    <!-- wp:post-date {"textAlign":"center","style":{"color":{"text":"var(--wp--preset--color--muted)"},"typography":{"fontSize":"0.875rem"},"spacing":{"margin":{"bottom":"3rem"}}}} /-->

    <!-- wp:post-featured-image {"style":{"spacing":{"margin":{"bottom":"3rem"}}}} /-->

    <!-- wp:post-content {"layout":{"type":"constrained","contentSize":"800px"}} /-->

    <!-- wp:separator {"className":"kaira-divider","style":{"spacing":{"margin":{"top":"4rem","bottom":"4rem"}}}} -->
    <hr class="wp-block-separator kaira-divider" style="margin-top:4rem;margin-bottom:4rem"/>
    <!-- /wp:separator -->

    <!-- wp:heading {"textAlign":"center","style":{"typography":{"fontSize":"0.75rem","textTransform":"uppercase","letterSpacing":"0.2em","fontWeight":"600"},"color":{"text":"var(--wp--preset--color--accent)"}}} -->
    <h2 class="has-text-align-center" style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.2em;font-weight:600;color:var(--wp--preset--color--accent)">Keep Exploring</h2>
    <!-- /wp:heading -->

    <!-- wp:query {"queryId":3,"query":{"perPage":3,"offset":0,"postType":"post","order":"desc","orderBy":"date","exclude":[]},"layout":{"type":"constrained","contentSize":"1200px"}} -->
    <div class="wp-block-query">
        <!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
            <!-- wp:group {"className":"kaira-card","layout":{"type":"default"}} -->
            <div class="wp-block-group kaira-card">
                <!-- wp:group {"className":"kaira-card-image","layout":{"type":"default"}} -->
                <div class="wp-block-group kaira-card-image">
                    <!-- wp:post-featured-image {"isLink":true} /-->
                </div>
                <!-- /wp:group -->
                <!-- wp:group {"className":"kaira-card-body","layout":{"type":"default"}} -->
                <div class="wp-block-group kaira-card-body">
                    <!-- wp:post-title {"level":3,"isLink":true,"style":{"typography":{"fontSize":"1.125rem"}}} /-->
                </div>
                <!-- /wp:group -->
            </div>
            <!-- /wp:group -->
        <!-- /wp:post-template -->
    </div>
    <!-- /wp:query -->

</article>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer"} /-->
```

**Step 3: Write archive.html (category/tag archives)**

```html
<!-- wp:template-part {"slug":"header","area":"header"} /-->

<!-- wp:group {"tagName":"main","style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--70)","bottom":"var(--wp--preset--spacing--60)"}}},"layout":{"type":"constrained","contentSize":"1200px"}} -->
<main class="wp-block-group" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--60)">

    <!-- wp:query-title {"type":"archive","textAlign":"center"} /-->

    <!-- wp:term-description {"textAlign":"center","style":{"color":{"text":"var(--wp--preset--color--muted)"},"spacing":{"margin":{"bottom":"var(--wp--preset--spacing--50)"}}}} /-->

    <!-- wp:query {"queryId":4,"query":{"perPage":12,"offset":0,"postType":"post","order":"desc","orderBy":"date","inherit":true}} -->
    <div class="wp-block-query">
        <!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
            <!-- wp:group {"className":"kaira-card","layout":{"type":"default"}} -->
            <div class="wp-block-group kaira-card">
                <!-- wp:group {"className":"kaira-card-image","layout":{"type":"default"}} -->
                <div class="wp-block-group kaira-card-image">
                    <!-- wp:post-featured-image {"isLink":true} /-->
                </div>
                <!-- /wp:group -->
                <!-- wp:group {"className":"kaira-card-body","layout":{"type":"default"}} -->
                <div class="wp-block-group kaira-card-body">
                    <!-- wp:post-terms {"term":"category","className":"kaira-card-meta"} /-->
                    <!-- wp:post-title {"level":3,"isLink":true,"style":{"typography":{"fontSize":"1.25rem"}}} /-->
                    <!-- wp:post-excerpt {"moreText":"","excerptLength":20} /-->
                </div>
                <!-- /wp:group -->
            </div>
            <!-- /wp:group -->
        <!-- /wp:post-template -->

        <!-- wp:query-pagination {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"var(--wp--preset--spacing--50)"}}}} -->
            <!-- wp:query-pagination-previous /-->
            <!-- wp:query-pagination-numbers /-->
            <!-- wp:query-pagination-next /-->
        <!-- /wp:query-pagination -->
    </div>
    <!-- /wp:query -->

</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer"} /-->
```

**Step 4: Commit**

```bash
git add kaira-theme/templates/index.html kaira-theme/templates/single.html kaira-theme/templates/archive.html
git commit -m "feat: add index, single, and archive templates — card grid with pagination"
```

---

### Task 9: Create Gallery Page Template

**Files:**
- Create: `kaira-theme/templates/page-gallery.html`
- Create: `kaira-theme/assets/js/gallery.js`

**Step 1: Write gallery page template**

```html
<!-- wp:template-part {"slug":"header","area":"header"} /-->

<!-- wp:group {"tagName":"main","style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--70)","bottom":"var(--wp--preset--spacing--60)"}}},"layout":{"type":"constrained","contentSize":"1400px"}} -->
<main class="wp-block-group" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--60)">

    <!-- wp:heading {"textAlign":"center","style":{"typography":{"fontSize":"0.75rem","textTransform":"uppercase","letterSpacing":"0.2em","fontWeight":"600"},"color":{"text":"var(--wp--preset--color--accent)"}}} -->
    <h2 class="has-text-align-center" style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.2em;font-weight:600;color:var(--wp--preset--color--accent)">Portfolio</h2>
    <!-- /wp:heading -->

    <!-- wp:heading {"textAlign":"center","style":{"typography":{"fontSize":"var(--wp--preset--font-size--xx-large)"},"spacing":{"margin":{"top":"1rem","bottom":"3rem"}}}} -->
    <h2 class="has-text-align-center" style="font-size:var(--wp--preset--font-size--xx-large);margin-top:1rem;margin-bottom:3rem">Gallery</h2>
    <!-- /wp:heading -->

    <!-- wp:html -->
    <div class="kaira-filter-bar" id="gallery-filters">
        <button class="kaira-filter-btn active" data-filter="all">All</button>
        <button class="kaira-filter-btn" data-filter="travel">Travel</button>
        <button class="kaira-filter-btn" data-filter="fashion">Fashion</button>
        <button class="kaira-filter-btn" data-filter="lifestyle">Lifestyle</button>
        <button class="kaira-filter-btn" data-filter="fitness">Fitness</button>
    </div>

    <div class="kaira-gallery-masonry" id="gallery-grid">
        <!-- Gallery items populated dynamically via Gallery CPT or manually -->
    </div>

    <div class="kaira-lightbox" id="kaira-lightbox">
        <button class="kaira-lightbox-close" aria-label="Close lightbox">&times;</button>
        <img src="" alt="" />
    </div>
    <!-- /wp:html -->

</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer"} /-->
```

**Step 2: Write gallery.js for filtering and lightbox**

```javascript
/**
 * Kaira Gallery — Filtering + Lightbox
 */
document.addEventListener('DOMContentLoaded', function () {
    // --- Filter Buttons ---
    const filterBtns = document.querySelectorAll('.kaira-filter-btn');
    const galleryItems = document.querySelectorAll('.kaira-gallery-item');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');

            galleryItems.forEach(function (item) {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // --- Lightbox ---
    const lightbox = document.getElementById('kaira-lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.kaira-lightbox-close');

    galleryItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var img = this.querySelector('img');
            if (!img) return;
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
});
```

**Step 3: Enqueue gallery.js in functions.php**

Add to `kaira_enqueue_assets()` in `functions.php`:

```php
if ( is_page_template( 'page-gallery' ) || is_page( 'gallery' ) ) {
    wp_enqueue_script(
        'kaira-gallery',
        get_template_directory_uri() . '/assets/js/gallery.js',
        array(),
        KAIRA_VERSION,
        true
    );
}
```

**Step 4: Commit**

```bash
git add kaira-theme/templates/page-gallery.html kaira-theme/assets/js/gallery.js kaira-theme/functions.php
git commit -m "feat: add gallery page template with masonry, filters, and lightbox"
```

---

### Task 10: Create About Page Template

**Files:**
- Create: `kaira-theme/templates/page-about.html`

**Step 1: Write about page template**

```html
<!-- wp:template-part {"slug":"header","area":"header"} /-->

<!-- wp:cover {"dimRatio":60,"overlayColor":"background","minHeight":60,"minHeightUnit":"vh","isDark":true,"style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--70)"}}},"layout":{"type":"constrained","contentSize":"800px"}} -->
<div class="wp-block-cover is-dark" style="padding-top:var(--wp--preset--spacing--70);min-height:60vh">
    <span aria-hidden="true" class="wp-block-cover__background has-background-background-color has-background-dim-60 has-background-dim"></span>
    <div class="wp-block-cover__inner-container">
        <!-- wp:heading {"textAlign":"center","style":{"typography":{"fontSize":"0.75rem","textTransform":"uppercase","letterSpacing":"0.2em","fontWeight":"600"},"color":{"text":"var(--wp--preset--color--accent)"}}} -->
        <h2 class="has-text-align-center" style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.2em;font-weight:600;color:var(--wp--preset--color--accent)">Meet</h2>
        <!-- /wp:heading -->

        <!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"var(--wp--preset--font-size--hero)"}}} -->
        <h1 class="has-text-align-center" style="font-size:var(--wp--preset--font-size--hero)">Kaira</h1>
        <!-- /wp:heading -->

        <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.125rem"},"color":{"text":"var(--wp--preset--color--text)"}}} -->
        <p class="has-text-align-center" style="font-size:1.125rem;color:var(--wp--preset--color--text)">AI-driven virtual influencer. Luxury traveler. Style curator. Your guide to the world's most beautiful destinations.</p>
        <!-- /wp:paragraph -->
    </div>
</div>
<!-- /wp:cover -->

<!-- wp:group {"tagName":"section","style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--60)","bottom":"var(--wp--preset--spacing--60)"}}},"layout":{"type":"constrained","contentSize":"800px"}} -->
<section class="wp-block-group" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">

    <!-- wp:post-content /-->

</section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--50)","bottom":"var(--wp--preset--spacing--60)"}},"color":{"background":"var(--wp--preset--color--surface)"}},"layout":{"type":"constrained","contentSize":"600px"}} -->
<section class="wp-block-group" style="padding-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--60);background-color:var(--wp--preset--color--surface)">

    <!-- wp:heading {"textAlign":"center","style":{"typography":{"fontSize":"0.75rem","textTransform":"uppercase","letterSpacing":"0.2em","fontWeight":"600"},"color":{"text":"var(--wp--preset--color--accent)"}}} -->
    <h2 class="has-text-align-center" style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.2em;font-weight:600;color:var(--wp--preset--color--accent)">Connect</h2>
    <!-- /wp:heading -->

    <!-- wp:heading {"textAlign":"center","style":{"typography":{"fontSize":"var(--wp--preset--font-size--x-large)"},"spacing":{"margin":{"top":"1rem","bottom":"2rem"}}}} -->
    <h2 class="has-text-align-center" style="font-size:var(--wp--preset--font-size--x-large);margin-top:1rem;margin-bottom:2rem">Follow the Journey</h2>
    <!-- /wp:heading -->

    <!-- wp:social-links {"className":"is-style-logos-only","layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"blockGap":"2rem"}}} -->
    <ul class="wp-block-social-links is-style-logos-only">
        <!-- wp:social-link {"url":"#","service":"instagram"} /-->
        <!-- wp:social-link {"url":"#","service":"tiktok"} /-->
        <!-- wp:social-link {"url":"#","service":"youtube"} /-->
        <!-- wp:social-link {"url":"#","service":"x"} /-->
    </ul>
    <!-- /wp:social-links -->

    <!-- wp:separator {"className":"kaira-divider","style":{"spacing":{"margin":{"top":"3rem","bottom":"3rem"}}}} -->
    <hr class="wp-block-separator kaira-divider" style="margin-top:3rem;margin-bottom:3rem"/>
    <!-- /wp:separator -->

    <!-- wp:heading {"textAlign":"center","style":{"typography":{"fontSize":"var(--wp--preset--font-size--large)"},"spacing":{"margin":{"bottom":"1.5rem"}}}} -->
    <h2 class="has-text-align-center" style="font-size:var(--wp--preset--font-size--large);margin-bottom:1.5rem">Work With Kaira</h2>
    <!-- /wp:heading -->

    <!-- wp:paragraph {"align":"center","style":{"color":{"text":"var(--wp--preset--color--muted)"},"spacing":{"margin":{"bottom":"2rem"}}}} -->
    <p class="has-text-align-center" style="color:var(--wp--preset--color--muted);margin-bottom:2rem">Interested in brand partnerships, collaborations, or features? Get in touch.</p>
    <!-- /wp:paragraph -->

    <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
    <div class="wp-block-buttons">
        <!-- wp:button -->
        <div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="mailto:hello@explorewithkaira.com">Get in Touch</a></div>
        <!-- /wp:button -->
    </div>
    <!-- /wp:buttons -->

</section>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer"} /-->
```

**Step 2: Commit**

```bash
git add kaira-theme/templates/page-about.html
git commit -m "feat: add about page template — hero cover, story, social links, contact CTA"
```

---

### Task 11: Register Custom Post Types and Taxonomies

**Files:**
- Create: `kaira-theme/inc/custom-post-types.php`
- Modify: `kaira-theme/functions.php`

**Step 1: Write custom-post-types.php**

```php
<?php
/**
 * Register custom post types and taxonomies for Kaira.
 *
 * @package Kaira
 */

function kaira_register_post_types() {
    // Gallery CPT
    register_post_type( 'kaira_gallery', array(
        'labels' => array(
            'name'               => 'Gallery',
            'singular_name'      => 'Gallery Item',
            'add_new'            => 'Add New Item',
            'add_new_item'       => 'Add New Gallery Item',
            'edit_item'          => 'Edit Gallery Item',
            'view_item'          => 'View Gallery Item',
            'all_items'          => 'All Gallery Items',
            'search_items'       => 'Search Gallery',
            'not_found'          => 'No gallery items found.',
        ),
        'public'       => true,
        'has_archive'  => true,
        'rewrite'      => array( 'slug' => 'gallery-item' ),
        'menu_icon'    => 'dashicons-format-gallery',
        'supports'     => array( 'title', 'editor', 'thumbnail', 'custom-fields' ),
        'show_in_rest' => true,
    ) );

    // Gallery Category taxonomy
    register_taxonomy( 'gallery_category', 'kaira_gallery', array(
        'labels' => array(
            'name'          => 'Gallery Categories',
            'singular_name' => 'Gallery Category',
            'add_new_item'  => 'Add New Gallery Category',
        ),
        'public'       => true,
        'hierarchical' => true,
        'rewrite'      => array( 'slug' => 'gallery-category' ),
        'show_in_rest' => true,
    ) );

    // Destination CPT
    register_post_type( 'kaira_destination', array(
        'labels' => array(
            'name'               => 'Destinations',
            'singular_name'      => 'Destination',
            'add_new'            => 'Add New Destination',
            'add_new_item'       => 'Add New Destination',
            'edit_item'          => 'Edit Destination',
            'view_item'          => 'View Destination',
            'all_items'          => 'All Destinations',
            'search_items'       => 'Search Destinations',
            'not_found'          => 'No destinations found.',
        ),
        'public'       => true,
        'has_archive'  => true,
        'rewrite'      => array( 'slug' => 'destination' ),
        'menu_icon'    => 'dashicons-location-alt',
        'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
        'show_in_rest' => true,
    ) );

    // Location taxonomy for Destinations
    register_taxonomy( 'location', 'kaira_destination', array(
        'labels' => array(
            'name'          => 'Locations',
            'singular_name' => 'Location',
            'add_new_item'  => 'Add New Location',
        ),
        'public'       => true,
        'hierarchical' => true,
        'rewrite'      => array( 'slug' => 'location' ),
        'show_in_rest' => true,
    ) );
}
add_action( 'init', 'kaira_register_post_types' );
```

**Step 2: Include in functions.php**

Add at the end of `functions.php`:

```php
require get_template_directory() . '/inc/custom-post-types.php';
```

**Step 3: Commit**

```bash
git add kaira-theme/inc/custom-post-types.php kaira-theme/functions.php
git commit -m "feat: register Gallery and Destination custom post types with taxonomies"
```

---

### Task 12: WooCommerce Integration

**Files:**
- Create: `kaira-theme/inc/woocommerce.php`
- Modify: `kaira-theme/functions.php`

**Step 1: Write woocommerce.php**

```php
<?php
/**
 * WooCommerce integration for Kaira theme.
 *
 * @package Kaira
 */

function kaira_woocommerce_setup() {
    add_theme_support( 'woocommerce', array(
        'thumbnail_image_width' => 600,
        'single_image_width'    => 900,
        'product_grid'          => array(
            'default_rows'    => 3,
            'min_rows'        => 1,
            'default_columns' => 3,
            'min_columns'     => 1,
            'max_columns'     => 4,
        ),
    ) );
    add_theme_support( 'wc-product-gallery-zoom' );
    add_theme_support( 'wc-product-gallery-lightbox' );
    add_theme_support( 'wc-product-gallery-slider' );
}
add_action( 'after_setup_theme', 'kaira_woocommerce_setup' );

function kaira_woocommerce_styles() {
    if ( ! class_exists( 'WooCommerce' ) ) {
        return;
    }

    wp_enqueue_style(
        'kaira-woocommerce',
        get_template_directory_uri() . '/assets/css/woocommerce.css',
        array(),
        KAIRA_VERSION
    );
}
add_action( 'wp_enqueue_scripts', 'kaira_woocommerce_styles' );
```

**Step 2: Create woocommerce.css**

Create `kaira-theme/assets/css/woocommerce.css`:

```css
/* ==========================================================================
   Kaira — WooCommerce Overrides
   ========================================================================== */

.woocommerce ul.products li.product {
    background: var(--wp--preset--color--surface);
    padding-bottom: 1.5rem;
    transition: transform 0.3s ease;
}

.woocommerce ul.products li.product:hover {
    transform: translateY(-4px);
}

.woocommerce ul.products li.product .woocommerce-loop-product__title {
    font-family: var(--wp--preset--font-family--heading);
    color: var(--wp--preset--color--heading);
    font-size: 1.125rem;
    padding: 0.75rem 1rem 0;
}

.woocommerce ul.products li.product .price {
    color: var(--wp--preset--color--accent);
    font-weight: 600;
    padding: 0 1rem;
}

.woocommerce ul.products li.product .button,
.woocommerce a.button,
.woocommerce button.button {
    background-color: var(--wp--preset--color--accent);
    color: var(--wp--preset--color--background);
    border-radius: 0;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 0.75rem 1.5rem;
}

.woocommerce a.button:hover,
.woocommerce button.button:hover {
    background-color: var(--wp--preset--color--heading);
    color: var(--wp--preset--color--background);
}

.woocommerce-message,
.woocommerce-info {
    border-top-color: var(--wp--preset--color--accent);
}

.woocommerce-message::before,
.woocommerce-info::before {
    color: var(--wp--preset--color--accent);
}
```

**Step 3: Include in functions.php**

Add at the end of `functions.php`:

```php
if ( class_exists( 'WooCommerce' ) ) {
    require get_template_directory() . '/inc/woocommerce.php';
}
```

**Step 4: Commit**

```bash
git add kaira-theme/inc/woocommerce.php kaira-theme/assets/css/woocommerce.css kaira-theme/functions.php
git commit -m "feat: add WooCommerce theme support and dark luxury style overrides"
```

---

### Task 13: Replicate API Client

**Files:**
- Create: `kaira-theme/inc/replicate-api.php`

**Step 1: Write the Replicate API client class**

```php
<?php
/**
 * Replicate API client for Kaira image generation.
 *
 * @package Kaira
 */

class Kaira_Replicate_Client {

    private string $api_token;
    private string $api_base = 'https://api.replicate.com/v1';

    public function __construct() {
        $this->api_token = defined( 'KAIRA_REPLICATE_API_TOKEN' )
            ? KAIRA_REPLICATE_API_TOKEN
            : '';
    }

    public function is_configured(): bool {
        return ! empty( $this->api_token );
    }

    /**
     * Create a prediction (start image generation).
     *
     * @param string $model_version The model version ID on Replicate.
     * @param array  $input         Input parameters for the model.
     * @return array|WP_Error Response data or error.
     */
    public function create_prediction( string $model_version, array $input ) {
        $response = wp_remote_post( $this->api_base . '/predictions', array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->api_token,
                'Content-Type'  => 'application/json',
                'Prefer'        => 'wait',
            ),
            'body'    => wp_json_encode( array(
                'version' => $model_version,
                'input'   => $input,
            ) ),
            'timeout' => 120,
        ) );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $body = json_decode( wp_remote_retrieve_body( $response ), true );
        $code = wp_remote_retrieve_response_code( $response );

        if ( $code >= 400 ) {
            return new WP_Error(
                'replicate_api_error',
                $body['detail'] ?? 'Replicate API error',
                array( 'status' => $code )
            );
        }

        return $body;
    }

    /**
     * Get a prediction's status and output.
     *
     * @param string $prediction_id The prediction ID.
     * @return array|WP_Error
     */
    public function get_prediction( string $prediction_id ) {
        $response = wp_remote_get( $this->api_base . '/predictions/' . $prediction_id, array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->api_token,
                'Content-Type'  => 'application/json',
            ),
            'timeout' => 30,
        ) );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $body = json_decode( wp_remote_retrieve_body( $response ), true );
        $code = wp_remote_retrieve_response_code( $response );

        if ( $code >= 400 ) {
            return new WP_Error(
                'replicate_api_error',
                $body['detail'] ?? 'Replicate API error',
                array( 'status' => $code )
            );
        }

        return $body;
    }

    /**
     * Poll a prediction until it completes or fails.
     *
     * @param string $prediction_id The prediction ID.
     * @param int    $max_attempts  Max poll attempts.
     * @param int    $interval      Seconds between polls.
     * @return array|WP_Error
     */
    public function poll_prediction( string $prediction_id, int $max_attempts = 60, int $interval = 2 ) {
        for ( $i = 0; $i < $max_attempts; $i++ ) {
            $result = $this->get_prediction( $prediction_id );

            if ( is_wp_error( $result ) ) {
                return $result;
            }

            if ( in_array( $result['status'], array( 'succeeded', 'failed', 'canceled' ), true ) ) {
                return $result;
            }

            sleep( $interval );
        }

        return new WP_Error( 'replicate_timeout', 'Prediction timed out.' );
    }

    /**
     * Download an image URL and import it into the WordPress Media Library.
     *
     * @param string $image_url  Remote image URL.
     * @param string $title      Attachment title.
     * @param string $category   Gallery category for tagging.
     * @return int|WP_Error Attachment ID or error.
     */
    public function import_to_media_library( string $image_url, string $title = '', string $category = '' ): int|WP_Error {
        require_once ABSPATH . 'wp-admin/includes/media.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';

        $tmp_file = download_url( $image_url );
        if ( is_wp_error( $tmp_file ) ) {
            return $tmp_file;
        }

        $file_array = array(
            'name'     => sanitize_file_name( ( $title ?: 'kaira-generated' ) . '.png' ),
            'tmp_name' => $tmp_file,
        );

        $attachment_id = media_handle_sideload( $file_array, 0, $title );

        if ( is_wp_error( $attachment_id ) ) {
            @unlink( $tmp_file );
            return $attachment_id;
        }

        // Add metadata
        update_post_meta( $attachment_id, '_kaira_generated', true );
        update_post_meta( $attachment_id, '_kaira_category', sanitize_text_field( $category ) );

        return $attachment_id;
    }
}
```

**Step 2: Verify PHP syntax**

```bash
php -l kaira-theme/inc/replicate-api.php
```

Expected: `No syntax errors detected`

**Step 3: Commit**

```bash
git add kaira-theme/inc/replicate-api.php
git commit -m "feat: add Replicate API client — predictions, polling, media library import"
```

---

### Task 14: Kaira Image Studio Admin Panel

**Files:**
- Create: `kaira-theme/inc/image-studio.php`
- Create: `kaira-theme/assets/js/image-studio.js`
- Create: `kaira-theme/assets/css/image-studio.css`
- Modify: `kaira-theme/functions.php`

**Step 1: Write image-studio.php (admin page + AJAX handlers)**

```php
<?php
/**
 * Kaira Image Studio — Admin panel for AI image generation.
 *
 * @package Kaira
 */

class Kaira_Image_Studio {

    private Kaira_Replicate_Client $client;

    public function __construct() {
        $this->client = new Kaira_Replicate_Client();
        add_action( 'admin_menu', array( $this, 'add_admin_page' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
        add_action( 'wp_ajax_kaira_generate_image', array( $this, 'ajax_generate_image' ) );
    }

    public function add_admin_page(): void {
        add_menu_page(
            'Kaira Image Studio',
            'Image Studio',
            'manage_options',
            'kaira-image-studio',
            array( $this, 'render_page' ),
            'dashicons-camera',
            30
        );
    }

    public function enqueue_admin_assets( string $hook ): void {
        if ( 'toplevel_page_kaira-image-studio' !== $hook ) {
            return;
        }

        wp_enqueue_style(
            'kaira-image-studio',
            get_template_directory_uri() . '/assets/css/image-studio.css',
            array(),
            KAIRA_VERSION
        );

        wp_enqueue_script(
            'kaira-image-studio',
            get_template_directory_uri() . '/assets/js/image-studio.js',
            array(),
            KAIRA_VERSION,
            true
        );

        wp_localize_script( 'kaira-image-studio', 'kairaStudio', array(
            'ajaxUrl' => admin_url( 'admin-ajax.php' ),
            'nonce'   => wp_create_nonce( 'kaira_generate_image' ),
        ) );
    }

    public function render_page(): void {
        if ( ! $this->client->is_configured() ) {
            echo '<div class="wrap"><h1>Kaira Image Studio</h1>';
            echo '<div class="notice notice-error"><p>Replicate API token not configured. Add <code>define( \'KAIRA_REPLICATE_API_TOKEN\', \'your-token\' );</code> to <code>wp-config.php</code>.</p></div>';
            echo '</div>';
            return;
        }

        ?>
        <div class="wrap kaira-studio-wrap">
            <h1>Kaira Image Studio</h1>

            <div class="kaira-studio-grid">
                <div class="kaira-studio-form">
                    <h2>Generate New Image</h2>

                    <table class="form-table">
                        <tr>
                            <th><label for="kaira-scene">Scene Type</label></th>
                            <td>
                                <select id="kaira-scene" class="regular-text">
                                    <option value="">-- Select Scene --</option>
                                    <option value="destination">Destination / Travel</option>
                                    <option value="fashion">Fashion / High Fashion</option>
                                    <option value="lifestyle">Lifestyle</option>
                                    <option value="fitness">Fitness / Gym</option>
                                    <option value="intimate">Intimate / Bathtub</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="kaira-preset">Preset</label></th>
                            <td>
                                <select id="kaira-preset" class="regular-text">
                                    <option value="">-- Custom Prompt --</option>
                                    <option value="mykonos_pool">Mykonos Poolside</option>
                                    <option value="paris_night">Paris Night Out</option>
                                    <option value="bali_sunset">Bali Sunset</option>
                                    <option value="dubai_skyline">Dubai Skyline</option>
                                    <option value="tulum_beach">Tulum Beach</option>
                                    <option value="amalfi_coast">Amalfi Coast</option>
                                    <option value="gym_workout">Gym Workout</option>
                                    <option value="high_fashion">High Fashion Editorial</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="kaira-prompt">Scene Description</label></th>
                            <td>
                                <textarea id="kaira-prompt" class="large-text" rows="4" placeholder="Describe the scene, outfit, lighting, mood..."></textarea>
                            </td>
                        </tr>
                    </table>

                    <p>
                        <button type="button" id="kaira-generate-btn" class="button button-primary button-hero">
                            Generate Image
                        </button>
                        <span id="kaira-spinner" class="spinner" style="float:none;"></span>
                    </p>
                </div>

                <div class="kaira-studio-preview">
                    <h2>Preview</h2>
                    <div id="kaira-preview-area">
                        <p class="description">Generated image will appear here.</p>
                    </div>
                    <div id="kaira-preview-actions" style="display:none;">
                        <button type="button" id="kaira-save-btn" class="button button-primary">
                            Save to Media Library
                        </button>
                        <button type="button" id="kaira-discard-btn" class="button">
                            Discard
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }

    public function ajax_generate_image(): void {
        check_ajax_referer( 'kaira_generate_image', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( 'Unauthorized.', 403 );
        }

        $scene  = sanitize_text_field( wp_unslash( $_POST['scene'] ?? '' ) );
        $preset = sanitize_text_field( wp_unslash( $_POST['preset'] ?? '' ) );
        $prompt = sanitize_textarea_field( wp_unslash( $_POST['prompt'] ?? '' ) );
        $action_type = sanitize_text_field( wp_unslash( $_POST['action_type'] ?? 'generate' ) );

        // Build the full prompt with Kaira identity prefix
        $identity_prompt = $this->get_identity_prompt();
        $scene_prompt    = $preset ? $this->get_preset_prompt( $preset ) : $prompt;
        $full_prompt     = $identity_prompt . ' ' . $scene_prompt;

        $negative_prompt = 'deformed, distorted, disfigured, poorly drawn, bad anatomy, wrong anatomy, extra limbs, missing limbs, floating limbs, mutated hands, extra fingers, missing fingers, blurry, low quality, watermark, text, signature';

        // Model version — update this to your trained Kaira LoRA version ID
        $model_version = get_option( 'kaira_replicate_model_version', '' );

        if ( empty( $model_version ) ) {
            wp_send_json_error( 'No model version configured. Set it in Settings > Kaira.' );
        }

        if ( $action_type === 'save' ) {
            $image_url = sanitize_url( wp_unslash( $_POST['image_url'] ?? '' ) );
            $title     = 'Kaira ' . ucfirst( $scene ) . ' ' . gmdate( 'Y-m-d H:i' );
            $result    = $this->client->import_to_media_library( $image_url, $title, $scene );

            if ( is_wp_error( $result ) ) {
                wp_send_json_error( $result->get_error_message() );
            }

            wp_send_json_success( array(
                'attachment_id' => $result,
                'message'       => 'Image saved to Media Library.',
            ) );
        }

        $result = $this->client->create_prediction( $model_version, array(
            'prompt'          => $full_prompt,
            'negative_prompt' => $negative_prompt,
            'num_outputs'     => 1,
            'width'           => 1024,
            'height'          => 1536,
        ) );

        if ( is_wp_error( $result ) ) {
            wp_send_json_error( $result->get_error_message() );
        }

        // If using Prefer: wait, the result may already be complete
        if ( $result['status'] !== 'succeeded' && ! empty( $result['id'] ) ) {
            $result = $this->client->poll_prediction( $result['id'] );
            if ( is_wp_error( $result ) ) {
                wp_send_json_error( $result->get_error_message() );
            }
        }

        if ( $result['status'] === 'failed' ) {
            wp_send_json_error( 'Image generation failed: ' . ( $result['error'] ?? 'Unknown error' ) );
        }

        $output_url = is_array( $result['output'] ) ? $result['output'][0] : $result['output'];

        wp_send_json_success( array(
            'image_url' => $output_url,
            'status'    => $result['status'],
        ) );
    }

    private function get_identity_prompt(): string {
        return 'A stunning woman named Kaira with radiant tan skin, striking dark eyes, long flowing dark hair, high cheekbones, and a confident elegant expression. She has a fit, graceful figure and exudes luxury and sophistication.';
    }

    private function get_preset_prompt( string $preset ): string {
        $presets = array(
            'mykonos_pool'  => 'Relaxing by an infinity pool in Mykonos, Greece, wearing a designer swimsuit, white-washed buildings in the background, golden hour lighting, Mediterranean luxury.',
            'paris_night'   => 'Walking down a cobblestone Parisian street at night, wearing an elegant black dress, Eiffel Tower softly lit in the background, warm streetlamp glow, cinematic.',
            'bali_sunset'   => 'Standing on a cliff overlooking the ocean in Bali at sunset, wearing a flowing white dress, tropical foliage, golden orange sky, serene and majestic.',
            'dubai_skyline' => 'On a luxury rooftop terrace in Dubai, wearing a glamorous evening gown, Burj Khalifa and city skyline in the background, twilight blue hour, opulent.',
            'tulum_beach'   => 'On a pristine beach in Tulum, Mexico, wearing a bohemian bikini and sarong, turquoise water, rustic beach cabana, relaxed tropical luxury.',
            'amalfi_coast'  => 'On a terrace overlooking the Amalfi Coast, wearing a sundress and wide-brimmed hat, colorful Italian coastal village below, bright Mediterranean sunlight.',
            'gym_workout'   => 'In a high-end modern gym, wearing stylish athletic wear, mid-workout with perfect form, dramatic lighting, fitness and strength.',
            'high_fashion'  => 'High fashion editorial shoot in a luxury studio, wearing a couture gown, dramatic lighting with shadows, confident powerful pose, fashion magazine quality.',
        );

        return $presets[ $preset ] ?? '';
    }
}

// Settings page for model version
function kaira_register_settings(): void {
    add_option( 'kaira_replicate_model_version', '' );

    register_setting( 'general', 'kaira_replicate_model_version', array(
        'type'              => 'string',
        'sanitize_callback' => 'sanitize_text_field',
    ) );

    add_settings_field(
        'kaira_replicate_model_version',
        'Kaira Replicate Model Version',
        function () {
            $value = get_option( 'kaira_replicate_model_version', '' );
            echo '<input type="text" name="kaira_replicate_model_version" value="' . esc_attr( $value ) . '" class="regular-text" placeholder="e.g. abc123..." />';
            echo '<p class="description">The Replicate model version ID for your trained Kaira LoRA.</p>';
        },
        'general'
    );
}
add_action( 'admin_init', 'kaira_register_settings' );
```

**Step 2: Write image-studio.js**

```javascript
/**
 * Kaira Image Studio — Admin JS
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var generateBtn = document.getElementById('kaira-generate-btn');
        var saveBtn = document.getElementById('kaira-save-btn');
        var discardBtn = document.getElementById('kaira-discard-btn');
        var spinner = document.getElementById('kaira-spinner');
        var previewArea = document.getElementById('kaira-preview-area');
        var previewActions = document.getElementById('kaira-preview-actions');
        var currentImageUrl = '';

        if (!generateBtn) return;

        // Populate prompt from preset
        var presetSelect = document.getElementById('kaira-preset');
        if (presetSelect) {
            presetSelect.addEventListener('change', function () {
                if (this.value) {
                    document.getElementById('kaira-prompt').value = '';
                    document.getElementById('kaira-prompt').placeholder = 'Using preset: ' + this.options[this.selectedIndex].text;
                } else {
                    document.getElementById('kaira-prompt').placeholder = 'Describe the scene, outfit, lighting, mood...';
                }
            });
        }

        generateBtn.addEventListener('click', function () {
            var scene = document.getElementById('kaira-scene').value;
            var preset = document.getElementById('kaira-preset').value;
            var prompt = document.getElementById('kaira-prompt').value;

            if (!scene) {
                alert('Please select a scene type.');
                return;
            }

            if (!preset && !prompt) {
                alert('Please select a preset or enter a scene description.');
                return;
            }

            generateBtn.disabled = true;
            spinner.classList.add('is-active');
            previewArea.innerHTML = '<p>Generating image... This may take 30-60 seconds.</p>';
            previewActions.style.display = 'none';

            var formData = new FormData();
            formData.append('action', 'kaira_generate_image');
            formData.append('nonce', kairaStudio.nonce);
            formData.append('scene', scene);
            formData.append('preset', preset);
            formData.append('prompt', prompt);
            formData.append('action_type', 'generate');

            fetch(kairaStudio.ajaxUrl, {
                method: 'POST',
                body: formData,
            })
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    generateBtn.disabled = false;
                    spinner.classList.remove('is-active');

                    if (data.success) {
                        currentImageUrl = data.data.image_url;
                        previewArea.innerHTML = '<img src="' + currentImageUrl + '" style="max-width:100%;border:1px solid #333;" />';
                        previewActions.style.display = '';
                    } else {
                        previewArea.innerHTML = '<p style="color:#d63638;">Error: ' + (data.data || 'Unknown error') + '</p>';
                    }
                })
                .catch(function (err) {
                    generateBtn.disabled = false;
                    spinner.classList.remove('is-active');
                    previewArea.innerHTML = '<p style="color:#d63638;">Request failed: ' + err.message + '</p>';
                });
        });

        if (saveBtn) {
            saveBtn.addEventListener('click', function () {
                if (!currentImageUrl) return;

                saveBtn.disabled = true;
                saveBtn.textContent = 'Saving...';

                var formData = new FormData();
                formData.append('action', 'kaira_generate_image');
                formData.append('nonce', kairaStudio.nonce);
                formData.append('action_type', 'save');
                formData.append('image_url', currentImageUrl);
                formData.append('scene', document.getElementById('kaira-scene').value);

                fetch(kairaStudio.ajaxUrl, {
                    method: 'POST',
                    body: formData,
                })
                    .then(function (res) { return res.json(); })
                    .then(function (data) {
                        saveBtn.disabled = false;
                        saveBtn.textContent = 'Save to Media Library';

                        if (data.success) {
                            previewArea.innerHTML += '<p style="color:#00a32a;">Saved to Media Library (ID: ' + data.data.attachment_id + ')</p>';
                            previewActions.style.display = 'none';
                        } else {
                            alert('Save failed: ' + (data.data || 'Unknown error'));
                        }
                    })
                    .catch(function (err) {
                        saveBtn.disabled = false;
                        saveBtn.textContent = 'Save to Media Library';
                        alert('Save failed: ' + err.message);
                    });
            });
        }

        if (discardBtn) {
            discardBtn.addEventListener('click', function () {
                currentImageUrl = '';
                previewArea.innerHTML = '<p class="description">Generated image will appear here.</p>';
                previewActions.style.display = 'none';
            });
        }
    });
})();
```

**Step 3: Write image-studio.css**

```css
/* Kaira Image Studio — Admin Styles */

.kaira-studio-wrap {
    max-width: 1200px;
}

.kaira-studio-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-top: 1.5rem;
}

.kaira-studio-form,
.kaira-studio-preview {
    background: #fff;
    padding: 1.5rem;
    border: 1px solid #c3c4c7;
}

.kaira-studio-preview img {
    max-width: 100%;
    height: auto;
}

#kaira-preview-actions {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
}

@media (max-width: 960px) {
    .kaira-studio-grid {
        grid-template-columns: 1fr;
    }
}
```

**Step 4: Include in functions.php**

Add at the end of `functions.php`:

```php
require get_template_directory() . '/inc/replicate-api.php';

if ( is_admin() ) {
    require get_template_directory() . '/inc/image-studio.php';
    new Kaira_Image_Studio();
}
```

**Step 5: Verify PHP syntax for all new files**

```bash
php -l kaira-theme/inc/image-studio.php
```

Expected: `No syntax errors detected`

**Step 6: Commit**

```bash
git add kaira-theme/inc/image-studio.php kaira-theme/assets/js/image-studio.js kaira-theme/assets/css/image-studio.css kaira-theme/functions.php
git commit -m "feat: add Kaira Image Studio admin panel — generate, preview, save to media library"
```

---

### Task 15: Scroll Animations JavaScript

**Files:**
- Create: `kaira-theme/assets/js/main.js`
- Modify: `kaira-theme/functions.php`

**Step 1: Write main.js for scroll animations and sticky header**

```javascript
/**
 * Kaira Theme — Main JS
 * Handles scroll animations and sticky header.
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        // --- Sticky Header ---
        var header = document.querySelector('.kaira-header');
        if (header) {
            window.addEventListener('scroll', function () {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }, { passive: true });
        }

        // --- Scroll Fade-In Animations ---
        var fadeElements = document.querySelectorAll('.kaira-fade-in');
        if (fadeElements.length && 'IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            fadeElements.forEach(function (el) {
                observer.observe(el);
            });
        }
    });
})();
```

**Step 2: Enqueue in functions.php**

Add to `kaira_enqueue_assets()`:

```php
wp_enqueue_script(
    'kaira-main',
    get_template_directory_uri() . '/assets/js/main.js',
    array(),
    KAIRA_VERSION,
    true
);
```

**Step 3: Commit**

```bash
git add kaira-theme/assets/js/main.js kaira-theme/functions.php
git commit -m "feat: add scroll animations and sticky header JS"
```

---

### Task 16: Create Screenshot and Package Theme

**Files:**
- Create: `kaira-theme/screenshot.png`

**Step 1: Create a theme screenshot**

The screenshot should be 1200x900px. Use one of the existing Kaira images as a base, or generate a placeholder:

```bash
# Create a simple placeholder screenshot (replace with actual Kaira image later)
convert -size 1200x900 xc:'#0a0a0a' \
    -fill '#c9a84c' -gravity center -pointsize 72 -annotate 0 'Explore With Kaira' \
    -fill '#f5f0e8' -gravity center -pointsize 28 -annotate +0+60 'Luxury Travel & Lifestyle' \
    kaira-theme/screenshot.png
```

If `convert` (ImageMagick) is not available, manually place a 1200x900 PNG in the theme directory.

**Step 2: Verify theme files are complete**

```bash
find kaira-theme -type f | sort
```

Expected output should include all created files: `style.css`, `functions.php`, `theme.json`, all templates, parts, inc files, assets.

**Step 3: Create ZIP for deployment**

```bash
cd /Users/curtisvaughan/Kaira && zip -r kaira-theme.zip kaira-theme/ -x "*.DS_Store"
```

**Step 4: Commit**

```bash
git add kaira-theme/screenshot.png
git commit -m "feat: add theme screenshot and finalize theme package"
```

---

### Task 17: Deployment to Bluehost

**This is a manual step — instructions for the user:**

1. **Add Replicate API token to wp-config.php:**
   - Log into Bluehost cPanel or File Manager
   - Edit `wp-config.php` in your WordPress root
   - Add before "That's all, stop editing!":
   ```php
   define( 'KAIRA_REPLICATE_API_TOKEN', 'r8_your_token_here' );
   ```

2. **Upload the theme:**
   - Go to WordPress Admin → Appearance → Themes → Add New → Upload Theme
   - Upload `kaira-theme.zip`
   - Activate the theme

3. **Deactivate Divi:**
   - Once Kaira theme is active, you can deactivate/delete Divi

4. **Configure WooCommerce:**
   - Install WooCommerce plugin if not already installed
   - Run through WooCommerce setup wizard

5. **Create required pages:**
   - Create "Gallery" page → assign "Gallery Page" template
   - Create "About" page → assign "About Page" template
   - Create "Shop" page → WooCommerce will handle this

6. **Set up navigation:**
   - Go to Appearance → Editor → Navigation
   - Verify menu links point to correct pages

7. **Configure Replicate model:**
   - Go to Settings → General → find "Kaira Replicate Model Version"
   - Enter your trained LoRA model version ID

8. **Add gallery categories:**
   - Go to Gallery → Gallery Categories
   - Add: Travel, Fashion, Lifestyle, Fitness

---

### Task 18: LoRA Training Preparation

**This is a guidance step — instructions for training a Kaira LoRA on Replicate:**

1. **Prepare training images:**
   - Select 20-30 of the best, most consistent Kaira images from the existing library
   - Ensure variety: different angles, outfits, lighting, but same face/identity
   - Resize to 1024x1024 or appropriate aspect ratios
   - Name files descriptively (optional but helpful)

2. **Create training captions:**
   - For each image, write a caption describing Kaira and the scene
   - Use consistent trigger word like `KAIRA` in every caption
   - Example: `KAIRA, a stunning woman with tan skin and dark hair, standing on a yacht in Mykonos wearing a red dress`

3. **Train on Replicate:**
   - Use `ostris/flux-dev-lora-trainer` or equivalent on Replicate
   - Upload training images as a ZIP
   - Set trigger word to `KAIRA`
   - Recommended: 1500-3000 training steps, learning rate 1e-4
   - Training typically costs $5-15 on Replicate

4. **Test the model:**
   - After training completes, copy the model version ID
   - Add it to WordPress Settings → General → Kaira Replicate Model Version
   - Test with the Image Studio admin panel

---

## Summary

| Task | Description | Estimated Complexity |
|------|-------------|---------------------|
| 1 | Scaffold theme directory | Simple |
| 2 | Design system in theme.json | Medium |
| 3 | Download web fonts | Simple |
| 4 | Custom CSS | Medium |
| 5 | Header template part | Simple |
| 6 | Footer template part | Medium |
| 7 | Front page template | Medium |
| 8 | Index, single, archive templates | Medium |
| 9 | Gallery page + JS | Medium |
| 10 | About page template | Simple |
| 11 | Custom post types | Medium |
| 12 | WooCommerce integration | Medium |
| 13 | Replicate API client | Medium |
| 14 | Image Studio admin panel | Complex |
| 15 | Scroll animations JS | Simple |
| 16 | Screenshot + packaging | Simple |
| 17 | Deployment to Bluehost | Manual |
| 18 | LoRA training preparation | Manual/Guidance |
