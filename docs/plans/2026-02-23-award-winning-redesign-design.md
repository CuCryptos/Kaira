# Kaira Award-Winning Redesign — Design Document

> **Approach:** Cinematic Scroll — full-viewport scroll-driven scenes with enhanced interactions
>
> **Goal:** Transform explorewithkaira.com into an Awwwards-caliber luxury travel & lifestyle site
>
> **Constraint:** WordPress block theme (FSE), no PHP locally, Bluehost hosting, keep existing brand DNA

---

## 1. Design System

### Color Palette

| Token | Value | Purpose |
|-------|-------|---------|
| `background` | `#050505` | Deep black base |
| `surface` | `#111111` | Card/panel backgrounds |
| `accent` | `#c9a84c` | Signature gold |
| `accent-subtle` | `rgba(201,168,76,0.08)` | Gold ambient glow |
| `accent-secondary` | `#8b3a4a` | Warm rose for differentiation |
| `text` | `#e8e0d0` | Warm off-white body text |
| `heading` | `#ffffff` | Pure white headings |
| `muted` | `#6b6560` | De-emphasized text |
| `glass` | `rgba(10,10,10,0.6)` | Glassmorphism panel fill |
| `glass-border` | `rgba(201,168,76,0.15)` | Subtle gold glass edges |

### Typography

| Role | Family | Weight | Sizing |
|------|--------|--------|--------|
| Display (hero headlines) | Cormorant Garamond | 600 | `clamp(3rem, 8vw, 8rem)` |
| Headings | Playfair Display | 700 | Standard scale |
| Body | Inter | 400 | 1rem base, 1.7 line-height |

**Letter-spacing system:** -0.02em for display, 0.05em for headings, 0.2em for small caps/labels.

**Line-height:** 1.0 display, 1.15 headings, 1.7 body.

### Spacing & Layout

- Content width: 1200px
- Wide width: 1600px (expanded for cinematic feel)
- Section height: 100vh snap-aligned on homepage
- Spacing tokens: 10–90 (0.5rem to 15rem)

---

## 2. Logo

**Wordmark:** "KAIRA" in Cormorant Garamond 600, letter-spacing 0.3em, uppercase.

**Custom detail:** Subtle decorative flourish extending from the K's upper arm (thin swash curl).

**Accent line:** 2px gold line below text, 60% of wordmark width, centered.

**Delivery:**
- SVG wordmark for header (replaces `wp:site-title` with `wp:site-logo`)
- SVG monogram "K" with flourish for favicon
- Colors: gold `#c9a84c` primary, white `#ffffff` alternate

---

## 3. Homepage — 5 Cinematic Scenes

### Scene 1: Hero (100vh)
- Massive Cormorant Garamond headline "EXPLORE WITH KAIRA"
- Background: Kaira hero image with parallax (slower than scroll)
- Canvas particle system: 30-40 gold particles with depth simulation, cursor repulsion, mouse trail
- Glassmorphism subtitle panel with tagline
- Scroll indicator: thin gold line extending downward
- Scroll-driven: content fades + scales (1 → 0.95) + blurs as you scroll away

### Scene 2: "Who is Kaira" Introduction (100vh)
- Split layout: large Kaira portrait (60%) + text (40%)
- Text animates word-by-word using `animation-timeline: view()`
- Brief intro copy (2-3 sentences)
- Gold accent line divider
- Subtle parallax on portrait

### Scene 3: Featured Destinations (100vh)
- Horizontal scroll carousel within vertical flow
- 3-4 destination cards scrolling horizontally as user scrolls vertically
- Each card: full-bleed image + glass overlay with destination name
- Rose accent for category tags
- Gold scroll progress bar at top of section

### Scene 4: Latest from the Journal (100vh)
- Staggered grid: 1 large feature card + 2 smaller cards
- Cards fade in with stagger delay on viewport entry
- Feature card has gold glow behind it
- Hover: image zoom + glass panel slides up with excerpt
- "Read the Journal" CTA

### Scene 5: Shop Preview + Newsletter (100vh, split)
- Top half: 3 product cards with 3D tilt hover effect
- Bottom half: newsletter signup with Cormorant headline "Stay in the Loop"
- Email input with animated gold underline (expands from center on focus)
- Ambient gold radial glow behind newsletter

---

## 4. Inner Pages

### Single Post
- 80vh hero with parallax featured image, title on glass panel at bottom
- Category pill (rose), date (muted)
- 800px content width, drop caps, 1.7 line-height
- Pull quotes: Cormorant Garamond italic, gold left border, wide-width breakout
- In-content images: full-bleed with parallax
- "Keep Exploring" section: 3 related post cards with staggered fade-in

### Archive / Journal
- 50vh hero with "The Journal" in Cormorant display
- Filter bar: category pills with sliding gold underline indicator
- Staggered masonry: alternating 2-col and 3-col rows
- Cards fade in with stagger on scroll
- "Load More" with animated gold spinner

### Gallery
- No hero — straight into content
- Sticky glassmorphism filter strip
- Masonry grid, hover: scale 1.03, gold border fade-in, glass overlay with title
- Lightbox: full-screen takeover, blur background, swipe/arrow nav, image counter
- Shimmer placeholder on image load

### About
- Full-viewport Kaira portrait opening, scroll to reveal
- Timeline layout: alternating left/right blocks with scroll-driven fade-in
- Animated stat counters (countries, followers, partnerships)
- Brand partnership logo strip with hover glow
- "Work With Kaira" glass panel CTA

### Shop (WooCommerce)
- 40vh hero with "The Collection" in display font
- 3-column product grid, hover: image zoom + glass price overlay slides up
- Rose accent badges for "New" / "Featured"
- Quick-view modal with glassmorphism

---

## 5. Global Components

### Header
- Fixed, transparent over heroes
- Scrolled: glassmorphism + backdrop-blur + thin gold bottom border
- Logo: SVG wordmark (Cormorant Garamond with flourished K)
- Nav: 0.75rem uppercase Inter, gold underline slides in from left on hover
- Mobile: full-screen overlay with staggered link animation

### Footer
- Dark surface, 3-column layout
- Social icons with gold glow on hover
- Thin gold divider
- "Back to top" smooth scroll button

---

## 6. Animation & Interaction System

### Scroll-Driven Animations (CSS-only)

| Element | Animation | Trigger |
|---------|-----------|---------|
| Hero content | Fade + scale(0.95) + blur | `scroll()` away from hero |
| Section headings | SlideY(30px) + fade in | `view()` enters viewport |
| Text paragraphs | Word-by-word opacity reveal | `view()` 20%-60% viewport |
| Images | Parallax translateY at 0.3x | `scroll()` on ancestor |
| Cards | Staggered fade-in (100ms delay) | `view()` enters viewport |
| Horizontal carousel | translateX tied to scrollY | `scroll()` on section |
| Progress indicators | scaleX(0 → 1) | `scroll()` on section |
| SVG dividers | stroke-dashoffset draw-in | `view()` enters viewport |
| Gallery images | skewY(2deg) while scrolling | scroll detection CSS |

### Micro-Interactions (CSS transitions)

| Element | Interaction |
|---------|-------------|
| Cards | translateY(-8px) + shadow expand on hover |
| Images | scale(1.05) 0.6s ease on hover |
| Nav links | Gold underline scaleX(0→1) from left |
| Buttons | Gold → white bg swap, text invert |
| Glass panels | Border opacity up, glow pulse |
| Newsletter input | Gold bottom-border expand from center |
| Social icons | scale(1.15) + gold glow shadow |

### Enhanced Interactions (Lightweight JS)

| Component | Size | Method |
|-----------|------|--------|
| Canvas particle system | ~3KB | 30-40 particles, cursor repulsion, mouse trail, depth blur |
| 3D tilt cards | ~1KB | perspective + mousemove, light reflection overlay |
| Split text reveals | ~1KB | Character stagger with CSS animation-delay |
| Magnetic cursor | ~1KB | Custom gold dot, grow on hover, magnetic pull 50px radius |
| Ambient cursor glow | 0KB | CSS radial-gradient follows pointer via JS variable |
| **Total JS** | **~6KB** | No animation libraries |

### Performance

- Zero JS animation libraries
- All scroll animations in CSS (`animation-timeline`)
- Canvas particles lazy-loaded after first paint
- Reduced motion: all animations disabled via `prefers-reduced-motion: reduce`
- Noise texture: inline SVG filter, near-zero performance cost

### Page Transitions

- View Transitions API: `@view-transition { navigation: auto }`
- Cross-fade 300ms between pages
- Hero images morph between list → detail via `view-transition-name`
- Navigation excluded from transition (stays fixed)

---

## 7. Technical Constraints

- **WordPress FSE block theme** — all templates in HTML block markup
- **Bluehost hosting** — NFD framework dequeue must remain
- **No build tooling** — vanilla CSS/JS, no bundlers
- **Manual deploy** — zip upload to wp-admin (WP Pusher not yet automated)
- **Version bump** triggers template DB reset
- **Browser support:** Modern browsers (CSS scroll-driven animations baseline since 2024)
