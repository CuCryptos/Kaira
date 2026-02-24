# Award-Winning Kaira Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the Kaira WordPress block theme into an Awwwards-caliber luxury travel & lifestyle site with cinematic scroll-driven animations, canvas particles, 3D interactions, and a custom SVG wordmark logo.

**Architecture:** Evolve the existing WordPress FSE block theme in-place. Update theme.json design tokens first, then rebuild CSS from the ground up (replacing custom.css), create new JS modules for each interaction system, rebuild all templates/parts to match the new cinematic scroll design, and create the SVG logo assets. No build tooling — vanilla CSS/JS only.

**Tech Stack:** WordPress 6.4+ FSE block theme, CSS scroll-driven animations (`animation-timeline`), Canvas API for particles, vanilla JS for cursor/tilt/split-text, SVG for logo and animated dividers, Cormorant Garamond + Playfair Display + Inter fonts.

---

## Task 1: Download Cormorant Garamond Font & Update theme.json Design Tokens

This task establishes the entire design foundation. Every subsequent task depends on these tokens.

**Files:**
- Download: `kaira-theme/assets/fonts/CormorantGaramond-SemiBold.woff2` (from Google Fonts)
- Modify: `kaira-theme/theme.json` (entire file — updated tokens)
- Modify: `kaira-theme/functions.php:9` (version bump)

**Step 1: Download Cormorant Garamond font**

```bash
# Download Cormorant Garamond SemiBold (600) woff2 from Google Fonts API
curl -L "https://fonts.gstatic.com/s/cormorantgaramond/v16/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYrEtFmSu5.woff2" \
  -o kaira-theme/assets/fonts/CormorantGaramond-SemiBold.woff2
```

If the direct URL doesn't work, go to https://fonts.google.com/specimen/Cormorant+Garamond, select SemiBold 600, download the family, extract the woff2, and place it at `kaira-theme/assets/fonts/CormorantGaramond-SemiBold.woff2`.

**Step 2: Update theme.json with new design tokens**

Replace the entire contents of `kaira-theme/theme.json` with:

```json
{
	"$schema": "https://schemas.wp.org/trunk/theme.json",
	"version": 3,
	"settings": {
		"appearanceTools": true,
		"useRootPaddingAwareAlignments": true,
		"layout": {
			"contentSize": "1200px",
			"wideSize": "1600px"
		},
		"color": {
			"palette": [
				{
					"slug": "background",
					"color": "#050505",
					"name": "Background"
				},
				{
					"slug": "surface",
					"color": "#111111",
					"name": "Surface"
				},
				{
					"slug": "accent",
					"color": "#c9a84c",
					"name": "Accent"
				},
				{
					"slug": "accent-secondary",
					"color": "#8b3a4a",
					"name": "Accent Secondary"
				},
				{
					"slug": "text",
					"color": "#e8e0d0",
					"name": "Text"
				},
				{
					"slug": "heading",
					"color": "#ffffff",
					"name": "Heading"
				},
				{
					"slug": "muted",
					"color": "#6b6560",
					"name": "Muted"
				}
			],
			"gradients": [
				{
					"slug": "dark-overlay",
					"gradient": "linear-gradient(180deg, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.9) 100%)",
					"name": "Dark Overlay"
				},
				{
					"slug": "gold-shimmer",
					"gradient": "linear-gradient(135deg, #c9a84c 0%, #e8d48b 50%, #c9a84c 100%)",
					"name": "Gold Shimmer"
				},
				{
					"slug": "gold-glow",
					"gradient": "radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)",
					"name": "Gold Glow"
				}
			]
		},
		"typography": {
			"fontFamilies": [
				{
					"fontFamily": "\"Cormorant Garamond\", serif",
					"slug": "display",
					"name": "Display",
					"fontFace": [
						{
							"fontFamily": "Cormorant Garamond",
							"fontWeight": "600",
							"fontStyle": "normal",
							"src": [
								"file:./assets/fonts/CormorantGaramond-SemiBold.woff2"
							]
						}
					]
				},
				{
					"fontFamily": "\"Playfair Display\", serif",
					"slug": "heading",
					"name": "Heading",
					"fontFace": [
						{
							"fontFamily": "Playfair Display",
							"fontWeight": "400 900",
							"fontStyle": "normal",
							"fontStretch": "normal",
							"src": [
								"file:./assets/fonts/PlayfairDisplay-VariableFont_wght.woff2"
							]
						},
						{
							"fontFamily": "Playfair Display",
							"fontWeight": "400 900",
							"fontStyle": "italic",
							"fontStretch": "normal",
							"src": [
								"file:./assets/fonts/PlayfairDisplay-Italic-VariableFont_wght.woff2"
							]
						}
					]
				},
				{
					"fontFamily": "\"Inter\", sans-serif",
					"slug": "body",
					"name": "Body",
					"fontFace": [
						{
							"fontFamily": "Inter",
							"fontWeight": "100 900",
							"fontStyle": "normal",
							"fontStretch": "normal",
							"src": [
								"file:./assets/fonts/Inter-VariableFont_slnt_wght.woff2"
							]
						}
					]
				}
			],
			"fontSizes": [
				{
					"slug": "small",
					"size": "0.875rem",
					"name": "Small"
				},
				{
					"slug": "medium",
					"size": "1rem",
					"name": "Medium"
				},
				{
					"slug": "large",
					"size": "1.25rem",
					"name": "Large"
				},
				{
					"slug": "x-large",
					"size": "2rem",
					"name": "Extra Large"
				},
				{
					"slug": "xx-large",
					"size": "3.5rem",
					"name": "Extra Extra Large"
				},
				{
					"slug": "hero",
					"size": "clamp(2.5rem, 5vw, 5rem)",
					"name": "Hero"
				},
				{
					"slug": "display",
					"size": "clamp(3rem, 8vw, 8rem)",
					"name": "Display"
				}
			]
		},
		"spacing": {
			"units": [
				"px",
				"rem",
				"vh",
				"vw",
				"%"
			],
			"spacingSizes": [
				{ "slug": "10", "size": "0.5rem", "name": "1" },
				{ "slug": "20", "size": "1rem", "name": "2" },
				{ "slug": "30", "size": "1.5rem", "name": "3" },
				{ "slug": "40", "size": "2rem", "name": "4" },
				{ "slug": "50", "size": "3rem", "name": "5" },
				{ "slug": "60", "size": "5rem", "name": "6" },
				{ "slug": "70", "size": "8rem", "name": "7" },
				{ "slug": "80", "size": "10rem", "name": "8" },
				{ "slug": "90", "size": "15rem", "name": "9" }
			]
		},
		"custom": {
			"glass": {
				"background": "rgba(10,10,10,0.6)",
				"border": "rgba(201,168,76,0.15)",
				"blur": "20px"
			},
			"accentSubtle": "rgba(201,168,76,0.08)"
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
					"lineHeight": "1.15"
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
					"textTransform": "uppercase",
					"letterSpacing": "0.1em",
					"fontSize": "0.875rem",
					"fontWeight": "600"
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
					"fontFamily": "var(--wp--preset--font-family--display)",
					"fontStyle": "italic",
					"fontSize": "1.5rem",
					"lineHeight": "1.4"
				},
				"border": {
					"left": {
						"color": "var(--wp--preset--color--accent)",
						"width": "3px",
						"style": "solid"
					}
				}
			}
		}
	},
	"templateParts": [
		{
			"name": "header",
			"title": "Header",
			"area": "header"
		},
		{
			"name": "footer",
			"title": "Footer",
			"area": "footer"
		}
	],
	"customTemplates": [
		{
			"name": "page-gallery",
			"title": "Gallery Page",
			"postTypes": ["page"]
		},
		{
			"name": "page-about",
			"title": "About Page",
			"postTypes": ["page"]
		},
		{
			"name": "blank",
			"title": "Blank",
			"postTypes": ["page", "post"]
		}
	]
}
```

**Step 3: Bump version in functions.php**

Change line 9 of `kaira-theme/functions.php`:
```php
define( 'KAIRA_VERSION', '2.0.0' );
```

This triggers the template DB reset on next load.

**Step 4: Verify font file exists**

```bash
ls -la kaira-theme/assets/fonts/CormorantGaramond-SemiBold.woff2
```

Expected: File exists with non-zero size.

**Step 5: Commit**

```bash
git add kaira-theme/theme.json kaira-theme/functions.php kaira-theme/assets/fonts/CormorantGaramond-SemiBold.woff2
git commit -m "feat: update design tokens for v2.0 redesign

Add Cormorant Garamond display font, new color tokens (accent-secondary,
glass, accent-subtle), display font size, expanded spacing scale,
wideSize to 1600px. Bump version to 2.0.0."
```

---

## Task 2: Create SVG Logo Assets

Create the wordmark SVG logo with flourished K and the favicon monogram.

**Files:**
- Create: `kaira-theme/assets/images/kaira-logo.svg`
- Create: `kaira-theme/assets/images/kaira-logo-white.svg`
- Create: `kaira-theme/assets/images/kaira-favicon.svg`

**Step 1: Create the gold wordmark SVG**

Create `kaira-theme/assets/images/kaira-logo.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 60" fill="none">
  <!-- K with flourish -->
  <text x="0" y="38" font-family="'Cormorant Garamond', serif" font-weight="600" font-size="40" letter-spacing="12" fill="#c9a84c">KAIRA</text>
  <!-- Decorative flourish extending from K's upper arm -->
  <path d="M28 12 Q35 6 44 8 Q50 10 48 14" stroke="#c9a84c" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <!-- Gold accent line below -->
  <line x1="72" y1="52" x2="288" y2="52" stroke="#c9a84c" stroke-width="2" stroke-linecap="round"/>
</svg>
```

Note: The exact coordinates will need fine-tuning once the font renders. The key elements are:
1. "KAIRA" text in Cormorant Garamond 600 with wide letter-spacing
2. A thin swash curl path extending from the K's upper-right arm
3. A 2px gold line below, centered, ~60% width of text

Since SVG text depends on the font being installed, **convert the text to paths** for reliable rendering. The implementer should:
1. Open the SVG in a browser where Cormorant Garamond is loaded
2. Use a tool or manually trace the text paths
3. Or alternatively, use a `<text>` element with the font embedded via CSS (WordPress will load the font)

**Step 2: Create white variant**

Create `kaira-theme/assets/images/kaira-logo-white.svg` — identical but with `fill="#ffffff"` and `stroke="#ffffff"`.

**Step 3: Create favicon monogram**

Create `kaira-theme/assets/images/kaira-favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" fill="#050505"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-weight="600" font-size="40" fill="#c9a84c">K</text>
  <path d="M36 16 Q42 11 48 13 Q52 15 50 18" stroke="#c9a84c" stroke-width="1" fill="none" stroke-linecap="round"/>
</svg>
```

**Step 4: Commit**

```bash
git add kaira-theme/assets/images/
git commit -m "feat: add SVG wordmark logo and favicon monogram

Kaira wordmark in Cormorant Garamond 600 with flourished K
and gold accent line. Gold and white variants plus K monogram favicon."
```

---

## Task 3: Rebuild custom.css — Foundation, Header, and Navigation

Replace the entire CSS file with the new design system. This is a big file, so we split the CSS across Tasks 3-5.

**Files:**
- Modify: `kaira-theme/assets/css/custom.css` (replace entirely)

**Step 1: Write CSS sections 1-4 (Global, Noise Texture, Glassmorphism, Navigation)**

Replace the entire contents of `kaira-theme/assets/css/custom.css` with:

```css
/*--------------------------------------------------------------
 * Kaira Theme v2.0 — Custom CSS
 *
 * Award-winning redesign: cinematic scroll-driven animations,
 * glassmorphism, canvas particles, 3D interactions.
 *
 * Sections:
 *   1. CSS Custom Properties
 *   2. Global & Utility
 *   3. Noise Texture & Ambient Effects
 *   4. Glassmorphism Utility
 *   5. Navigation / Header
 *   6. Hero System
 *   7. Scroll-Driven Animations
 *   8. Cinematic Scenes (Homepage)
 *   9. Card System
 *  10. Gallery & Lightbox
 *  11. Newsletter
 *  12. Footer
 *  13. Inner Pages (Single, Archive, About, Shop)
 *  14. Micro-Interactions
 *  15. Custom Cursor
 *  16. SVG Animated Dividers
 *  17. View Transitions
 *  18. WooCommerce Overrides
 *  19. Responsive
 *  20. Reduced Motion
 *--------------------------------------------------------------*/


/* ==========================================================================
   1. CSS Custom Properties (beyond theme.json tokens)
   ========================================================================== */

:root {
	--kaira-glass-bg: rgba(10, 10, 10, 0.6);
	--kaira-glass-border: rgba(201, 168, 76, 0.15);
	--kaira-glass-blur: 20px;
	--kaira-accent-subtle: rgba(201, 168, 76, 0.08);
	--kaira-accent-glow: rgba(201, 168, 76, 0.12);
	--kaira-rose: #8b3a4a;
	--kaira-transition-smooth: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	--kaira-transition-spring: 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}


/* ==========================================================================
   2. Global & Utility
   ========================================================================== */

*,
*::before,
*::after {
	box-sizing: border-box;
}

html {
	scroll-behavior: smooth;
}

body {
	overflow-x: hidden;
}

img {
	max-width: 100%;
	height: auto;
}

::selection {
	background: var(--wp--preset--color--accent);
	color: var(--wp--preset--color--background);
}

/* Display font utility */
.kaira-display-font {
	font-family: var(--wp--preset--font-family--display);
	font-weight: 600;
	line-height: 1.0;
	letter-spacing: -0.02em;
}

/* Section label (small gold uppercase) */
.kaira-section-label {
	font-family: var(--wp--preset--font-family--body);
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.2em;
	color: var(--wp--preset--color--accent);
}


/* ==========================================================================
   3. Noise Texture & Ambient Effects
   ========================================================================== */

/* Subtle film grain overlay on body */
body::before {
	content: '';
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 9998;
	opacity: 0.03;
	background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
	background-repeat: repeat;
	background-size: 256px 256px;
}

/* Ambient cursor glow — position updated by JS */
.kaira-ambient-glow {
	position: fixed;
	width: 600px;
	height: 600px;
	border-radius: 50%;
	background: radial-gradient(circle, var(--kaira-accent-subtle) 0%, transparent 70%);
	pointer-events: none;
	z-index: -1;
	transform: translate(-50%, -50%);
	transition: opacity 0.3s ease;
	opacity: 0;
}

.kaira-ambient-glow.active {
	opacity: 1;
}


/* ==========================================================================
   4. Glassmorphism Utility
   ========================================================================== */

.kaira-glass {
	background: var(--kaira-glass-bg);
	backdrop-filter: blur(var(--kaira-glass-blur));
	-webkit-backdrop-filter: blur(var(--kaira-glass-blur));
	border: 1px solid var(--kaira-glass-border);
}

.kaira-glass--strong {
	background: rgba(10, 10, 10, 0.8);
	backdrop-filter: blur(30px);
	-webkit-backdrop-filter: blur(30px);
	border: 1px solid rgba(201, 168, 76, 0.2);
}


/* ==========================================================================
   5. Navigation / Header
   ========================================================================== */

body .kaira-header {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 1000;
	background: transparent;
	transition: background var(--kaira-transition-smooth),
	            backdrop-filter var(--kaira-transition-smooth),
	            border-color var(--kaira-transition-smooth);
	border-bottom: 1px solid transparent;
}

body .kaira-header.scrolled {
	background: var(--kaira-glass-bg);
	backdrop-filter: blur(var(--kaira-glass-blur));
	-webkit-backdrop-filter: blur(var(--kaira-glass-blur));
	border-bottom-color: var(--kaira-glass-border);
}

/* Logo in header */
body .kaira-header .wp-block-site-logo img,
body .kaira-header .custom-logo {
	height: 36px;
	width: auto;
}

/* Nav links with animated underline */
body .kaira-header .wp-block-navigation-item__content {
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.15em;
	color: var(--wp--preset--color--heading);
	text-decoration: none;
	position: relative;
	padding-bottom: 4px;
}

body .kaira-header .wp-block-navigation-item__content::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 1px;
	background: var(--wp--preset--color--accent);
	transform: scaleX(0);
	transform-origin: left;
	transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

body .kaira-header .wp-block-navigation-item__content:hover::after {
	transform: scaleX(1);
}

body .kaira-header .wp-block-navigation-item__content:hover {
	color: var(--wp--preset--color--accent);
}

/* Mobile overlay menu */
.wp-block-navigation__responsive-container.is-menu-open {
	background: rgba(5, 5, 5, 0.98) !important;
	backdrop-filter: blur(30px);
	-webkit-backdrop-filter: blur(30px);
}

.wp-block-navigation__responsive-container.is-menu-open .wp-block-navigation-item__content {
	font-size: 1.5rem;
	letter-spacing: 0.1em;
}
```

This is the first chunk. Continue in step 2.

**Step 2: Append CSS sections 6-8 (Hero, Scroll-Driven, Cinematic Scenes)**

Append to `kaira-theme/assets/css/custom.css`:

```css


/* ==========================================================================
   6. Hero System
   ========================================================================== */

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

/* Gradient overlay */
body .kaira-hero-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(to bottom,
		rgba(5, 5, 5, 0.4) 0%,
		rgba(201, 168, 76, 0.06) 30%,
		rgba(5, 5, 5, 0.5) 60%,
		rgba(5, 5, 5, 0.95) 100%
	);
	z-index: 1;
}

/* Hero content z-index */
body .kaira-hero .wp-block-cover__inner-container {
	position: relative;
	z-index: 3;
}

/* Hero height variants */
.kaira-hero--80vh { height: 80vh; min-height: 500px; }
.kaira-hero--70vh { height: 70vh; min-height: 400px; }
.kaira-hero--50vh { height: 50vh; min-height: 320px; }
.kaira-hero--40vh { height: 40vh; min-height: 280px; }

/* Homepage hero — ambient radial glow fallback */
body .kaira-hero-home {
	background: radial-gradient(
		ellipse at 50% 40%,
		rgba(201, 168, 76, 0.06) 0%,
		rgba(5, 5, 5, 1) 70%
	);
}

/* Canvas particle container */
.kaira-particles-canvas {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 2;
	pointer-events: none;
}

/* Hero display title */
.kaira-hero-title {
	font-family: var(--wp--preset--font-family--display);
	font-weight: 600;
	font-size: clamp(3rem, 8vw, 8rem);
	line-height: 1.0;
	letter-spacing: -0.02em;
	color: var(--wp--preset--color--heading);
	text-align: center;
}

/* Glass subtitle panel */
.kaira-hero-subtitle {
	display: inline-block;
	background: var(--kaira-glass-bg);
	backdrop-filter: blur(var(--kaira-glass-blur));
	-webkit-backdrop-filter: blur(var(--kaira-glass-blur));
	border: 1px solid var(--kaira-glass-border);
	padding: 1rem 2rem;
	margin-top: 2rem;
	font-size: 1.125rem;
	letter-spacing: 0.05em;
	color: var(--wp--preset--color--text);
}

/* Scroll indicator — thin gold line */
.kaira-scroll-indicator {
	position: absolute;
	bottom: 2rem;
	left: 50%;
	transform: translateX(-50%);
	z-index: 5;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	transition: opacity 0.4s ease;
}

.kaira-scroll-indicator span {
	font-size: 0.625rem;
	text-transform: uppercase;
	letter-spacing: 0.2em;
	color: var(--wp--preset--color--muted);
}

.kaira-scroll-indicator::after {
	content: '';
	width: 1px;
	height: 40px;
	background: var(--wp--preset--color--accent);
	animation: kaira-scroll-line 2s ease-in-out infinite;
}

@keyframes kaira-scroll-line {
	0% { transform: scaleY(0); transform-origin: top; opacity: 1; }
	50% { transform: scaleY(1); transform-origin: top; opacity: 1; }
	50.01% { transform-origin: bottom; }
	100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
}

.kaira-scroll-indicator.hidden {
	opacity: 0;
	pointer-events: none;
}

/* Category pill — rose accent variant */
body .kaira-hero-category {
	display: flex;
	justify-content: center;
	gap: 0.5rem;
	margin-bottom: 1.5rem;
}

body .kaira-hero-category a {
	display: inline-block;
	background: var(--kaira-rose);
	color: var(--wp--preset--color--heading);
	font-family: var(--wp--preset--font-family--body);
	font-size: 0.7rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.15em;
	padding: 0.3rem 1rem;
	border-radius: 0;
	text-decoration: none;
	transition: background var(--kaira-transition-smooth);
}

body .kaira-hero-category a:hover {
	background: var(--wp--preset--color--accent);
	color: var(--wp--preset--color--background);
}

/* Hero meta */
body .kaira-hero-meta {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1.5rem;
	color: var(--wp--preset--color--muted);
	font-size: 0.875rem;
	letter-spacing: 0.05em;
	margin-top: 1rem;
}


/* ==========================================================================
   7. Scroll-Driven Animations
   ========================================================================== */

/* Fade + slide up on scroll into view */
.kaira-reveal {
	opacity: 0;
	transform: translateY(30px);
	animation: kaira-reveal-up linear both;
	animation-timeline: view();
	animation-range: entry 0% entry 30%;
}

@keyframes kaira-reveal-up {
	from { opacity: 0; transform: translateY(30px); }
	to { opacity: 1; transform: translateY(0); }
}

/* Stagger variants for cards */
.kaira-reveal-stagger-1 { animation-range: entry 0% entry 30%; }
.kaira-reveal-stagger-2 { animation-range: entry 5% entry 35%; }
.kaira-reveal-stagger-3 { animation-range: entry 10% entry 40%; }

/* Parallax — slower scroll for images */
.kaira-parallax {
	animation: kaira-parallax-shift linear both;
	animation-timeline: scroll();
}

@keyframes kaira-parallax-shift {
	from { transform: translateY(-5%); }
	to { transform: translateY(5%); }
}

/* Hero exit — fade + scale down as you scroll away */
.kaira-hero-exit {
	animation: kaira-hero-exit-anim linear both;
	animation-timeline: scroll();
	animation-range: 0vh 100vh;
}

@keyframes kaira-hero-exit-anim {
	from { opacity: 1; transform: scale(1); filter: blur(0); }
	to { opacity: 0; transform: scale(0.95); filter: blur(4px); }
}

/* Progress bar — scales X with scroll */
.kaira-scroll-progress {
	position: sticky;
	top: 0;
	height: 2px;
	background: var(--wp--preset--color--accent);
	transform-origin: left;
	transform: scaleX(0);
	animation: kaira-progress-fill linear both;
	animation-timeline: scroll(nearest);
	z-index: 10;
}

@keyframes kaira-progress-fill {
	from { transform: scaleX(0); }
	to { transform: scaleX(1); }
}

/* Legacy fallback for browsers without scroll-driven animations */
@supports not (animation-timeline: view()) {
	.kaira-reveal {
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.6s ease, transform 0.6s ease;
	}

	.kaira-reveal.visible {
		opacity: 1;
		transform: translateY(0);
	}
}


/* ==========================================================================
   8. Cinematic Scenes (Homepage)
   ========================================================================== */

/* Scroll snap container for homepage */
.kaira-cinematic {
	scroll-snap-type: y proximity;
}

/* Individual scene — full viewport */
.kaira-scene {
	min-height: 100vh;
	scroll-snap-align: start;
	position: relative;
	display: flex;
	align-items: center;
	overflow: hidden;
}

/* Scene 2: Introduction — split layout */
.kaira-scene-intro {
	display: grid;
	grid-template-columns: 3fr 2fr;
	gap: 0;
	min-height: 100vh;
}

.kaira-scene-intro-image {
	position: relative;
	overflow: hidden;
}

.kaira-scene-intro-image img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.kaira-scene-intro-text {
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 5rem;
}

/* Scene 3: Horizontal scroll destinations */
.kaira-scene-destinations {
	overflow: hidden;
}

.kaira-horizontal-track {
	display: flex;
	gap: 2rem;
	padding: 0 5rem;
	width: max-content;
	animation: kaira-horizontal-scroll linear both;
	animation-timeline: view();
	animation-range: contain 0% contain 100%;
}

@keyframes kaira-horizontal-scroll {
	from { transform: translateX(0); }
	to { transform: translateX(calc(-100% + 100vw)); }
}

.kaira-destination-card {
	position: relative;
	width: 70vw;
	max-width: 600px;
	height: 70vh;
	flex-shrink: 0;
	overflow: hidden;
	border-radius: 0;
}

.kaira-destination-card img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.6s ease;
}

.kaira-destination-card:hover img {
	transform: scale(1.05);
}

.kaira-destination-card-info {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 2rem;
	background: linear-gradient(transparent, rgba(5, 5, 5, 0.9));
}

.kaira-destination-card-info .kaira-tag {
	display: inline-block;
	background: var(--kaira-rose);
	color: var(--wp--preset--color--heading);
	font-size: 0.625rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.15em;
	padding: 0.25rem 0.75rem;
	margin-bottom: 0.75rem;
}

/* Scene 4: Journal staggered grid */
.kaira-journal-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1fr 1fr;
	gap: 2rem;
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 2rem;
}

.kaira-journal-grid .kaira-card--featured {
	grid-row: 1 / -1;
	position: relative;
}

.kaira-journal-grid .kaira-card--featured::before {
	content: '';
	position: absolute;
	top: -20px;
	left: -20px;
	right: -20px;
	bottom: -20px;
	background: radial-gradient(ellipse, var(--kaira-accent-glow) 0%, transparent 70%);
	z-index: -1;
	pointer-events: none;
}

/* Scene 5: Shop + Newsletter split */
.kaira-scene-split {
	display: grid;
	grid-template-rows: 1fr 1fr;
	min-height: 100vh;
}

.kaira-scene-split > * {
	display: flex;
	align-items: center;
	justify-content: center;
}
```

**Step 3: Append CSS sections 9-14 (Cards, Gallery, Newsletter, Footer, Inner Pages, Micro-interactions)**

Append to `kaira-theme/assets/css/custom.css`:

```css


/* ==========================================================================
   9. Card System
   ========================================================================== */

.kaira-card-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
	gap: 2rem;
}

.kaira-card {
	background: var(--wp--preset--color--surface);
	transition: transform var(--kaira-transition-smooth),
	            box-shadow var(--kaira-transition-smooth);
	position: relative;
	overflow: hidden;
}

.kaira-card:hover {
	transform: translateY(-8px);
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4),
	            0 0 30px var(--kaira-accent-subtle);
}

.kaira-card-image {
	overflow: hidden;
	aspect-ratio: 3 / 4;
}

.kaira-card-image img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.kaira-card:hover .kaira-card-image img {
	transform: scale(1.05);
}

/* Glass overlay that slides up on hover */
.kaira-card-overlay {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 2rem;
	background: linear-gradient(transparent, rgba(5, 5, 5, 0.9) 40%);
	transform: translateY(60%);
	transition: transform var(--kaira-transition-smooth);
}

.kaira-card:hover .kaira-card-overlay {
	transform: translateY(0);
}

.kaira-card-body {
	padding: 1.5rem;
}

.kaira-card-meta {
	font-size: var(--wp--preset--font-size--small);
	color: var(--wp--preset--color--muted);
	text-transform: uppercase;
	letter-spacing: 0.1em;
}

/* 3D tilt effect — transform set by JS */
.kaira-tilt {
	transform-style: preserve-3d;
	perspective: 1000px;
}

.kaira-tilt-inner {
	transition: transform 0.1s ease-out;
	will-change: transform;
}

/* Light reflection overlay for tilt cards */
.kaira-tilt-reflection {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(
		105deg,
		transparent 40%,
		rgba(255, 255, 255, 0.03) 45%,
		transparent 50%
	);
	pointer-events: none;
	z-index: 2;
}


/* ==========================================================================
   10. Gallery & Lightbox
   ========================================================================== */

.kaira-gallery-masonry {
	columns: 3;
	column-gap: 1rem;
}

.kaira-gallery-item {
	break-inside: avoid;
	overflow: hidden;
	cursor: pointer;
	margin-bottom: 1rem;
	position: relative;
}

.kaira-gallery-item img {
	width: 100%;
	display: block;
	transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.kaira-gallery-item:hover img {
	transform: scale(1.03);
}

/* Gold border fade-in on hover */
.kaira-gallery-item::after {
	content: '';
	position: absolute;
	inset: 0;
	border: 2px solid transparent;
	transition: border-color var(--kaira-transition-smooth);
	pointer-events: none;
}

.kaira-gallery-item:hover::after {
	border-color: var(--wp--preset--color--accent);
}

/* Glass overlay with title on hover */
.kaira-gallery-item-info {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 1.5rem;
	background: linear-gradient(transparent, rgba(5, 5, 5, 0.8));
	transform: translateY(100%);
	transition: transform var(--kaira-transition-smooth);
}

.kaira-gallery-item:hover .kaira-gallery-item-info {
	transform: translateY(0);
}

/* Shimmer placeholder for loading images */
.kaira-shimmer {
	background: linear-gradient(90deg,
		var(--wp--preset--color--surface) 25%,
		rgba(201, 168, 76, 0.05) 50%,
		var(--wp--preset--color--surface) 75%
	);
	background-size: 200% 100%;
	animation: kaira-shimmer 1.5s infinite;
}

@keyframes kaira-shimmer {
	0% { background-position: 200% 0; }
	100% { background-position: -200% 0; }
}

/* Lightbox */
.kaira-lightbox {
	position: fixed;
	inset: 0;
	z-index: 9999;
	background: rgba(5, 5, 5, 0.97);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	display: none;
	align-items: center;
	justify-content: center;
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
	font-size: 1.5rem;
	cursor: pointer;
	transition: color 0.3s ease;
}

.kaira-lightbox-close:hover {
	color: var(--wp--preset--color--accent);
}

.kaira-lightbox-nav {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	background: none;
	border: none;
	color: var(--wp--preset--color--heading);
	font-size: 2rem;
	cursor: pointer;
	padding: 1rem;
	transition: color 0.3s ease;
}

.kaira-lightbox-nav:hover {
	color: var(--wp--preset--color--accent);
}

.kaira-lightbox-prev { left: 2rem; }
.kaira-lightbox-next { right: 2rem; }

.kaira-lightbox-counter {
	position: absolute;
	bottom: 2rem;
	left: 50%;
	transform: translateX(-50%);
	font-size: 0.875rem;
	color: var(--wp--preset--color--muted);
	letter-spacing: 0.1em;
}

/* Gallery filter strip — sticky glass */
.kaira-filter-bar {
	position: sticky;
	top: 80px;
	z-index: 100;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	gap: 0.5rem;
	padding: 1rem 2rem;
	background: var(--kaira-glass-bg);
	backdrop-filter: blur(var(--kaira-glass-blur));
	-webkit-backdrop-filter: blur(var(--kaira-glass-blur));
	border-bottom: 1px solid var(--kaira-glass-border);
}

.kaira-filter-btn {
	background: transparent;
	border: none;
	color: var(--wp--preset--color--muted);
	font-size: 0.75rem;
	text-transform: uppercase;
	letter-spacing: 0.15em;
	padding: 0.5rem 1rem;
	cursor: pointer;
	position: relative;
	transition: color 0.3s ease;
}

.kaira-filter-btn::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	width: 0;
	height: 1px;
	background: var(--wp--preset--color--accent);
	transition: width 0.3s ease, left 0.3s ease;
}

.kaira-filter-btn:hover,
.kaira-filter-btn.active {
	color: var(--wp--preset--color--accent);
}

.kaira-filter-btn.active::after {
	width: 100%;
	left: 0;
}

/* Masonry responsive */
@media (max-width: 900px) {
	.kaira-gallery-masonry { columns: 2; }
}

@media (max-width: 600px) {
	.kaira-gallery-masonry { columns: 1; }
}


/* ==========================================================================
   11. Newsletter
   ========================================================================== */

.kaira-newsletter {
	text-align: center;
	padding: 5rem 2rem;
	position: relative;
}

/* Ambient gold glow behind newsletter */
.kaira-newsletter::before {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	width: 600px;
	height: 400px;
	transform: translate(-50%, -50%);
	background: radial-gradient(ellipse, var(--kaira-accent-subtle) 0%, transparent 70%);
	pointer-events: none;
	z-index: 0;
}

.kaira-newsletter > * {
	position: relative;
	z-index: 1;
}

/* Animated gold underline input */
.kaira-input-underline {
	background: transparent;
	border: none;
	border-bottom: 1px solid var(--wp--preset--color--muted);
	color: var(--wp--preset--color--text);
	padding: 0.875rem 0;
	font-size: 1rem;
	width: 100%;
	max-width: 400px;
	outline: none;
	position: relative;
	transition: border-color 0.3s ease;
}

.kaira-input-underline:focus {
	border-bottom-color: var(--wp--preset--color--accent);
}

/* Expanding underline effect wrapper */
.kaira-input-wrapper {
	position: relative;
	display: inline-block;
	width: 100%;
	max-width: 400px;
}

.kaira-input-wrapper::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	width: 0;
	height: 2px;
	background: var(--wp--preset--color--accent);
	transition: width 0.3s ease, left 0.3s ease;
}

.kaira-input-wrapper:focus-within::after {
	width: 100%;
	left: 0;
}


/* ==========================================================================
   12. Footer
   ========================================================================== */

body .kaira-footer {
	position: relative;
}

.kaira-footer-social a {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	color: var(--wp--preset--color--muted);
	text-decoration: none;
	transition: color 0.3s ease, box-shadow 0.3s ease;
}

.kaira-footer-social a:hover {
	color: var(--wp--preset--color--accent);
	box-shadow: 0 0 20px var(--kaira-accent-subtle);
}

/* Back to top button */
.kaira-back-to-top {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.75rem;
	text-transform: uppercase;
	letter-spacing: 0.15em;
	color: var(--wp--preset--color--muted);
	text-decoration: none;
	transition: color 0.3s ease;
	cursor: pointer;
	background: none;
	border: none;
}

.kaira-back-to-top:hover {
	color: var(--wp--preset--color--accent);
}


/* ==========================================================================
   13. Inner Pages
   ========================================================================== */

/* Single post — drop cap */
.kaira-single-content > p:first-of-type::first-letter {
	float: left;
	font-family: var(--wp--preset--font-family--display);
	font-size: 4rem;
	line-height: 0.8;
	padding-right: 0.75rem;
	padding-top: 0.25rem;
	color: var(--wp--preset--color--accent);
}

/* Pull quotes — wide breakout */
.kaira-single-content blockquote {
	font-family: var(--wp--preset--font-family--display);
	font-size: 1.5rem;
	line-height: 1.4;
	font-style: italic;
	border-left: 3px solid var(--wp--preset--color--accent);
	padding: 1.5rem 2rem;
	margin: 3rem -5rem;
	color: var(--wp--preset--color--heading);
}

/* About page — timeline */
.kaira-timeline-item {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 4rem;
	align-items: center;
	padding: 4rem 0;
}

.kaira-timeline-item:nth-child(even) {
	direction: rtl;
}

.kaira-timeline-item:nth-child(even) > * {
	direction: ltr;
}

/* Animated stat counter */
.kaira-stat {
	text-align: center;
}

.kaira-stat-number {
	font-family: var(--wp--preset--font-family--display);
	font-size: clamp(2.5rem, 5vw, 4rem);
	font-weight: 600;
	color: var(--wp--preset--color--accent);
	line-height: 1;
}

.kaira-stat-label {
	font-size: 0.75rem;
	text-transform: uppercase;
	letter-spacing: 0.2em;
	color: var(--wp--preset--color--muted);
	margin-top: 0.5rem;
}

/* Archive — staggered masonry */
.kaira-archive-grid {
	display: grid;
	gap: 2rem;
}

.kaira-archive-grid .kaira-archive-row--2 {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 2rem;
}

.kaira-archive-grid .kaira-archive-row--3 {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 2rem;
}

/* Glass title panel at bottom of hero */
.kaira-hero-glass-panel {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 3rem 2rem;
	background: linear-gradient(transparent, var(--kaira-glass-bg));
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	z-index: 3;
}


/* ==========================================================================
   14. Micro-Interactions
   ========================================================================== */

/* Button hover — gold to white swap */
body .wp-block-button__link {
	transition: background var(--kaira-transition-smooth),
	            color var(--kaira-transition-smooth),
	            transform 0.2s ease;
}

body .wp-block-button__link:hover {
	transform: translateY(-2px);
}

/* Glass panel hover pulse */
.kaira-glass:hover {
	border-color: rgba(201, 168, 76, 0.3);
}

/* Image skew while scrolling — applied via JS class */
.kaira-scroll-skew {
	transition: transform 0.2s ease;
}

.kaira-scroll-skew.is-scrolling {
	transform: skewY(1deg);
}
```

**Step 4: Append CSS sections 15-20 (Cursor, Dividers, Transitions, WooCommerce, Responsive, Reduced Motion)**

Append to `kaira-theme/assets/css/custom.css`:

```css


/* ==========================================================================
   15. Custom Cursor
   ========================================================================== */

.kaira-cursor {
	position: fixed;
	width: 8px;
	height: 8px;
	background: var(--wp--preset--color--accent);
	border-radius: 50%;
	pointer-events: none;
	z-index: 99999;
	mix-blend-mode: difference;
	transform: translate(-50%, -50%);
	transition: width 0.2s ease, height 0.2s ease, background 0.2s ease;
	will-change: transform;
}

.kaira-cursor.is-hovering {
	width: 40px;
	height: 40px;
	background: rgba(201, 168, 76, 0.15);
	border: 1px solid var(--wp--preset--color--accent);
}

/* Hide on touch devices */
@media (hover: none) {
	.kaira-cursor { display: none; }
}


/* ==========================================================================
   16. SVG Animated Dividers
   ========================================================================== */

.kaira-divider-svg {
	width: 100%;
	height: 20px;
	margin: 3rem auto;
}

.kaira-divider-svg path {
	stroke: var(--wp--preset--color--accent);
	stroke-width: 1.5;
	fill: none;
	stroke-dasharray: 400;
	stroke-dashoffset: 400;
	animation: kaira-draw-line linear both;
	animation-timeline: view();
	animation-range: entry 0% entry 60%;
	filter: drop-shadow(0 0 4px var(--kaira-accent-glow));
}

@keyframes kaira-draw-line {
	from { stroke-dashoffset: 400; }
	to { stroke-dashoffset: 0; }
}

/* Static divider fallback */
.kaira-divider {
	width: 60px;
	height: 1px;
	background: var(--wp--preset--color--accent);
	margin: 2rem auto;
	border: none;
}


/* ==========================================================================
   17. View Transitions
   ========================================================================== */

@view-transition {
	navigation: auto;
}

/* Header stays fixed during transition */
.kaira-header {
	view-transition-name: header;
}

::view-transition-old(header),
::view-transition-new(header) {
	animation: none;
}

/* Card images morph between list and detail */
.kaira-card-image img {
	view-transition-name: var(--vt-name, none);
}

::view-transition-old(root),
::view-transition-new(root) {
	animation-duration: 0.3s;
}


/* ==========================================================================
   18. WooCommerce Overrides
   ========================================================================== */

.wc-block-grid__product {
	background: var(--wp--preset--color--surface);
	overflow: hidden;
	transition: transform var(--kaira-transition-smooth),
	            box-shadow var(--kaira-transition-smooth);
}

.wc-block-grid__product:hover {
	transform: translateY(-8px);
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.wc-block-grid__product img {
	transition: transform 0.6s ease;
}

.wc-block-grid__product:hover img {
	transform: scale(1.05);
}

.wp-block-button__link {
	border-radius: 0;
}

/* Rose badge for New/Featured */
.kaira-badge {
	display: inline-block;
	background: var(--kaira-rose);
	color: var(--wp--preset--color--heading);
	font-size: 0.625rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.15em;
	padding: 0.2rem 0.6rem;
}


/* ==========================================================================
   19. Responsive
   ========================================================================== */

@media (max-width: 1024px) {
	.kaira-scene-intro {
		grid-template-columns: 1fr;
	}

	.kaira-scene-intro-image {
		height: 50vh;
	}

	.kaira-scene-intro-text {
		padding: 3rem 2rem;
	}

	.kaira-journal-grid {
		grid-template-columns: 1fr;
		grid-template-rows: auto;
	}

	.kaira-journal-grid .kaira-card--featured {
		grid-row: auto;
	}

	.kaira-timeline-item {
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	.kaira-timeline-item:nth-child(even) {
		direction: ltr;
	}

	.kaira-single-content blockquote {
		margin: 2rem 0;
	}
}

@media (max-width: 768px) {
	.kaira-hero-title {
		font-size: clamp(2rem, 10vw, 4rem);
	}

	.kaira-destination-card {
		width: 85vw;
	}

	.kaira-card-grid {
		grid-template-columns: 1fr;
	}

	.kaira-archive-grid .kaira-archive-row--2,
	.kaira-archive-grid .kaira-archive-row--3 {
		grid-template-columns: 1fr;
	}

	.kaira-scene-split {
		grid-template-rows: auto auto;
	}
}

@media (max-width: 480px) {
	.kaira-scene-intro-text {
		padding: 2rem 1rem;
	}

	.kaira-hero-subtitle {
		padding: 0.75rem 1.5rem;
		font-size: 0.9rem;
	}
}


/* ==========================================================================
   20. Reduced Motion
   ========================================================================== */

@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		animation-duration: 0.01ms !important;
		animation-delay: 0ms !important;
		transition-duration: 0.01ms !important;
		scroll-behavior: auto !important;
	}

	.kaira-cursor { display: none; }
	body::before { display: none; }
	.kaira-ambient-glow { display: none; }
	.kaira-cinematic { scroll-snap-type: none; }
}
```

**Step 5: Commit**

```bash
git add kaira-theme/assets/css/custom.css
git commit -m "feat: rebuild CSS for v2.0 award-winning redesign

Complete rewrite: glassmorphism, scroll-driven animations, cinematic
scenes, 3D tilt cards, custom cursor, animated SVG dividers, view
transitions. Zero animation libraries. Full responsive + reduced motion."
```

---

## Task 4: Create JavaScript Modules

Create the new JS interaction systems.

**Files:**
- Rewrite: `kaira-theme/assets/js/main.js`
- Create: `kaira-theme/assets/js/particles.js`
- Create: `kaira-theme/assets/js/cursor.js`
- Create: `kaira-theme/assets/js/tilt.js`
- Create: `kaira-theme/assets/js/split-text.js`
- Modify: `kaira-theme/functions.php` (enqueue new scripts)

**Step 1: Rewrite main.js**

Replace `kaira-theme/assets/js/main.js` with:

```js
/**
 * Kaira Theme v2.0 — Main JS
 *
 * Handles: frosted glass header, scroll indicator, ambient glow,
 * scroll-skew effect, back-to-top, and IntersectionObserver fallback
 * for browsers without scroll-driven animation support.
 */
(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		var header = document.querySelector('.kaira-header');
		var scrollIndicator = document.querySelector('.kaira-scroll-indicator');
		var hero = document.querySelector('.kaira-hero');
		var isHomepage = !!document.querySelector('.kaira-hero-home');
		var ambientGlow = null;

		// --- Create ambient glow element ---
		if (!('ontouchstart' in window)) {
			ambientGlow = document.createElement('div');
			ambientGlow.className = 'kaira-ambient-glow';
			document.body.appendChild(ambientGlow);

			document.addEventListener('mousemove', function (e) {
				ambientGlow.style.left = e.clientX + 'px';
				ambientGlow.style.top = e.clientY + 'px';
			});

			// Only active on hero sections
			var heroSection = document.querySelector('.kaira-hero');
			if (heroSection) {
				var glowObserver = new IntersectionObserver(function (entries) {
					entries.forEach(function (entry) {
						if (entry.isIntersecting) {
							ambientGlow.classList.add('active');
						} else {
							ambientGlow.classList.remove('active');
						}
					});
				}, { threshold: 0.3 });
				glowObserver.observe(heroSection);
			}
		}

		// --- Frosted Glass Header ---
		if (header) {
			var ticking = false;
			var isScrolling = false;
			var scrollTimer = null;
			var skewElements = document.querySelectorAll('.kaira-scroll-skew');

			window.addEventListener('scroll', function () {
				if (ticking) return;
				ticking = true;

				// Scroll skew effect
				if (!isScrolling) {
					isScrolling = true;
					skewElements.forEach(function (el) {
						el.classList.add('is-scrolling');
					});
				}
				clearTimeout(scrollTimer);
				scrollTimer = setTimeout(function () {
					isScrolling = false;
					skewElements.forEach(function (el) {
						el.classList.remove('is-scrolling');
					});
				}, 150);

				requestAnimationFrame(function () {
					var scrollY = window.scrollY;

					if (isHomepage) {
						var threshold = window.innerHeight * 0.9;
						header.classList.toggle('scrolled', scrollY > threshold);
					} else {
						var heroBottom = hero ? hero.offsetHeight : 50;
						header.classList.toggle('scrolled', scrollY > heroBottom);
					}

					if (scrollIndicator) {
						scrollIndicator.classList.toggle('hidden', scrollY > 100);
					}

					ticking = false;
				});
			}, { passive: true });
		}

		// --- Back to Top ---
		var backToTop = document.querySelector('.kaira-back-to-top');
		if (backToTop) {
			backToTop.addEventListener('click', function (e) {
				e.preventDefault();
				window.scrollTo({ top: 0, behavior: 'smooth' });
			});
		}

		// --- Fallback: IntersectionObserver for reveal animations ---
		if (!CSS.supports('animation-timeline', 'view()')) {
			var revealElements = document.querySelectorAll('.kaira-reveal');
			if (revealElements.length && 'IntersectionObserver' in window) {
				var observer = new IntersectionObserver(function (entries) {
					entries.forEach(function (entry) {
						if (entry.isIntersecting) {
							entry.target.classList.add('visible');
							observer.unobserve(entry.target);
						}
					});
				}, { threshold: 0.1 });

				revealElements.forEach(function (el) {
					observer.observe(el);
				});
			}
		}
	});
})();
```

**Step 2: Create particles.js**

Create `kaira-theme/assets/js/particles.js`:

```js
/**
 * Kaira Particle System — Canvas-based gold particles
 * Features: depth simulation, cursor repulsion, mouse trail
 */
(function () {
	'use strict';

	var canvas, ctx, particles, mouse, animFrame, isActive;
	var PARTICLE_COUNT = 35;
	var REPEL_RADIUS = 150;
	var TRAIL_LIFETIME = 600;
	var trailParticles = [];

	function Particle(x, y, size, speed, depth) {
		this.x = x;
		this.y = y;
		this.baseX = x;
		this.baseY = y;
		this.size = size;
		this.speed = speed;
		this.depth = depth; // 0-1, affects blur and brightness
		this.angle = Math.random() * Math.PI * 2;
		this.drift = 0.3 + Math.random() * 0.5;
	}

	function TrailParticle(x, y) {
		this.x = x;
		this.y = y;
		this.size = 2 + Math.random() * 3;
		this.life = TRAIL_LIFETIME;
		this.maxLife = TRAIL_LIFETIME;
	}

	function init() {
		var container = document.querySelector('.kaira-particles-canvas');
		if (!container) return;
		if ('ontouchstart' in window) return; // Skip on mobile

		canvas = document.createElement('canvas');
		canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none';
		container.appendChild(canvas);

		ctx = canvas.getContext('2d');
		mouse = { x: -1000, y: -1000 };
		particles = [];
		isActive = true;

		resize();
		createParticles();

		container.parentElement.addEventListener('mousemove', function (e) {
			var rect = canvas.getBoundingClientRect();
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;

			// Spawn trail particle
			if (Math.random() > 0.6) {
				trailParticles.push(new TrailParticle(mouse.x, mouse.y));
			}
		});

		container.parentElement.addEventListener('mouseleave', function () {
			mouse.x = -1000;
			mouse.y = -1000;
		});

		window.addEventListener('resize', resize);

		// Observe visibility
		var observer = new IntersectionObserver(function (entries) {
			isActive = entries[0].isIntersecting;
			if (isActive && !animFrame) loop();
		}, { threshold: 0.1 });
		observer.observe(container);

		loop();
	}

	function resize() {
		if (!canvas) return;
		var rect = canvas.parentElement.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;
	}

	function createParticles() {
		particles = [];
		for (var i = 0; i < PARTICLE_COUNT; i++) {
			var depth = Math.random();
			particles.push(new Particle(
				Math.random() * canvas.width,
				Math.random() * canvas.height,
				2 + depth * 5,
				0.2 + Math.random() * 0.3,
				depth
			));
		}
	}

	function loop() {
		if (!isActive) { animFrame = null; return; }
		animFrame = requestAnimationFrame(loop);

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Update and draw main particles
		for (var i = 0; i < particles.length; i++) {
			var p = particles[i];

			// Floating motion
			p.angle += 0.005 * p.speed;
			p.x = p.baseX + Math.sin(p.angle) * 30 * p.drift;
			p.y = p.baseY + Math.cos(p.angle * 0.7) * 20 * p.drift;

			// Slow drift upward
			p.baseY -= 0.1 * p.speed;
			if (p.baseY < -p.size) {
				p.baseY = canvas.height + p.size;
				p.baseX = Math.random() * canvas.width;
			}

			// Cursor repulsion
			var dx = p.x - mouse.x;
			var dy = p.y - mouse.y;
			var dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < REPEL_RADIUS) {
				var force = (1 - dist / REPEL_RADIUS) * 3;
				p.x += (dx / dist) * force;
				p.y += (dy / dist) * force;
			}

			// Draw with depth-based blur and opacity
			var alpha = 0.08 + p.depth * 0.15;
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
			ctx.fillStyle = 'rgba(201, 168, 76, ' + alpha + ')';
			ctx.fill();

			// Glow effect for foreground particles
			if (p.depth > 0.6) {
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
				ctx.fillStyle = 'rgba(201, 168, 76, ' + (alpha * 0.3) + ')';
				ctx.fill();
			}
		}

		// Update and draw trail particles
		for (var j = trailParticles.length - 1; j >= 0; j--) {
			var tp = trailParticles[j];
			tp.life -= 16;
			if (tp.life <= 0) {
				trailParticles.splice(j, 1);
				continue;
			}
			var tAlpha = (tp.life / tp.maxLife) * 0.2;
			ctx.beginPath();
			ctx.arc(tp.x, tp.y, tp.size * (tp.life / tp.maxLife), 0, Math.PI * 2);
			ctx.fillStyle = 'rgba(201, 168, 76, ' + tAlpha + ')';
			ctx.fill();
		}
	}

	document.addEventListener('DOMContentLoaded', init);
})();
```

**Step 3: Create cursor.js**

Create `kaira-theme/assets/js/cursor.js`:

```js
/**
 * Kaira Custom Cursor — magnetic + grow effect
 */
(function () {
	'use strict';

	if ('ontouchstart' in window) return;

	document.addEventListener('DOMContentLoaded', function () {
		var cursor = document.createElement('div');
		cursor.className = 'kaira-cursor';
		document.body.appendChild(cursor);

		var cursorX = 0, cursorY = 0;
		var targetX = 0, targetY = 0;
		var MAGNETIC_RADIUS = 50;

		document.addEventListener('mousemove', function (e) {
			targetX = e.clientX;
			targetY = e.clientY;
		});

		// Magnetic pull toward interactive elements
		var interactives = 'a, button, .kaira-card, .kaira-gallery-item, .wp-block-button__link, input';

		document.addEventListener('mouseover', function (e) {
			if (e.target.closest(interactives)) {
				cursor.classList.add('is-hovering');
			}
		});

		document.addEventListener('mouseout', function (e) {
			if (e.target.closest(interactives)) {
				cursor.classList.remove('is-hovering');
			}
		});

		function tick() {
			cursorX += (targetX - cursorX) * 0.15;
			cursorY += (targetY - cursorY) * 0.15;
			cursor.style.transform = 'translate(' + cursorX + 'px, ' + cursorY + 'px) translate(-50%, -50%)';
			requestAnimationFrame(tick);
		}

		tick();
	});
})();
```

**Step 4: Create tilt.js**

Create `kaira-theme/assets/js/tilt.js`:

```js
/**
 * Kaira 3D Tilt Effect — perspective + light reflection
 */
(function () {
	'use strict';

	if ('ontouchstart' in window) return;

	document.addEventListener('DOMContentLoaded', function () {
		var tiltElements = document.querySelectorAll('.kaira-tilt');
		var MAX_TILT = 5; // degrees

		tiltElements.forEach(function (el) {
			var inner = el.querySelector('.kaira-tilt-inner') || el;
			var reflection = el.querySelector('.kaira-tilt-reflection');

			el.addEventListener('mousemove', function (e) {
				var rect = el.getBoundingClientRect();
				var x = (e.clientX - rect.left) / rect.width;
				var y = (e.clientY - rect.top) / rect.height;

				var rotateX = (0.5 - y) * MAX_TILT;
				var rotateY = (x - 0.5) * MAX_TILT;

				inner.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';

				if (reflection) {
					reflection.style.background = 'linear-gradient(' +
						(105 + rotateY * 10) + 'deg, ' +
						'transparent 40%, rgba(255,255,255,0.04) 45%, transparent 50%)';
				}
			});

			el.addEventListener('mouseleave', function () {
				inner.style.transform = 'rotateX(0) rotateY(0)';
			});
		});
	});
})();
```

**Step 5: Create split-text.js**

Create `kaira-theme/assets/js/split-text.js`:

```js
/**
 * Kaira Split Text — character stagger animation
 */
(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		var splitElements = document.querySelectorAll('.kaira-split-text');

		splitElements.forEach(function (el) {
			var text = el.textContent;
			el.innerHTML = '';
			el.setAttribute('aria-label', text);

			for (var i = 0; i < text.length; i++) {
				var span = document.createElement('span');
				span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
				span.style.display = 'inline-block';
				span.style.opacity = '0';
				span.style.transform = 'translateY(20px)';
				span.style.animation = 'kaira-char-in 0.4s ease forwards';
				span.style.animationDelay = (i * 30) + 'ms';
				span.setAttribute('aria-hidden', 'true');
				el.appendChild(span);
			}
		});
	});
})();
```

Also add this keyframe to custom.css (can be appended in the Reduced Motion section area or separate):

This keyframe is already handled by CSS. Add it to the CSS file in the Global section:

```css
@keyframes kaira-char-in {
	from { opacity: 0; transform: translateY(20px); }
	to { opacity: 1; transform: translateY(0); }
}
```

**Step 6: Update functions.php to enqueue new scripts**

In `kaira-theme/functions.php`, replace the `kaira_enqueue_assets` function (lines 26-58) with:

```php
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

    wp_enqueue_script(
        'kaira-main',
        get_template_directory_uri() . '/assets/js/main.js',
        array(),
        KAIRA_VERSION,
        true
    );

    wp_enqueue_script(
        'kaira-cursor',
        get_template_directory_uri() . '/assets/js/cursor.js',
        array(),
        KAIRA_VERSION,
        true
    );

    wp_enqueue_script(
        'kaira-tilt',
        get_template_directory_uri() . '/assets/js/tilt.js',
        array(),
        KAIRA_VERSION,
        true
    );

    wp_enqueue_script(
        'kaira-split-text',
        get_template_directory_uri() . '/assets/js/split-text.js',
        array(),
        KAIRA_VERSION,
        true
    );

    if ( is_front_page() ) {
        wp_enqueue_script(
            'kaira-particles',
            get_template_directory_uri() . '/assets/js/particles.js',
            array(),
            KAIRA_VERSION,
            true
        );
    }

    if ( is_page_template( 'page-gallery' ) || is_page( 'gallery' ) ) {
        wp_enqueue_script(
            'kaira-gallery',
            get_template_directory_uri() . '/assets/js/gallery.js',
            array(),
            KAIRA_VERSION,
            true
        );
    }
}
```

**Step 7: Commit**

```bash
git add kaira-theme/assets/js/ kaira-theme/functions.php
git commit -m "feat: add JS interaction modules for v2.0

Canvas particle system (particles.js), custom magnetic cursor (cursor.js),
3D tilt cards (tilt.js), split text reveals (split-text.js).
Updated main.js with ambient glow, scroll-skew, and animation fallbacks.
All modules ~6KB total, no external libraries."
```

---

## Task 5: Rebuild Homepage Template (5 Cinematic Scenes)

Replace the front-page.html with the new cinematic scroll design.

**Files:**
- Modify: `kaira-theme/templates/front-page.html` (replace entirely)

**Step 1: Write the new front-page.html**

Replace the entire contents of `kaira-theme/templates/front-page.html` with:

```html
<!-- wp:template-part {"slug":"header","area":"header"} /-->

<!-- wp:html -->
<div class="kaira-cinematic">
<!-- /wp:html -->

<!-- SCENE 1: Hero ================================================== -->
<!-- wp:cover {"dimRatio":0,"minHeight":100,"minHeightUnit":"vh","isDark":true,"className":"kaira-hero kaira-hero-home kaira-scene","layout":{"type":"constrained","contentSize":"900px"}} -->
<div class="wp-block-cover is-dark kaira-hero kaira-hero-home kaira-scene" style="min-height:100vh">
<span aria-hidden="true" class="wp-block-cover__background has-background-dim-0 has-background-dim"></span>
<div class="wp-block-cover__inner-container">

<!-- wp:html -->
<div class="kaira-hero-overlay" aria-hidden="true"></div>
<div class="kaira-particles-canvas" aria-hidden="true"></div>
<!-- /wp:html -->

<!-- wp:html -->
<div class="kaira-hero-exit" style="text-align:center">
<h1 class="kaira-hero-title kaira-split-text">EXPLORE WITH KAIRA</h1>
<div class="kaira-hero-subtitle">Luxury travel & lifestyle through the eyes of your favorite AI influencer</div>
</div>
<!-- /wp:html -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"2.5rem"}}}} -->
<div class="wp-block-buttons" style="margin-top:2.5rem">
<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="/destinations/">Begin the Journey</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->

<!-- wp:html -->
<div class="kaira-scroll-indicator" aria-hidden="true">
<span>Scroll</span>
</div>
<!-- /wp:html -->

</div>
</div>
<!-- /wp:cover -->

<!-- SCENE 2: Introduction ========================================== -->
<!-- wp:html -->
<section class="kaira-scene kaira-scene-intro">
<div class="kaira-scene-intro-image">
<img src="" alt="Kaira portrait" class="kaira-parallax" loading="lazy" />
</div>
<div class="kaira-scene-intro-text">
<p class="kaira-section-label kaira-reveal">Meet Kaira</p>
<h2 class="kaira-display-font kaira-reveal" style="font-size:clamp(2rem,4vw,3.5rem);color:#fff;margin:1rem 0 1.5rem">
Your Guide to the <em>Extraordinary</em>
</h2>
<p class="kaira-reveal" style="color:var(--wp--preset--color--text);font-size:1.125rem;line-height:1.8">
AI-powered luxury travel influencer exploring the world's most breathtaking destinations. From Bali sunsets to Parisian nights, every journey is crafted to inspire wanderlust and elevate your perspective.
</p>
<div class="kaira-divider" style="margin:2rem 0;margin-left:0"></div>
<a href="/about/" class="kaira-reveal" style="color:var(--wp--preset--color--accent);font-size:0.875rem;text-transform:uppercase;letter-spacing:0.15em;text-decoration:none;">Learn More &rarr;</a>
</div>
</section>
<!-- /wp:html -->

<!-- SCENE 3: Featured Destinations ================================= -->
<!-- wp:html -->
<section class="kaira-scene kaira-scene-destinations" style="background:var(--wp--preset--color--background)">
<div class="kaira-scroll-progress"></div>
<div style="position:absolute;top:3rem;left:50%;transform:translateX(-50%);text-align:center;z-index:2">
<p class="kaira-section-label">Featured Destinations</p>
<h2 class="kaira-display-font" style="font-size:clamp(2rem,4vw,3.5rem);color:#fff;margin-top:0.75rem">Where Will You Go?</h2>
</div>
<div class="kaira-horizontal-track">
<div class="kaira-destination-card">
<img src="" alt="Paris" loading="lazy" />
<div class="kaira-destination-card-info">
<span class="kaira-tag">Europe</span>
<h3 style="color:#fff;font-family:var(--wp--preset--font-family--heading);font-size:1.5rem;margin:0">Paris, France</h3>
</div>
</div>
<div class="kaira-destination-card">
<img src="" alt="Bali" loading="lazy" />
<div class="kaira-destination-card-info">
<span class="kaira-tag">Asia</span>
<h3 style="color:#fff;font-family:var(--wp--preset--font-family--heading);font-size:1.5rem;margin:0">Bali, Indonesia</h3>
</div>
</div>
<div class="kaira-destination-card">
<img src="" alt="Dubai" loading="lazy" />
<div class="kaira-destination-card-info">
<span class="kaira-tag">Middle East</span>
<h3 style="color:#fff;font-family:var(--wp--preset--font-family--heading);font-size:1.5rem;margin:0">Dubai, UAE</h3>
</div>
</div>
<div class="kaira-destination-card">
<img src="" alt="Tulum" loading="lazy" />
<div class="kaira-destination-card-info">
<span class="kaira-tag">Americas</span>
<h3 style="color:#fff;font-family:var(--wp--preset--font-family--heading);font-size:1.5rem;margin:0">Tulum, Mexico</h3>
</div>
</div>
</div>
</section>
<!-- /wp:html -->

<!-- SCENE 4: Latest from the Journal =============================== -->
<!-- wp:group {"tagName":"section","className":"kaira-scene","layout":{"type":"constrained","contentSize":"1200px"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"}}}} -->
<section class="wp-block-group kaira-scene" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)">

<!-- wp:html -->
<p class="kaira-section-label" style="text-align:center">The Journal</p>
<h2 class="kaira-display-font" style="text-align:center;font-size:clamp(2rem,4vw,3.5rem);color:#fff;margin:0.75rem 0 3rem">Stories & Destinations</h2>
<!-- /wp:html -->

<!-- wp:query {"queryId":1,"query":{"perPage":3,"postType":"post","order":"desc","orderBy":"date"}} -->
<div class="wp-block-query">

<!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->

<!-- wp:group {"className":"kaira-card kaira-reveal","layout":{"type":"default"}} -->
<div class="wp-block-group kaira-card kaira-reveal">

<!-- wp:group {"className":"kaira-card-image","layout":{"type":"default"}} -->
<div class="wp-block-group kaira-card-image">
<!-- wp:post-featured-image {"isLink":true} /-->
</div>
<!-- /wp:group -->

<!-- wp:group {"className":"kaira-card-body","layout":{"type":"default"}} -->
<div class="wp-block-group kaira-card-body">
<!-- wp:post-terms {"term":"category","className":"kaira-card-meta"} /-->
<!-- wp:post-title {"level":3,"isLink":true,"style":{"typography":{"fontSize":"1.25rem"}}} /-->
<!-- wp:post-excerpt {"excerptLength":20} /-->
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->

<!-- /wp:post-template -->

</div>
<!-- /wp:query -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"3rem"}}}} -->
<div class="wp-block-buttons" style="margin-top:3rem">
<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="/blog/">Read the Journal</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->

</section>
<!-- /wp:group -->

<!-- SCENE 5: Shop Preview + Newsletter ============================= -->
<!-- wp:html -->
<section class="kaira-scene kaira-scene-split">
<!-- Shop Preview -->
<div style="width:100%;padding:4rem 2rem">
<div style="max-width:1200px;margin:0 auto;text-align:center">
<p class="kaira-section-label">The Collection</p>
<h2 class="kaira-display-font" style="font-size:clamp(2rem,4vw,3.5rem);color:#fff;margin:0.75rem 0 3rem">Shop Kaira</h2>
<p style="color:var(--wp--preset--color--muted);margin-bottom:2rem">Curated pieces from around the world. Coming soon.</p>
<a href="/shop/" style="display:inline-block;padding:0.875rem 2rem;background:var(--wp--preset--color--accent);color:var(--wp--preset--color--background);text-decoration:none;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Browse Collection</a>
</div>
</div>
<!-- Newsletter -->
<div class="kaira-newsletter" style="width:100%">
<p class="kaira-section-label">Stay Connected</p>
<h2 class="kaira-display-font" style="font-size:clamp(1.5rem,3vw,2.5rem);color:#fff;margin:0.75rem 0 1.5rem">Stay in the Loop</h2>
<p style="color:var(--wp--preset--color--muted);margin-bottom:2rem">Exclusive travel tips, behind-the-scenes content, and luxury lifestyle inspiration.</p>
<form class="kaira-newsletter-form" style="display:flex;flex-direction:column;align-items:center;gap:1rem;max-width:500px;margin:0 auto;">
<div class="kaira-input-wrapper">
<input type="email" class="kaira-input-underline" placeholder="Your email address" required />
</div>
<button type="submit" style="padding:0.875rem 2rem;background:var(--wp--preset--color--accent);color:var(--wp--preset--color--background);border:none;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;cursor:pointer;">Subscribe</button>
</form>
</div>
</section>
<!-- /wp:html -->

<!-- wp:html -->
</div><!-- .kaira-cinematic -->
<!-- /wp:html -->

<!-- wp:template-part {"slug":"footer","area":"footer"} /-->
```

**Step 2: Commit**

```bash
git add kaira-theme/templates/front-page.html
git commit -m "feat: rebuild homepage with 5 cinematic scroll scenes

Scene 1: Hero with canvas particles + split text + glass subtitle
Scene 2: Introduction split layout with parallax portrait
Scene 3: Horizontal scroll destination cards
Scene 4: Journal staggered grid with reveal animations
Scene 5: Shop preview + newsletter with animated underline input"
```

---

## Task 6: Rebuild Header and Footer Template Parts

Update global components with new logo and design.

**Files:**
- Modify: `kaira-theme/parts/header.html` (replace entirely)
- Modify: `kaira-theme/parts/footer.html` (replace entirely)

**Step 1: Write new header.html**

Replace the entire contents of `kaira-theme/parts/header.html` with:

```html
<!-- wp:group {"className":"kaira-header","layout":{"type":"constrained","contentSize":"1600px"},"style":{"spacing":{"padding":{"top":"1.25rem","bottom":"1.25rem"}}}} -->
<div class="wp-block-group kaira-header" style="padding-top:1.25rem;padding-bottom:1.25rem">

<!-- wp:group {"layout":{"type":"flex","justifyContent":"space-between","flexWrap":"nowrap"}} -->
<div class="wp-block-group">

<!-- wp:site-logo {"width":140,"shouldSyncIcon":false} /-->

<!-- wp:navigation {"overlayMenu":"mobile","layout":{"type":"flex","justifyContent":"center","flexWrap":"nowrap"},"style":{"typography":{"fontSize":"0.75rem","fontWeight":"600","textTransform":"uppercase","letterSpacing":"0.15em"},"elements":{"link":{":hover":{"color":{"text":"var(--wp--preset--color--accent)"}},"color":{"text":"#ffffff"}}},"spacing":{"blockGap":"2.5rem"}}} -->
<!-- wp:navigation-link {"label":"Home","url":"/","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"Destinations","url":"/destinations/","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"Lifestyle","url":"/lifestyle/","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"Gallery","url":"/gallery/","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"Shop","url":"/shop/","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"About","url":"/about/","kind":"custom","isTopLevelLink":true} /-->
<!-- /wp:navigation -->

</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->
```

**Step 2: Write new footer.html**

Replace the entire contents of `kaira-theme/parts/footer.html` with:

```html
<!-- wp:group {"className":"kaira-footer","backgroundColor":"surface","layout":{"type":"constrained","contentSize":"1200px"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|40"}}}} -->
<div class="wp-block-group kaira-footer has-surface-background-color has-background" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--40)">

<!-- wp:columns -->
<div class="wp-block-columns">

<!-- wp:column {"width":"40%"} -->
<div class="wp-block-column" style="flex-basis:40%">

<!-- wp:site-logo {"width":120,"shouldSyncIcon":false} /-->

<!-- wp:paragraph {"style":{"color":{"text":"var(--wp--preset--color--muted)"},"spacing":{"margin":{"top":"1.5rem"}}}} -->
<p class="has-text-color" style="color:var(--wp--preset--color--muted);margin-top:1.5rem">Curating the finest destinations, lifestyle inspiration, and visual stories from around the world.</p>
<!-- /wp:paragraph -->

<!-- wp:social-links {"className":"kaira-footer-social","style":{"spacing":{"margin":{"top":"1.5rem"}}}} -->
<ul class="wp-block-social-links kaira-footer-social" style="margin-top:1.5rem">
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
<h4 class="wp-block-heading has-text-color" style="color:var(--wp--preset--color--accent);font-size:0.75rem;font-weight:600;letter-spacing:0.15em;text-transform:uppercase">Explore</h4>
<!-- /wp:heading -->

<!-- wp:list {"style":{"typography":{"fontSize":"0.875rem"},"spacing":{"padding":{"left":"0"}},"list-style":"none"}} -->
<ul style="padding-left:0;font-size:0.875rem">
<!-- wp:list-item --><li><a href="/destinations/">Destinations</a></li><!-- /wp:list-item -->
<!-- wp:list-item --><li><a href="/lifestyle/">Lifestyle</a></li><!-- /wp:list-item -->
<!-- wp:list-item --><li><a href="/gallery/">Gallery</a></li><!-- /wp:list-item -->
<!-- wp:list-item --><li><a href="/shop/">Shop</a></li><!-- /wp:list-item -->
</ul>
<!-- /wp:list -->

</div>
<!-- /wp:column -->

<!-- wp:column {"width":"40%"} -->
<div class="wp-block-column" style="flex-basis:40%">

<!-- wp:heading {"level":4,"style":{"typography":{"fontSize":"0.75rem","textTransform":"uppercase","letterSpacing":"0.15em","fontWeight":"600"},"color":{"text":"var(--wp--preset--color--accent)"}}} -->
<h4 class="wp-block-heading has-text-color" style="color:var(--wp--preset--color--accent);font-size:0.75rem;font-weight:600;letter-spacing:0.15em;text-transform:uppercase">Stay in the Loop</h4>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.875rem"},"color":{"text":"var(--wp--preset--color--muted)"}}} -->
<p class="has-text-color" style="color:var(--wp--preset--color--muted);font-size:0.875rem">Subscribe for the latest travel stories and exclusive content.</p>
<!-- /wp:paragraph -->

<!-- wp:html -->
<form class="kaira-subscribe-form" style="display:flex;gap:0.5rem;margin-top:1rem;">
<div class="kaira-input-wrapper" style="flex:1">
<input type="email" class="kaira-input-underline" placeholder="Your email address" style="width:100%" required />
</div>
<button type="submit" style="padding:0.75rem 1.5rem;background:var(--wp--preset--color--accent);color:var(--wp--preset--color--background);border:none;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;cursor:pointer;">Subscribe</button>
</form>
<!-- /wp:html -->

</div>
<!-- /wp:column -->

</div>
<!-- /wp:columns -->

<!-- wp:separator {"className":"kaira-divider","style":{"spacing":{"margin":{"top":"3rem","bottom":"2rem"}}}} -->
<hr class="wp-block-separator kaira-divider" style="margin-top:3rem;margin-bottom:2rem" />
<!-- /wp:separator -->

<!-- wp:group {"layout":{"type":"flex","justifyContent":"space-between","flexWrap":"wrap"}} -->
<div class="wp-block-group">

<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.75rem"},"color":{"text":"var(--wp--preset--color--muted)"}}} -->
<p class="has-text-color" style="color:var(--wp--preset--color--muted);font-size:0.75rem">&copy; 2026 Explore With Kaira. All rights reserved.</p>
<!-- /wp:paragraph -->

<!-- wp:html -->
<button class="kaira-back-to-top" aria-label="Back to top">
<span>Back to Top</span>
<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 10V2M2 6l4-4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
</button>
<!-- /wp:html -->

</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->
```

**Step 3: Commit**

```bash
git add kaira-theme/parts/header.html kaira-theme/parts/footer.html
git commit -m "feat: rebuild header and footer for v2.0

Header: SVG logo, animated underline nav links, wider nav gap.
Footer: logo instead of text title, animated underline newsletter
input, back-to-top button, flex layout for copyright row."
```

---

## Task 7: Rebuild Inner Page Templates

Update single, archive, gallery, and about page templates.

**Files:**
- Modify: `kaira-theme/templates/single.html` (replace entirely)
- Modify: `kaira-theme/templates/index.html` (replace entirely)
- Modify: `kaira-theme/templates/archive.html` (replace entirely)
- Modify: `kaira-theme/templates/page-gallery.html` (replace entirely)
- Modify: `kaira-theme/templates/page-about.html` (replace entirely)

**Step 1: Write new single.html**

Replace contents of `kaira-theme/templates/single.html`:

```html
<!-- wp:template-part {"slug":"header","area":"header"} /-->

<!-- wp:cover {"useFeaturedImage":true,"dimRatio":70,"overlayColor":"background","minHeight":80,"minHeightUnit":"vh","isDark":true,"className":"kaira-hero kaira-hero--80vh","layout":{"type":"constrained","contentSize":"900px"}} -->
<div class="wp-block-cover is-dark kaira-hero kaira-hero--80vh" style="min-height:80vh">
<span aria-hidden="true" class="wp-block-cover__background has-background-background-color has-background-dim-70 has-background-dim"></span>
<div class="wp-block-cover__inner-container">

<!-- wp:html -->
<div class="kaira-hero-overlay" aria-hidden="true"></div>
<!-- /wp:html -->

<!-- wp:html -->
<div class="kaira-hero-glass-panel">
<!-- /wp:html -->

<!-- wp:post-terms {"term":"category","textAlign":"center","className":"kaira-hero-category"} /-->

<!-- wp:post-title {"textAlign":"center","level":1,"style":{"typography":{"fontFamily":"var(--wp--preset--font-family--display)","fontWeight":"600","lineHeight":"1.0","letterSpacing":"-0.02em"},"elements":{"link":{"color":{"text":"var(--wp--preset--color--heading)"}}}},"textColor":"heading","fontSize":"hero"} /-->

<!-- wp:group {"className":"kaira-hero-meta","layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-group kaira-hero-meta">
<!-- wp:post-date {"style":{"typography":{"fontSize":"0.875rem"},"color":{"text":"var(--wp--preset--color--muted)"}}} /-->
</div>
<!-- /wp:group -->

<!-- wp:html -->
</div><!-- .kaira-hero-glass-panel -->
<!-- /wp:html -->

</div>
</div>
<!-- /wp:cover -->

<!-- wp:group {"tagName":"article","className":"kaira-single-content","layout":{"type":"constrained","contentSize":"800px"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}}} -->
<article class="wp-block-group kaira-single-content" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">

<!-- wp:post-content {"layout":{"type":"constrained","contentSize":"800px"}} /-->

</article>
<!-- /wp:group -->

<!-- wp:html -->
<div class="kaira-divider-svg" style="max-width:200px;margin:0 auto">
<svg viewBox="0 0 200 20" preserveAspectRatio="none">
<path d="M0 10 Q50 0 100 10 Q150 20 200 10" stroke-linecap="round"/>
</svg>
</div>
<!-- /wp:html -->

<!-- wp:group {"tagName":"section","layout":{"type":"constrained","contentSize":"1200px"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|70"}}}} -->
<section class="wp-block-group" style="padding-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--70)">

<!-- wp:heading {"textAlign":"center","level":2,"className":"kaira-section-label","style":{"spacing":{"margin":{"bottom":"2rem"}}}} -->
<h2 class="wp-block-heading has-text-align-center kaira-section-label" style="margin-bottom:2rem">Keep Exploring</h2>
<!-- /wp:heading -->

<!-- wp:query {"queryId":3,"query":{"perPage":3,"postType":"post","order":"desc","orderBy":"date"}} -->
<div class="wp-block-query">

<!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->

<!-- wp:group {"className":"kaira-card kaira-reveal","layout":{"type":"default"}} -->
<div class="wp-block-group kaira-card kaira-reveal">

<!-- wp:group {"className":"kaira-card-image","layout":{"type":"default"}} -->
<div class="wp-block-group kaira-card-image">
<!-- wp:post-featured-image {"isLink":true} /-->
</div>
<!-- /wp:group -->

<!-- wp:group {"className":"kaira-card-body","layout":{"type":"default"}} -->
<div class="wp-block-group kaira-card-body">
<!-- wp:post-terms {"term":"category","className":"kaira-card-meta"} /-->
<!-- wp:post-title {"level":3,"isLink":true,"style":{"typography":{"fontSize":"1.25rem"}}} /-->
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->

<!-- /wp:post-template -->

</div>
<!-- /wp:query -->

</section>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer"} /-->
```

**Step 2: Write new archive.html**

Replace contents of `kaira-theme/templates/archive.html`:

```html
<!-- wp:template-part {"slug":"header","area":"header"} /-->

<!-- wp:cover {"dimRatio":70,"overlayColor":"background","minHeight":50,"minHeightUnit":"vh","isDark":true,"className":"kaira-hero kaira-hero--50vh","layout":{"type":"constrained","contentSize":"800px"}} -->
<div class="wp-block-cover is-dark kaira-hero kaira-hero--50vh" style="min-height:50vh">
<span aria-hidden="true" class="wp-block-cover__background has-background-background-color has-background-dim-70 has-background-dim"></span>
<div class="wp-block-cover__inner-container">

<!-- wp:html -->
<div class="kaira-hero-overlay" aria-hidden="true"></div>
<!-- /wp:html -->

<!-- wp:html -->
<p class="kaira-section-label" style="text-align:center">The Journal</p>
<!-- /wp:html -->

<!-- wp:query-title {"textAlign":"center","type":"archive","style":{"typography":{"fontFamily":"var(--wp--preset--font-family--display)","fontWeight":"600","lineHeight":"1.0"}},"fontSize":"hero"} /-->

</div>
</div>
<!-- /wp:cover -->

<!-- wp:group {"tagName":"section","layout":{"type":"constrained","contentSize":"1200px"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}}} -->
<section class="wp-block-group" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">

<!-- wp:query {"queryId":2,"query":{"perPage":12,"postType":"post","order":"desc","orderBy":"date"},"className":"kaira-card-grid"} -->
<div class="wp-block-query kaira-card-grid">

<!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->

<!-- wp:group {"className":"kaira-card kaira-reveal","layout":{"type":"default"}} -->
<div class="wp-block-group kaira-card kaira-reveal">

<!-- wp:group {"className":"kaira-card-image","layout":{"type":"default"}} -->
<div class="wp-block-group kaira-card-image">
<!-- wp:post-featured-image {"isLink":true} /-->
</div>
<!-- /wp:group -->

<!-- wp:group {"className":"kaira-card-body","layout":{"type":"default"}} -->
<div class="wp-block-group kaira-card-body">
<!-- wp:post-terms {"term":"category","className":"kaira-card-meta"} /-->
<!-- wp:post-title {"level":3,"isLink":true,"style":{"typography":{"fontSize":"1.25rem"}}} /-->
<!-- wp:post-excerpt {"excerptLength":20} /-->
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->

<!-- /wp:post-template -->

<!-- wp:query-pagination {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"3rem"}}}} -->
<!-- wp:query-pagination-previous /-->
<!-- wp:query-pagination-numbers /-->
<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination -->

</div>
<!-- /wp:query -->

</section>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer"} /-->
```

**Step 3: Write new index.html**

Replace contents of `kaira-theme/templates/index.html` with the same content as archive.html above but change the hero title:

```html
<!-- wp:template-part {"slug":"header","area":"header"} /-->

<!-- wp:cover {"dimRatio":70,"overlayColor":"background","minHeight":50,"minHeightUnit":"vh","isDark":true,"className":"kaira-hero kaira-hero--50vh","layout":{"type":"constrained","contentSize":"800px"}} -->
<div class="wp-block-cover is-dark kaira-hero kaira-hero--50vh" style="min-height:50vh">
<span aria-hidden="true" class="wp-block-cover__background has-background-background-color has-background-dim-70 has-background-dim"></span>
<div class="wp-block-cover__inner-container">

<!-- wp:html -->
<div class="kaira-hero-overlay" aria-hidden="true"></div>
<!-- /wp:html -->

<!-- wp:html -->
<p class="kaira-section-label" style="text-align:center">The Journal</p>
<!-- /wp:html -->

<!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontFamily":"var(--wp--preset--font-family--display)","fontWeight":"600","lineHeight":"1.0"},"elements":{"link":{"color":{"text":"var(--wp--preset--color--heading)"}}}},"textColor":"heading","fontSize":"hero"} -->
<h1 class="wp-block-heading has-text-align-center has-heading-color has-text-color has-hero-font-size" style="font-family:var(--wp--preset--font-family--display);font-weight:600;line-height:1.0">Stories & Destinations</h1>
<!-- /wp:heading -->

</div>
</div>
<!-- /wp:cover -->

<!-- wp:group {"tagName":"section","layout":{"type":"constrained","contentSize":"1200px"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}}} -->
<section class="wp-block-group" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">

<!-- wp:query {"queryId":2,"query":{"perPage":12,"postType":"post","order":"desc","orderBy":"date"},"className":"kaira-card-grid"} -->
<div class="wp-block-query kaira-card-grid">

<!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->

<!-- wp:group {"className":"kaira-card kaira-reveal","layout":{"type":"default"}} -->
<div class="wp-block-group kaira-card kaira-reveal">

<!-- wp:group {"className":"kaira-card-image","layout":{"type":"default"}} -->
<div class="wp-block-group kaira-card-image">
<!-- wp:post-featured-image {"isLink":true} /-->
</div>
<!-- /wp:group -->

<!-- wp:group {"className":"kaira-card-body","layout":{"type":"default"}} -->
<div class="wp-block-group kaira-card-body">
<!-- wp:post-terms {"term":"category","className":"kaira-card-meta"} /-->
<!-- wp:post-title {"level":3,"isLink":true,"style":{"typography":{"fontSize":"1.25rem"}}} /-->
<!-- wp:post-excerpt {"excerptLength":20} /-->
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->

<!-- /wp:post-template -->

<!-- wp:query-pagination {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"3rem"}}}} -->
<!-- wp:query-pagination-previous /-->
<!-- wp:query-pagination-numbers /-->
<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination -->

</div>
<!-- /wp:query -->

</section>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer"} /-->
```

**Step 4: Update page-gallery.html and page-about.html**

These are larger changes. Read the existing files first, then replace with the new designs following the CSS classes from custom.css. The gallery should use the sticky glass filter bar and masonry layout. The about page should use the timeline layout with reveal animations.

For brevity, these templates follow the same patterns as above — use `kaira-reveal` classes, `kaira-display-font` for headings, `kaira-section-label` for section labels, glassmorphism for filter bars, and the new hero variants.

**Step 5: Commit**

```bash
git add kaira-theme/templates/
git commit -m "feat: rebuild all inner page templates for v2.0

Single: 80vh hero with glass panel, drop cap content, animated SVG divider.
Archive/Index: 50vh hero with display font, card grid with reveal animations.
Gallery: sticky glass filter bar, masonry with hover overlays.
About: timeline layout, stat counters, reveal animations."
```

---

## Task 8: Rebuild Theme Zip and Final Version Bump

Package the complete v2.0 theme for deployment.

**Files:**
- Modify: `kaira-theme/style.css` (update version to 2.0.0)
- Create: `kaira-theme.zip` (rebuild)

**Step 1: Update style.css version**

In `kaira-theme/style.css`, change the `Version:` line to `2.0.0`.

**Step 2: Add the kaira-char-in keyframe to custom.css**

Ensure the split-text keyframe is in custom.css (in the Global section area):

```css
@keyframes kaira-char-in {
	from { opacity: 0; transform: translateY(20px); }
	to { opacity: 1; transform: translateY(0); }
}
```

**Step 3: Rebuild zip**

```bash
cd /Users/curtisvaughan/Kaira
rm -f kaira-theme.zip
zip -r kaira-theme.zip kaira-theme/ \
  -x "kaira-theme/.DS_Store" \
  -x "kaira-theme/**/.DS_Store" \
  -x "kaira-theme/node_modules/*"
```

**Step 4: Commit everything**

```bash
git add kaira-theme/style.css kaira-theme/assets/css/custom.css kaira-theme.zip
git commit -m "chore: rebuild theme zip for v2.0.0 deployment"
```

**Step 5: Push to remote**

```bash
git push origin master
```

---

## Task 9: Upload Logo SVG to WordPress and Configure

After deploying the theme zip, configure the logo in WordPress.

**Steps:**
1. Upload `kaira-theme/assets/images/kaira-logo.svg` to WordPress Media Library using the MCP tool
2. Set it as the site logo in Appearance > Customize > Site Identity
3. Upload the favicon SVG and set it as the site icon
4. Verify the header renders the SVG logo instead of text

This task requires the MCP WordPress tools and manual wp-admin configuration.

---

## Task 10: Generate and Upload Hero/Destination Images

Use the Kaira image generation MCP tools to create content for the homepage scenes.

**Steps:**
1. Generate a hero image for Scene 1 using `generate_kaira_image` with appropriate preset
2. Generate a portrait for Scene 2 (introduction)
3. Generate 4 destination images for Scene 3 (Paris, Bali, Dubai, Tulum)
4. Upload all images to WordPress Media Library
5. Update the homepage template `src` attributes with the uploaded image URLs

This task uses the MCP image generation and WordPress media tools.

---

## Post-Implementation Notes

- **Testing:** After deployment, test on Chrome, Firefox, Safari. Check that scroll-driven animations work (baseline since late 2024). The CSS `@supports not (animation-timeline: view())` fallback handles older browsers.
- **Performance:** Run Lighthouse audit. Target 90+ performance score. The Canvas particle system is the main risk — it's lazy-loaded and stops rendering when off-screen.
- **Accessibility:** Tab through all pages. Verify reduced motion disables everything. Check color contrast ratios (gold on dark should pass WCAG AA for large text).
- **Awwwards submission:** Once content is populated and images are generated, the site can be submitted to Awwwards.com for review.
