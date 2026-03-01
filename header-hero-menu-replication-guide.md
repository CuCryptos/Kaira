# CurtisJCooks Header, Hero & Menu System — Replication Guide

> How the header, hero images, and menu were built on CurtisJCooks.com using a Kadence Free child theme. Use this as a reference for replicating the design on another site.

---

## Overview

This is a **Kadence Free child theme** with a fully custom header, immersive hero sections, and a transparent-header-over-hero approach. The key challenge is overriding Kadence's deeply nested header HTML with `!important` rules to get the transparent header working.

**Source theme:** `cjc-kadence-child` at `/wp-content/themes/cjc-kadence-child/`

---

## 1. Prerequisites

- **Parent Theme:** [Kadence Free](https://wordpress.org/themes/kadence/) (must be installed)
- **Child Theme:** Create a child theme with `Template: kadence` in `style.css`
- **Fonts:** Google Fonts — Lora (headings), Source Sans 3 (body), Playfair Display (accent)
- **Two logos:** A dark logo for scrolled/regular state and a white logo for transparent overlay

---

## 2. Design Tokens (tokens.css)

Create `assets/css/tokens.css` with your CSS custom properties. This is the foundation everything else references:

```css
:root {
    /* Colors */
    --cjc-ocean-deep: #0e7490;        /* primary accent (teal) */
    --cjc-volcanic-earth: #9a3412;    /* headings (burnt orange) */
    --cjc-sunset-gold: #d97706;       /* secondary accent (amber) */
    --cjc-warm-sand: #fefce8;         /* light backgrounds */
    --cjc-lava-black: #1c1917;        /* text */
    --cjc-koa-wood: #78350f;          /* dark brown */
    --cjc-coconut-cream: #fffbeb;     /* page background */
    --cjc-reef-gray: #57534e;         /* body text */
    --cjc-mist: #f5f5f4;

    /* Derived (hover/focus states) */
    --cjc-ocean-deep-light: #0891b2;
    --cjc-ocean-deep-dark: #0c4a6e;
    --cjc-volcanic-earth-light: #c2410c;
    --cjc-sunset-gold-light: #f59e0b;

    /* Accent */
    --cjc-plumeria-pink: #e11d48;
    --cjc-ti-leaf: #15803d;

    /* Typography */
    --cjc-font-heading: 'Lora', Georgia, serif;
    --cjc-font-body: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
    --cjc-font-accent: 'Playfair Display', Georgia, serif;

    /* Type Scale (fluid) */
    --cjc-text-hero: clamp(2.5rem, 5vw, 3.5rem);
    --cjc-text-h1: clamp(2rem, 4vw, 2.75rem);
    --cjc-text-h2: clamp(1.5rem, 3vw, 1.75rem);
    --cjc-text-h3: 1.25rem;
    --cjc-text-body: 1.125rem;
    --cjc-text-small: 0.875rem;
    --cjc-text-caption: 0.8125rem;

    --cjc-leading-tight: 1.2;
    --cjc-leading-normal: 1.6;
    --cjc-leading-relaxed: 1.8;

    /* Spacing */
    --cjc-space-xs: 0.25rem;
    --cjc-space-sm: 0.5rem;
    --cjc-space-md: 1rem;
    --cjc-space-lg: 1.5rem;
    --cjc-space-xl: 2rem;
    --cjc-space-2xl: 3rem;
    --cjc-space-3xl: 4rem;
    --cjc-space-4xl: 6rem;

    /* Layout */
    --cjc-site-width: 1200px;
    --cjc-content-width: 720px;
    --cjc-card-width: 800px;

    /* Shadows */
    --cjc-shadow-sm: 0 1px 2px rgba(28, 25, 23, 0.06);
    --cjc-shadow-md: 0 4px 6px -1px rgba(28, 25, 23, 0.08), 0 2px 4px -2px rgba(28, 25, 23, 0.06);
    --cjc-shadow-lg: 0 10px 15px -3px rgba(28, 25, 23, 0.08), 0 4px 6px -4px rgba(28, 25, 23, 0.06);
    --cjc-shadow-xl: 0 20px 25px -5px rgba(28, 25, 23, 0.1), 0 8px 10px -6px rgba(28, 25, 23, 0.08);

    /* Borders */
    --cjc-radius-sm: 4px;
    --cjc-radius-md: 8px;
    --cjc-radius-lg: 12px;
    --cjc-radius-full: 9999px;

    /* Transitions */
    --cjc-transition-fast: 150ms ease;
    --cjc-transition-base: 250ms ease;
    --cjc-transition-slow: 400ms ease;
}
```

---

## 3. Font Loading (functions.php)

**GOTCHA: WordPress `esc_url()` breaks multi-family Google Fonts URLs.** You MUST enqueue each font family as a separate `wp_enqueue_style()` call:

```php
add_action('wp_enqueue_scripts', function () {
    // THREE separate calls — WordPress breaks &family= in combined URLs
    wp_enqueue_style('cjc-font-lora',
        'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&display=swap',
        [], null);
    wp_enqueue_style('cjc-font-source-sans',
        'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600&display=swap',
        [], null);
    wp_enqueue_style('cjc-font-playfair',
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap',
        [], null);
});
```

Also add preconnect hints in `wp_head`:

```php
add_action('wp_head', function () {
    echo '<link rel="preconnect" href="https://fonts.googleapis.com">' . "\n";
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
}, 1);
```

---

## 4. Transparent Header — The Critical Part

This was the biggest challenge. Kadence has NO `kadence_transparent_header` filter — it does not exist. The transparent header is controlled via the `kadence_post_layout` filter.

### Step A: Enable transparent header in functions.php

```php
add_filter('kadence_post_layout', function ($layout) {
    // Disable Kadence's built-in title area (our templates render titles)
    if (is_page() || is_singular('post')) {
        $layout['title'] = 'normal';
    }
    // Enable transparent header on ALL page types
    $layout['transparent'] = 'enable';
    return $layout;
});
```

This makes Kadence add `transparent-header` and `mobile-transparent-header` body classes, and sets `#masthead { position: absolute; z-index: 100; background: transparent; }` via inline CSS.

### Step B: Override Kadence's inline background (style.css)

**GOTCHA: Kadence also outputs `#masthead { background: #ffffff; }` as inline CSS.** You must override it with higher specificity using `.transparent-header #masthead`:

```css
/* Override ALL of Kadence's nested header wrappers */
.transparent-header #masthead,
.transparent-header .site-header,
.transparent-header .site-header .site-header-wrap,
.transparent-header .site-header .site-header-inner-wrap,
.transparent-header .site-header .site-header-upper-wrap,
.transparent-header .site-header .site-header-upper-inner-wrap,
.transparent-header .site-header .site-main-header-wrap,
.transparent-header .site-header .site-header-row-container-inner,
.transparent-header .site-header .site-container {
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
}
```

### Step C: White text/links for transparent header

```css
.transparent-header .site-header .site-title,
.transparent-header .site-header .site-branding a,
.transparent-header .site-header .primary-menu-container > ul > li > a,
.transparent-header .site-header .primary-menu-container > ul > li > a .kadence-menu-toggle-open,
.transparent-header .site-header .nav--toggle-sub .dropdown-nav-toggle,
.transparent-header .site-header .drawer-toggle,
.transparent-header .site-header .search-toggle-open,
.transparent-header .site-header a {
    color: white !important;
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6);
}

/* Dropdown arrows → white */
.transparent-header .site-header .nav--toggle-sub .dropdown-nav-toggle svg,
.transparent-header .site-header .primary-menu-container .menu-item-has-children > a .dropdown-nav-toggle,
.transparent-header .site-header .primary-menu-container .menu-item-has-children > a::after {
    color: white !important;
    fill: white !important;
}

/* Search icon → white */
.transparent-header .site-header .search-toggle-open svg {
    color: white !important;
    fill: white !important;
}

/* Hover state → gold */
.transparent-header .site-header .primary-menu-container > ul > li > a:hover {
    color: var(--cjc-sunset-gold) !important;
    background: rgba(255, 255, 255, 0.1);
}
```

### Step D: Kill wrapper spacing

```css
.transparent-header #inner-wrap {
    padding-top: 0;
    margin-top: 0;
}

.single-post .content-area,
.home .content-area,
.page .content-area,
.archive .content-area {
    margin-top: 0;
    margin-bottom: 0;
}

.single-post .entry-content-wrap,
.home .entry-content-wrap,
.page .entry-content-wrap,
.archive .entry-content-wrap {
    padding: 0;
}

.transparent-header .site {
    padding-top: 0;
}
```

### Step E: White logo swap

Kadence has a built-in transparent header logo swap. In the Customizer, set:
- **Custom Logo** = your dark/normal logo
- **Transparent Header Logo** = your white logo

Kadence renders the white logo when `transparent-header` is active. No CSS filter needed.

---

## 5. Header Layout (style.css)

The header uses Kadence's 3-section row (Left/Center/Right) styled as a flex row:

```css
/* 3-column flex: Logo Left | Nav Center | Search Right */
#masthead .site-header-row {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    max-width: var(--cjc-site-width, 1200px);
    margin: 0 auto;
    padding: 0.5rem var(--cjc-space-lg) !important;
}

/* Left (logo): fixed width */
#masthead .site-header-main-section-left.site-header-section {
    flex: 0 0 auto !important;
    width: auto !important;
}

/* Center (nav): grow to fill */
#masthead .site-header-main-section-center.site-header-section {
    flex: 1 1 auto !important;
    display: flex !important;
    justify-content: center !important;
}

/* Right (search): fixed width */
#masthead .site-header-main-section-right.site-header-section {
    flex: 0 0 auto !important;
    width: auto !important;
}
```

### Nav link styling:

```css
.site-header .primary-menu-container > ul {
    justify-content: center;
    gap: 0.25rem;
}

.site-header .primary-menu-container > ul > li > a {
    font-family: var(--cjc-font-body);
    font-weight: 600;
    font-size: 0.9rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--cjc-lava-black);
    padding: 0.5rem 1.1rem;
    border-radius: var(--cjc-radius-sm, 4px);
    transition: color var(--cjc-transition-fast), background 0.2s ease;
}

.site-header .primary-menu-container > ul > li > a:hover {
    color: var(--cjc-ocean-deep);
    background: rgba(14, 116, 144, 0.06);
}

/* Active item */
.site-header .primary-menu-container > ul > li.current-menu-item > a,
.site-header .primary-menu-container > ul > li.current-menu-ancestor > a {
    color: var(--cjc-ocean-deep);
}
```

### Dropdown menus:

```css
.site-header .primary-menu-container ul ul {
    background: white;
    border: 1px solid var(--cjc-warm-sand);
    border-top: 3px solid var(--cjc-ocean-deep);
    border-radius: 0 0 var(--cjc-radius-md) var(--cjc-radius-md);
    box-shadow: var(--cjc-shadow-lg);
    min-width: 220px;
}

.site-header .primary-menu-container ul ul li a {
    font-size: 0.85rem;
    font-weight: 500;
    text-transform: none;
    letter-spacing: 0;
    color: var(--cjc-reef-gray);
    padding: 0.6rem 1.25rem;
    transition: background 0.2s ease, color 0.2s ease;
}

.site-header .primary-menu-container ul ul li a:hover {
    background-color: var(--cjc-warm-sand);
    color: var(--cjc-ocean-deep);
}
```

### Search drawer:

```css
#search-drawer .drawer-inner .drawer-content {
    background: rgba(255, 251, 235, 0.97);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}

#search-drawer .search-field {
    font-family: var(--cjc-font-body);
    font-size: 1.1rem;
    border: 2px solid var(--cjc-warm-sand);
    border-radius: var(--cjc-radius-md);
    padding: 0.75rem 1rem;
    background: white;
}

#search-drawer .search-field:focus {
    border-color: var(--cjc-ocean-deep);
    outline: none;
    box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.15);
}
```

### Mobile header:

```css
@media (max-width: 767px) {
    #masthead .site-header-row {
        padding: 0.5rem 1rem !important;
    }

    .site-header .custom-logo {
        max-height: 40px;
    }

    .site-header .menu-toggle-open {
        color: var(--cjc-lava-black);
    }

    .transparent-header .site-header .menu-toggle-open {
        color: white !important;
    }

    .home.header--scrolled .site-header .menu-toggle-open {
        color: var(--cjc-lava-black) !important;
    }
}
```

---

## 6. Hero Sections

### Recipe Post Hero (single.php — 70vh)

**HTML structure:**

```html
<section class="recipe-hero">
    <img class="recipe-hero__image" src="<?php echo esc_url($featured_img_url); ?>"
         alt="<?php echo esc_attr(get_the_title()); ?>">
    <div class="recipe-hero__overlay" aria-hidden="true"></div>
    <div class="recipe-hero__content">
        <a class="recipe-hero__category" href="<?php echo esc_url($cat_link); ?>">
            <?php echo esc_html($cat_name); ?>
        </a>
        <h1 class="recipe-hero__title"><?php the_title(); ?></h1>
        <div class="recipe-hero__meta">
            <span><?php echo esc_html(get_the_date()); ?></span>
            <span>by <?php the_author(); ?></span>
            <?php if ($total_time) : ?>
                <span><?php echo esc_html($total_time); ?></span>
            <?php endif; ?>
        </div>
    </div>
</section>
```

**CSS (components.css):**

```css
.recipe-hero {
    position: relative;
    width: 100%;
    height: 70vh;
    min-height: 400px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.recipe-hero__image {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    z-index: 1;
}

/* Dark gradient + teal tint overlay */
.recipe-hero__overlay {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(to bottom,
        rgba(28,25,23,0.6) 0%,       /* dark top for header readability */
        rgba(14,116,144,0.15) 15%,    /* teal tint */
        rgba(14,116,144,0.1) 40%,
        rgba(28,25,23,0.6) 60%,
        rgba(28,25,23,0.9) 100%       /* dark bottom */
    );
    z-index: 2;
}

/* Kapa diamond pattern overlay */
.recipe-hero::after {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20 Z' fill='none' stroke='%23fefce8' stroke-width='0.5' opacity='0.06'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 40px 40px;
    z-index: 2;
    pointer-events: none;
}

/* Wave edge at bottom — CRITICAL: bottom: -1px prevents gap */
.recipe-hero::before {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0; width: 100%; height: 48px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 48' preserveAspectRatio='none'%3E%3Cpath d='M0 48 L0 24 Q180 0 360 24 Q540 48 720 24 Q900 0 1080 24 Q1260 48 1440 24 L1440 48 Z' fill='%23fffbeb'/%3E%3C/svg%3E");
    background-size: 100% 48px;
    background-repeat: no-repeat;
    z-index: 4;
}

.recipe-hero__content {
    position: relative;
    z-index: 3;
    text-align: center;
    max-width: var(--cjc-site-width);
    padding: var(--cjc-space-xl);
}

/* Category pill */
.recipe-hero__category {
    display: inline-block;
    background-color: var(--cjc-sunset-gold);
    color: white;
    font-family: var(--cjc-font-body);
    font-size: var(--cjc-text-small);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: var(--cjc-space-xs) var(--cjc-space-md);
    border-radius: var(--cjc-radius-full);
    margin-bottom: var(--cjc-space-lg);
    text-decoration: none;
}

/* Title */
.recipe-hero__title {
    font-family: var(--cjc-font-heading);
    font-size: var(--cjc-text-hero);
    font-weight: 700;
    color: white;
    margin: 0 0 var(--cjc-space-sm) 0;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
    position: relative;
    padding-bottom: var(--cjc-space-lg);
}

/* Decorative wave accent under the title */
.recipe-hero__title::after {
    content: '';
    display: block;
    width: 120px;
    height: 12px;
    margin: var(--cjc-space-md) auto 0;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='12' viewBox='0 0 120 12'%3E%3Cpath d='M0 6 Q15 0 30 6 Q45 12 60 6 Q75 0 90 6 Q105 12 120 6' fill='none' stroke='%23d97706' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat center;
    opacity: 0.9;
}

/* Meta line with golden dot separators */
.recipe-hero__meta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--cjc-space-lg);
    color: var(--cjc-warm-sand);
    font-size: var(--cjc-text-small);
    font-family: var(--cjc-font-body);
    letter-spacing: 0.05em;
}

.recipe-hero__meta span + span::before {
    content: '\2022';
    color: var(--cjc-sunset-gold);
    margin-right: var(--cjc-space-lg);
    font-size: 0.75em;
}
```

**GOTCHA:** The wave edge `::before` must be at `bottom: -1px` (not `bottom: 0`). With `overflow: hidden` on the hero, `bottom: 0` sometimes creates a 1px gap.

### Homepage Hero (front-page.php — 100vh)

Same pattern but full viewport height with additional features:
- Bokeh particles (CSS-animated floating dots)
- "Aloha" greeting text
- CTA button
- Scroll indicator arrow
- Frosted glass header on scroll (see Section 7)

**HTML structure:**

```html
<section class="homepage-hero">
    <img class="homepage-hero__image" src="..." alt="...">
    <div class="homepage-hero__overlay" aria-hidden="true"></div>

    <!-- Floating bokeh particles (CSS animated) -->
    <span class="homepage-hero__bokeh" style="left:10%;bottom:20%;width:6px;height:6px;
          --bokeh-duration:14s;--bokeh-delay:0s;--bokeh-opacity:0.2" aria-hidden="true"></span>
    <!-- ... more bokeh spans ... -->

    <div class="homepage-hero__content">
        <p class="homepage-hero__greeting" lang="haw">Aloha</p>
        <h1 class="homepage-hero__tagline">Your Tagline Here</h1>
        <p class="homepage-hero__subtitle">Your subtitle text</p>
        <a class="homepage-hero__cta" href="#">Explore</a>
    </div>

    <!-- Scroll indicator -->
    <div class="homepage-hero__scroll-indicator" aria-hidden="true">
        <svg viewBox="0 0 24 24">
            <path d="M12 5v14M5 12l7 7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
</section>
```

---

## 7. Frosted Glass Header on Scroll (Homepage Only)

When the user scrolls past 90% of the viewport on the homepage, the header switches from transparent to a frosted glass look.

### JavaScript (homepage.js):

```javascript
function initHeaderScroll() {
    var ticking = false;
    var scrolled = false;

    // Logo swap: get both logo URLs via wp_localize_script
    var logoImgs = document.querySelectorAll('.site-header .custom-logo');
    var darkSrc = (typeof cjcLogos !== 'undefined' && cjcLogos.dark) ? cjcLogos.dark : '';
    var whiteSrc = (typeof cjcLogos !== 'undefined' && cjcLogos.white) ? cjcLogos.white : '';

    function swapLogo(newSrc) {
        if (!newSrc) return;
        logoImgs.forEach(function (img) {
            img.src = newSrc;
            // Must also swap srcset — browser uses it over src
            ['srcset', 'data-srcset'].forEach(function (attr) {
                var val = img.getAttribute(attr);
                if (!val) return;
                if (newSrc.indexOf('transparent-dark') !== -1) {
                    img.setAttribute(attr, val.replace(/transparent-white/g, 'transparent-dark'));
                } else {
                    img.setAttribute(attr, val.replace(/transparent-dark/g, 'transparent-white'));
                }
            });
        });
    }

    window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(function () {
            var threshold = window.innerHeight * 0.9;
            var scrollY = window.pageYOffset || document.documentElement.scrollTop;
            var isPastThreshold = scrollY > threshold;

            if (isPastThreshold !== scrolled) {
                scrolled = isPastThreshold;
                if (scrolled) {
                    document.body.classList.add('header--scrolled');
                    swapLogo(darkSrc);
                } else {
                    document.body.classList.remove('header--scrolled');
                    swapLogo(whiteSrc);
                }
            }

            ticking = false;
        });
    }, { passive: true });
}
```

### PHP to pass logo URLs to JS (functions.php):

```php
add_action('wp_enqueue_scripts', function () {
    if (is_front_page()) {
        wp_enqueue_script('cjc-homepage', CJC_CHILD_URI . '/assets/js/homepage.js', [], CJC_CHILD_VERSION, true);

        $dark_logo_id = get_theme_mod('custom_logo');
        $white_logo_id = get_theme_mod('transparent_header_logo');
        wp_localize_script('cjc-homepage', 'cjcLogos', [
            'dark'  => $dark_logo_id ? wp_get_attachment_image_url($dark_logo_id, 'full') : '',
            'white' => $white_logo_id ? wp_get_attachment_image_url($white_logo_id, 'full') : '',
        ]);
    }
});
```

### CSS for the scrolled state:

```css
.home.header--scrolled .site-header,
.home.header--scrolled .site-header .site-header-wrap,
.home.header--scrolled .site-header .site-header-inner-wrap,
.home.header--scrolled .site-header .site-header-upper-wrap,
.home.header--scrolled .site-header .site-header-upper-inner-wrap,
.home.header--scrolled .site-header .site-main-header-wrap,
.home.header--scrolled .site-header .site-header-row-container-inner,
.home.header--scrolled .site-header .site-container {
    background: rgba(255, 251, 235, 0.92) !important;
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
    border-bottom: 1px solid rgba(254, 243, 199, 0.5) !important;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08) !important;
}

.home.header--scrolled .site-header {
    position: fixed;
    transition: background 0.4s ease, border 0.4s ease, box-shadow 0.4s ease;
}

/* Text reverts to dark */
.home.header--scrolled .site-header .site-title,
.home.header--scrolled .site-header .site-branding a,
.home.header--scrolled .site-header .primary-menu-container > ul > li > a,
.home.header--scrolled .site-header .search-toggle-open,
.home.header--scrolled .site-header a {
    color: var(--cjc-lava-black) !important;
    text-shadow: none;
}

.home.header--scrolled .site-header .primary-menu-container > ul > li > a:hover {
    color: var(--cjc-ocean-deep) !important;
    background: rgba(14, 116, 144, 0.06);
}

.home.header--scrolled .site-header .nav--toggle-sub .dropdown-nav-toggle svg {
    color: var(--cjc-lava-black) !important;
    fill: var(--cjc-lava-black) !important;
}

.home.header--scrolled .site-header .search-toggle-open svg {
    color: var(--cjc-lava-black) !important;
    fill: var(--cjc-lava-black) !important;
}
```

---

## 8. Kapa Cloth Dividers (patterns.css)

Decorative SVG dividers between sections. All use inline SVG data URIs (dual-color, teal + gold):

```css
/* Shared base */
.kapa-divider {
    width: 100%;
    background-repeat: repeat-x;
    background-position: center;
    position: relative;
}

/* Triangle pattern (teal + gold) */
.kapa-divider--triangle {
    height: 40px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='40' viewBox='0 0 48 40'%3E%3Cpath d='M0 40 L24 4 L48 40 Z' fill='%230e7490' opacity='0.5'/%3E%3Cpath d='M12 40 L24 14 L36 40 Z' fill='%23d97706' opacity='0.3'/%3E%3C/svg%3E");
    background-size: auto 40px;
    margin: 0;
}

/* Wave pattern */
.kapa-divider--wave {
    height: 32px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='32' viewBox='0 0 120 32'%3E%3Cpath d='M0 16 Q15 2 30 16 Q45 30 60 16 Q75 2 90 16 Q105 30 120 16' fill='none' stroke='%230e7490' stroke-width='3' opacity='0.6'/%3E%3Cpath d='M0 22 Q15 10 30 22 Q45 34 60 22 Q75 10 90 22 Q105 34 120 22' fill='none' stroke='%23d97706' stroke-width='1.5' opacity='0.35'/%3E%3C/svg%3E");
    background-size: auto 32px;
    margin: var(--cjc-space-lg) 0;
}

/* Zigzag pattern */
.kapa-divider--zigzag {
    height: 20px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='20' viewBox='0 0 40 20'%3E%3Cpath d='M0 20 L10 2 L20 20 L30 2 L40 20' fill='none' stroke='%230e7490' stroke-width='2.5' opacity='0.5'/%3E%3Cpath d='M5 20 L15 5 L25 20 L35 5' fill='none' stroke='%239a3412' stroke-width='1' opacity='0.25'/%3E%3C/svg%3E");
    background-size: auto 20px;
    margin: var(--cjc-space-lg) 0;
}

/* Koa Wood Texture (for recipe card header) */
.koa-wood-bg {
    background: linear-gradient(135deg,
        var(--cjc-koa-wood) 0%, #92400e 25%,
        var(--cjc-koa-wood) 50%, #92400e 75%,
        var(--cjc-koa-wood) 100%);
    background-size: 200px 200px;
}

/* Lava Rock Texture (for footer) */
.lava-rock-bg {
    background-color: var(--cjc-lava-black);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%23292524' opacity='0.4'/%3E%3C/svg%3E");
}
```

**Usage in templates:**

```html
<div class="kapa-divider kapa-divider--wave" aria-hidden="true"></div>
```

---

## 9. Scroll Behaviors (scroll-observer.js)

All use `IntersectionObserver` (no scroll event listeners except the reading progress bar):

```javascript
(function () {
    'use strict';

    // Reading progress bar — fills width as user scrolls
    function initReadingProgress() {
        var progressBar = document.querySelector('.reading-progress');
        if (!progressBar) return;
        window.addEventListener('scroll', function () {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var percentage = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = percentage + '%';
        }, { passive: true });
    }

    // Sticky nav — appears when hero scrolls out of view
    function initStickyNav() {
        var hero = document.querySelector('.recipe-hero');
        var nav = document.querySelector('.recipe-sticky-nav');
        if (!hero || !nav) return;
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    nav.classList.remove('recipe-sticky-nav--visible');
                } else {
                    nav.classList.add('recipe-sticky-nav--visible');
                }
            });
        }, { threshold: 0 });
        observer.observe(hero);
    }

    // Active section highlighting — highlights current nav link
    function initActiveSections() {
        var navLinks = document.querySelectorAll('.recipe-sticky-nav__link');
        if (!navLinks.length) return;
        var sections = [];
        navLinks.forEach(function (link) {
            var id = link.getAttribute('data-section');
            var el = document.getElementById(id);
            if (el) sections.push(el);
        });
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var link = document.querySelector(
                    '.recipe-sticky-nav__link[data-section="' + entry.target.id + '"]');
                if (!link) return;
                if (entry.isIntersecting) {
                    navLinks.forEach(function (l) { l.classList.remove('recipe-sticky-nav__link--active'); });
                    link.classList.add('recipe-sticky-nav__link--active');
                }
            });
        }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
        sections.forEach(function (s) { observer.observe(s); });
    }

    // Jump to Recipe button — visible while story section is in view
    function initJumpToRecipe() {
        var jumpBtn = document.querySelector('.jump-to-recipe');
        var story = document.querySelector('.recipe-story');
        var recipeCard = document.querySelector('.recipe-card');
        if (!jumpBtn || !story) return;
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                jumpBtn.classList.toggle('jump-to-recipe--visible', entry.isIntersecting);
            });
        }, { threshold: 0 });
        observer.observe(story);
        jumpBtn.addEventListener('click', function () {
            if (recipeCard) recipeCard.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Scroll-reveal animations — fade-up, respects prefers-reduced-motion
    function initScrollAnimations() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        var targets = document.querySelectorAll(
            '.recipe-story, .recipe-card, .related-recipes, .recipe-nutrition');
        targets.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        targets.forEach(function (el) { observer.observe(el); });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initReadingProgress();
        initStickyNav();
        initActiveSections();
        initJumpToRecipe();
        initScrollAnimations();
    });
})();
```

---

## 10. CSS Loading Order (functions.php)

The dependency chain matters — load in this order:

```php
add_action('wp_enqueue_scripts', function () {
    $v = CJC_CHILD_VERSION; // bump this when you change CSS/JS

    // 1. Parent theme
    wp_enqueue_style('kadence-parent', get_template_directory_uri() . '/style.css', [], $kadence_version);

    // 2. Google Fonts (3 separate calls)
    wp_enqueue_style('cjc-font-lora', '...', [], null);
    wp_enqueue_style('cjc-font-source-sans', '...', [], null);
    wp_enqueue_style('cjc-font-playfair', '...', [], null);

    // 3. Design tokens
    wp_enqueue_style('cjc-tokens', CJC_CHILD_URI . '/assets/css/tokens.css', ['kadence-parent'], $v);

    // 4. SVG patterns
    wp_enqueue_style('cjc-patterns', CJC_CHILD_URI . '/assets/css/patterns.css', ['cjc-tokens'], $v);

    // 5. Components (hero, recipe card, etc.)
    wp_enqueue_style('cjc-components', CJC_CHILD_URI . '/assets/css/components.css', ['cjc-tokens', 'cjc-patterns'], $v);

    // 6. Child style.css (header overrides, layout resets — loads LAST)
    wp_enqueue_style('cjc-child', CJC_CHILD_URI . '/style.css',
        ['kadence-parent', 'cjc-tokens', 'cjc-patterns', 'cjc-components'], $v);
});
```

---

## 11. Kadence Header Builder Configuration

In the Kadence Customizer (Appearance > Customize > Header):

1. **Header Layout:** Set to use Left / Center / Right sections in a single row
2. **Left section:** Site logo/branding
3. **Center section:** Primary navigation
4. **Right section:** Search toggle
5. **Transparent Header:** Enable in Customizer (our filter ensures it's always on)
6. **Transparent Header Logo:** Upload your white logo here

---

## Summary of All Gotchas

| Issue | Solution |
|-------|----------|
| No `kadence_transparent_header` filter | Use `kadence_post_layout` filter, set `$layout['transparent'] = 'enable'` |
| Kadence inline `#masthead { background: #fff }` | Override with `.transparent-header #masthead { background: transparent !important }` |
| Many nested Kadence header divs | Must target ALL wrapper classes with `background: transparent !important` |
| Google Fonts URL breaks with multiple families | Enqueue each family as a separate `wp_enqueue_style()` call |
| Wave edge gap at hero bottom | Use `bottom: -1px` on the `::before` pseudo-element |
| Logo swap on scroll | Use `wp_localize_script` to pass both logo URLs; swap `src` AND `srcset` in JS |
| Mobile hamburger color | Must separately target `.transparent-header .site-header .menu-toggle-open { color: white !important }` |
| Kadence wrapper spacing | Kill with `padding-top: 0` on `.transparent-header #inner-wrap` and `.content-area` |
| CSS load order | `style.css` (header overrides) must load AFTER `components.css` |
| Cache busting | Always bump `CJC_CHILD_VERSION` when changing CSS/JS — CDN caches by `?ver=` param |

---

## Source Files Reference

All files live in the `cjc-kadence-child` theme:

```
cjc-kadence-child/
├── style.css                     # Header CSS, transparent overrides, layout resets
├── functions.php                 # kadence_post_layout filter, font loading, script enqueue
├── single.php                    # Recipe post hero + full page template
├── front-page.php                # Homepage hero + full page template
├── assets/
│   ├── css/
│   │   ├── tokens.css            # Design tokens (colors, fonts, spacing)
│   │   ├── patterns.css          # Kapa cloth SVG dividers
│   │   ├── components.css        # Hero, recipe card, sidebar, related recipes, footer
│   │   └── print.css             # Print stylesheet
│   └── js/
│       ├── homepage.js           # Time-aware content, scroll reveals, header scroll, recipe picker
│       ├── scroll-observer.js    # Sticky nav, reading progress, scroll animations
│       └── recipe-interactive.js # Ingredient checkboxes, servings scaler
```
