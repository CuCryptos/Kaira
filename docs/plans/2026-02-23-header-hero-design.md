# Header/Hero Adaptation Design

## Goal

Adapt the CurtisJCooks immersive header/hero system for the Kaira block theme, bringing transparent-to-frosted-glass header transitions, gradient overlays with gold tint, bokeh particles, wave edge dividers, scroll indicators, and decorative SVG dividers — all mapped to Kaira's dark luxury aesthetic.

## Architecture

Kaira is a WordPress block theme (not a Kadence child), so we have direct control over template markup. No `!important` override hacks needed.

- **CSS-driven** — All visual effects (overlays, particles, wave edges, frosted glass) in `custom.css`
- **Block markup** — Hero sections use WordPress Cover blocks with custom CSS classes
- **JS-enhanced** — Scroll behavior (frosted glass transition, scroll indicator) in `main.js`

## Hero Variants

| Page Type | Height | Features |
|-----------|--------|----------|
| Homepage | 100vh | Bokeh particles, scroll indicator, CTA, full overlay |
| Single posts | 70vh | Featured image, category pill, post meta, wave edge |
| Pages/Archives | 50vh | Title overlay on gradient, wave edge |

## Color Mapping (CJC → Kaira)

| CJC Token | Kaira Equivalent | Usage |
|-----------|-----------------|-------|
| `--cjc-ocean-deep` (teal) | `--wp--preset--color--accent` (#c9a84c gold) | Accent tint in overlay |
| `--cjc-sunset-gold` (amber) | Gold shimmer gradient | Category pills, wave accents |
| `--cjc-coconut-cream` | `--wp--preset--color--text` (#f5f0e8) | Wave edge fill |
| `--cjc-lava-black` | `--wp--preset--color--background` (#0a0a0a) | Dark overlays |

## Components

### 1. Hero Overlay
Dark gradient with subtle gold tint at midpoint. Bottom fades to near-black.

```css
background: linear-gradient(to bottom,
    rgba(10, 10, 10, 0.5) 0%,
    rgba(201, 168, 76, 0.1) 20%,
    rgba(201, 168, 76, 0.05) 40%,
    rgba(10, 10, 10, 0.6) 60%,
    rgba(10, 10, 10, 0.9) 100%
);
```

### 2. Wave Edge
SVG wave pseudo-element at hero bottom. Fills with the background color (#0a0a0a) for a smooth transition.

### 3. Bokeh Particles (homepage only)
CSS-animated floating gold dots. 6-12 spans, 4-8px diameter, 0.1-0.25 opacity, slow float-up animation (10-20s duration). Randomized positions via inline styles.

### 4. Scroll Indicator (homepage only)
Animated chevron SVG at bottom of hero. Bouncing animation, fades out when user scrolls past hero.

### 5. Frosted Glass Header Enhancement
Current: transparent → dark blur on scroll at 50px.
New on homepage: transparent (white text) → dark frosted glass at 90vh scroll threshold. Logo remains text-based (no image swap needed — Kaira uses site title).
Other pages: start with frosted glass immediately since hero is shorter.

### 6. Category Pill (single posts)
Gold background, white text, uppercase, rounded pill above the title.

### 7. Post Meta Line (single posts)
Date + author with gold dot separators, light muted text.

### 8. Decorative SVG Dividers
Luxury geometric patterns replacing Hawaiian kapa cloth:
- **Diamond line** — thin gold repeating diamond outlines
- **Chevron** — subtle gold chevron pattern
Used between major content sections.

## Files Changed

| File | Change |
|------|--------|
| `kaira-theme/assets/css/custom.css` | Add hero overlay, wave edge, bokeh, scroll indicator, frosted glass, divider styles |
| `kaira-theme/assets/js/main.js` | Enhance scroll handler for 90vh threshold on homepage, scroll indicator fade |
| `kaira-theme/templates/front-page.html` | Add bokeh spans, scroll indicator, hero overlay class |
| `kaira-theme/templates/single.html` | Add 70vh hero with category pill and post meta |
| `kaira-theme/templates/archive.html` | Add 50vh hero with title overlay |
| `kaira-theme/templates/index.html` | Add 50vh hero with title overlay |
| `kaira-theme/parts/header.html` | No structural changes needed (already fixed/transparent) |

## What Stays Unchanged

- Header HTML structure (already correct)
- theme.json design tokens
- Gallery, about page templates
- Image Studio, WooCommerce, Replicate integration
- Font loading (already self-hosted Playfair + Inter)
