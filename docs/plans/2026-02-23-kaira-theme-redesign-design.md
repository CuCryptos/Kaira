# Kaira Theme Redesign — Design Document

**Date:** 2026-02-23
**Project:** Full overhaul of explorewithkaira.com
**Platform:** WordPress (Bluehost) — Custom Block Theme (FSE)

---

## 1. Visual Identity & Design System

### Color Palette
| Role | Color | Hex |
|------|-------|-----|
| Background | Deep black | `#0a0a0a` |
| Surface | Dark charcoal | `#141414` |
| Accent | Warm gold | `#c9a84c` |
| Text | Off-white | `#f5f0e8` |
| Headings | White | `#ffffff` |
| Secondary | Muted warm gray | `#8a8275` |

### Typography
- **Headings:** Playfair Display (serif)
- **Body:** Inter (sans-serif)
- **Labels/Nav:** Uppercase letter-spaced sans-serif

### Design Elements
- Subtle gold line dividers between sections
- Soft vignette overlays on hero images
- Hover animations: gentle zoom on gallery images, gold border reveals
- Generous whitespace to let imagery breathe
- Full-bleed photography with text overlays using dark gradients
- Overall feel: luxury fashion house meets high-end travel magazine

---

## 2. Site Structure & Pages

### Navigation
- Fixed/sticky, transparent over hero images, solid on scroll
- Logo left, nav links center, shop cart + search icons right
- Links: Home | Destinations | Lifestyle | Gallery | Shop | About

### Pages

**Home**
- Full-screen hero: cinematic video or rotating image with tagline overlay
- "Latest from Kaira" — 3 recent blog posts in card grid
- Featured destination spotlight section
- Instagram-style photo mosaic strip
- Newsletter signup with gold CTA
- Footer with social links, nav, and branding

**Destinations (Blog Archive)**
- Filterable by location (Mykonos, Bali, Dubai, Paris, Tulum, Amalfi, etc.)
- Card grid layout with hover effects — image, title, excerpt
- Each destination tag maps to content folders

**Lifestyle (Blog Archive)**
- Fashion, wellness, luxury living posts
- Card grid layout with category filters

**Gallery**
- Masonry/mosaic photo grid organized by theme
- Lightbox for full-screen viewing
- Video gallery section with embedded players
- Filter tabs: Travel, Fashion, Bathtub, Gym, etc.

**Shop**
- WooCommerce-powered store
- Product grid with dark cards, gold "Add to Cart" buttons
- Categories: Prints, Merch, Digital (future expansion)

**About**
- Kaira's story and personality
- Full-width hero image
- Social media links with follower counts
- "Work with Kaira" / brand partnership inquiry form

**Footer (Global)**
- Newsletter signup
- Social icons (Instagram, TikTok, YouTube, X, etc.)
- Quick links, copyright

---

## 3. Replicate Integration

### Kaira Image Studio (Admin Panel)
- Custom WordPress admin page for image generation
- Scene type selector: Destination, Fashion, Lifestyle, etc.
- Input fields: location, outfit description, mood/lighting, pose
- Dropdown presets for common shoots (e.g., "Mykonos poolside", "Paris night out")
- Generate → preview → approve/reject → save to Media Library

### Replicate Backend
- PHP service class calling Replicate HTTP API
- Kaira-specific LoRA fine-tune for face/identity consistency
- API token stored securely in `wp-config.php`
- Async generation: kick off job, poll for completion, save result

### Model Strategy
- Base model: SDXL or Flux via Replicate with Kaira LoRA
- Templated prompts: base Kaira identity + user scene description
- Negative prompts baked in for consistency

### Generated Image Workflow
1. Generate in admin panel
2. Preview and approve/reject
3. Approved images auto-tagged by category, saved to Media Library
4. Ready for blog posts, galleries, or shop products

### LoRA Training
- Train using existing Kaira image library (~80+ images)
- Covers multiple themes: travel, fashion, lifestyle, fitness

---

## 4. Technical Architecture

### Theme Structure
```
kaira-theme/
├── style.css
├── theme.json
├── functions.php
├── templates/
│   ├── index.html
│   ├── single.html
│   ├── archive.html
│   ├── page-gallery.html
│   ├── page-about.html
│   └── front-page.html
├── parts/
│   ├── header.html
│   ├── footer.html
│   └── newsletter-signup.html
├── assets/
│   ├── css/
│   ├── js/
│   ├── fonts/
│   └── images/
├── inc/
│   ├── replicate-api.php
│   ├── image-studio.php
│   ├── custom-post-types.php
│   └── woocommerce.php
└── blocks/
    ├── gallery-mosaic/
    └── hero-slider/
```

### Custom Post Types
- **Gallery** — photo/video items with taxonomy filters
- **Destination** — travel content tied to locations

### Plugin Dependencies
- WooCommerce (shop)
- No page builder plugin required

### Deployment
- Theme developed locally in repo
- ZIP upload via WordPress admin or SFTP to Bluehost
- `wp-config.php` holds Replicate API key

### Performance
- No page builder overhead
- Lazy-loaded images
- Minimal JS (lightbox, gallery filters, scroll animations)
- Bluehost caching + optional lightweight caching plugin
