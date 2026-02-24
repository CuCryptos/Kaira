# Header/Hero Adaptation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Adapt the CurtisJCooks immersive header/hero system for the Kaira block theme — gradient overlays with gold tint, bokeh particles, wave edges, scroll indicators, frosted glass header, and decorative dividers across all page types.

**Architecture:** CSS-driven visual effects in `custom.css`, enhanced scroll behavior in `main.js`, and updated block markup in all four templates (front-page, single, archive, index). Header part unchanged structurally.

**Tech Stack:** WordPress block theme (HTML templates), CSS (custom properties from theme.json), vanilla JS (IntersectionObserver, scroll events)

---

### Task 1: Hero Overlay, Wave Edge, and Decorative Dividers CSS

**Files:**
- Modify: `kaira-theme/assets/css/custom.css`

**Step 1: Replace the existing hero overlay gradient**

In `custom.css`, replace the `.kaira-hero-overlay` rule (lines 106-114) with the gold-tinted gradient:

```css
.kaira-hero-overlay {
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
```

**Step 2: Add wave edge pseudo-element**

After the `.kaira-hero-content` rule (after line 121), add:

```css
/* Wave edge at bottom of hero — smooth transition to content */
.kaira-hero::before {
	content: '';
	position: absolute;
	bottom: -1px;
	left: 0;
	width: 100%;
	height: 48px;
	background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 48' preserveAspectRatio='none'%3E%3Cpath d='M0 48 L0 24 Q180 0 360 24 Q540 48 720 24 Q900 0 1080 24 Q1260 48 1440 24 L1440 48 Z' fill='%230a0a0a'/%3E%3C/svg%3E");
	background-size: 100% 48px;
	background-repeat: no-repeat;
	z-index: 4;
	pointer-events: none;
}
```

**Step 3: Add diamond pattern overlay**

After the wave edge, add:

```css
/* Subtle diamond pattern overlay on hero */
.kaira-hero::after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20 Z' fill='none' stroke='%23c9a84c' stroke-width='0.5' opacity='0.04'/%3E%3C/svg%3E");
	background-repeat: repeat;
	background-size: 40px 40px;
	z-index: 2;
	pointer-events: none;
}
```

**Step 4: Add hero height variants**

After the diamond pattern, add:

```css
/* Hero height variants */
.kaira-hero--70vh {
	height: 70vh;
	min-height: 400px;
}

.kaira-hero--50vh {
	height: 50vh;
	min-height: 320px;
}
```

**Step 5: Add bokeh particle styles**

After the hero variants, add:

```css
/* Bokeh particles — floating gold dots (homepage only) */
.kaira-bokeh {
	position: absolute;
	border-radius: 50%;
	background: var(--wp--preset--color--accent);
	z-index: 3;
	pointer-events: none;
	animation: kaira-float var(--bokeh-duration, 14s) var(--bokeh-delay, 0s) infinite ease-in-out;
	opacity: var(--bokeh-opacity, 0.15);
}

@keyframes kaira-float {
	0%, 100% {
		transform: translateY(0) translateX(0);
		opacity: var(--bokeh-opacity, 0.15);
	}
	25% {
		transform: translateY(-40px) translateX(10px);
	}
	50% {
		transform: translateY(-80px) translateX(-5px);
		opacity: calc(var(--bokeh-opacity, 0.15) * 1.5);
	}
	75% {
		transform: translateY(-40px) translateX(8px);
	}
}
```

**Step 6: Add scroll indicator styles**

After the bokeh styles, add:

```css
/* Scroll indicator arrow */
.kaira-scroll-indicator {
	position: absolute;
	bottom: 3rem;
	left: 50%;
	transform: translateX(-50%);
	z-index: 5;
	animation: kaira-bounce 2s infinite;
	transition: opacity 0.4s ease;
}

.kaira-scroll-indicator svg {
	width: 24px;
	height: 24px;
	stroke: var(--wp--preset--color--text);
	stroke-width: 2;
	fill: none;
}

.kaira-scroll-indicator.hidden {
	opacity: 0;
	pointer-events: none;
}

@keyframes kaira-bounce {
	0%, 20%, 50%, 80%, 100% {
		transform: translateX(-50%) translateY(0);
	}
	40% {
		transform: translateX(-50%) translateY(-8px);
	}
	60% {
		transform: translateX(-50%) translateY(-4px);
	}
}
```

**Step 7: Add category pill and post meta styles (for single post hero)**

After the scroll indicator, add:

```css
/* Category pill — sits above hero title */
.kaira-hero-category {
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
	margin-bottom: 1.5rem;
	text-decoration: none;
}

.kaira-hero-category:hover {
	background: #e8d48b;
}

/* Post meta line in hero */
.kaira-hero-meta {
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

.kaira-hero-meta span + span::before {
	content: '\2022';
	color: var(--wp--preset--color--accent);
	margin-right: 1.5rem;
	font-size: 0.75em;
}
```

**Step 8: Add decorative gold wave accent under hero title**

After the post meta, add:

```css
/* Decorative wave accent under hero title */
.kaira-hero-content h1::after {
	content: '';
	display: block;
	width: 120px;
	height: 12px;
	margin: 1rem auto 0;
	background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='12' viewBox='0 0 120 12'%3E%3Cpath d='M0 6 Q15 0 30 6 Q45 12 60 6 Q75 0 90 6 Q105 12 120 6' fill='none' stroke='%23c9a84c' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat center;
	opacity: 0.7;
}
```

**Step 9: Add decorative SVG divider classes**

Replace the existing `.kaira-divider` rule (lines 38-44) with:

```css
.kaira-divider {
	width: 60px;
	height: 1px;
	background: var(--wp--preset--color--accent);
	margin: 2rem auto;
	border: none;
}

/* Decorative diamond-line divider */
.kaira-divider--diamond {
	width: 100%;
	height: 20px;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='20' viewBox='0 0 40 20'%3E%3Cpath d='M20 2 L38 10 L20 18 L2 10 Z' fill='none' stroke='%23c9a84c' stroke-width='0.75' opacity='0.3'/%3E%3C/svg%3E");
	background-repeat: repeat-x;
	background-position: center;
	background-size: auto 20px;
	border: none;
	margin: 3rem auto;
}

/* Decorative chevron divider */
.kaira-divider--chevron {
	width: 100%;
	height: 16px;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Cpath d='M0 14 L12 2 L24 14' fill='none' stroke='%23c9a84c' stroke-width='0.75' opacity='0.25'/%3E%3C/svg%3E");
	background-repeat: repeat-x;
	background-position: center;
	background-size: auto 16px;
	border: none;
	margin: 3rem auto;
}
```

**Step 10: Commit**

```bash
cd /Users/curtisvaughan/Kaira
git add kaira-theme/assets/css/custom.css
git commit -m "feat: add hero overlay, wave edge, bokeh, scroll indicator, divider CSS

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Enhanced Frosted Glass Header and Scroll Indicator JS

**Files:**
- Modify: `kaira-theme/assets/js/main.js`

**Step 1: Replace the entire file with enhanced scroll behavior**

Replace the full content of `main.js` with:

```javascript
/**
 * Kaira Theme — Main JS
 * Handles frosted glass header, scroll indicator, and fade-in animations.
 */
(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		var header = document.querySelector('.kaira-header');
		var scrollIndicator = document.querySelector('.kaira-scroll-indicator');
		var hero = document.querySelector('.kaira-hero');
		var isHomepage = !!document.querySelector('.kaira-hero-home');

		// --- Frosted Glass Header ---
		if (header) {
			var ticking = false;

			window.addEventListener('scroll', function () {
				if (ticking) return;
				ticking = true;

				requestAnimationFrame(function () {
					var scrollY = window.pageYOffset || document.documentElement.scrollTop;

					if (isHomepage) {
						// Homepage: transparent until 90% of viewport, then frosted glass
						var threshold = window.innerHeight * 0.9;
						if (scrollY > threshold) {
							header.classList.add('scrolled');
						} else {
							header.classList.remove('scrolled');
						}
					} else {
						// Other pages: frosted glass after scrolling past hero or 50px
						var heroBottom = hero ? hero.offsetHeight : 50;
						if (scrollY > heroBottom) {
							header.classList.add('scrolled');
						} else {
							header.classList.remove('scrolled');
						}
					}

					// Fade out scroll indicator on any scroll
					if (scrollIndicator && scrollY > 100) {
						scrollIndicator.classList.add('hidden');
					} else if (scrollIndicator) {
						scrollIndicator.classList.remove('hidden');
					}

					ticking = false;
				});
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

**Step 2: Commit**

```bash
cd /Users/curtisvaughan/Kaira
git add kaira-theme/assets/js/main.js
git commit -m "feat: enhance header scroll — frosted glass at 90vh on homepage, hero-aware elsewhere

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 3: Update Front Page Template with Bokeh and Scroll Indicator

**Files:**
- Modify: `kaira-theme/templates/front-page.html`

**Step 1: Replace the entire front-page.html**

The cover block needs the `kaira-hero-home` class for JS detection, plus bokeh spans and a scroll indicator inside the hero. Replace the entire file with:

```html
<!-- wp:template-part {"slug":"header","area":"header"} /-->

<!-- wp:cover {"dimRatio":60,"overlayColor":"background","minHeight":100,"minHeightUnit":"vh","isDark":true,"className":"kaira-hero kaira-hero-home","layout":{"type":"constrained","contentSize":"800px"}} -->
<div class="wp-block-cover is-dark kaira-hero kaira-hero-home" style="min-height:100vh">
<span aria-hidden="true" class="wp-block-cover__background has-background-background-color has-background-dim-60 has-background-dim"></span>
<div class="wp-block-cover__inner-container">

<!-- wp:html -->
<div class="kaira-hero-overlay" aria-hidden="true"></div>
<span class="kaira-bokeh" style="left:8%;bottom:15%;width:6px;height:6px;--bokeh-duration:16s;--bokeh-delay:0s;--bokeh-opacity:0.12" aria-hidden="true"></span>
<span class="kaira-bokeh" style="left:25%;bottom:30%;width:4px;height:4px;--bokeh-duration:12s;--bokeh-delay:2s;--bokeh-opacity:0.18" aria-hidden="true"></span>
<span class="kaira-bokeh" style="left:50%;bottom:10%;width:8px;height:8px;--bokeh-duration:18s;--bokeh-delay:1s;--bokeh-opacity:0.1" aria-hidden="true"></span>
<span class="kaira-bokeh" style="left:70%;bottom:25%;width:5px;height:5px;--bokeh-duration:14s;--bokeh-delay:3s;--bokeh-opacity:0.2" aria-hidden="true"></span>
<span class="kaira-bokeh" style="left:85%;bottom:40%;width:4px;height:4px;--bokeh-duration:20s;--bokeh-delay:0.5s;--bokeh-opacity:0.15" aria-hidden="true"></span>
<span class="kaira-bokeh" style="left:15%;bottom:50%;width:6px;height:6px;--bokeh-duration:15s;--bokeh-delay:4s;--bokeh-opacity:0.1" aria-hidden="true"></span>
<span class="kaira-bokeh" style="left:40%;bottom:5%;width:7px;height:7px;--bokeh-duration:13s;--bokeh-delay:1.5s;--bokeh-opacity:0.14" aria-hidden="true"></span>
<span class="kaira-bokeh" style="left:60%;bottom:55%;width:3px;height:3px;--bokeh-duration:17s;--bokeh-delay:2.5s;--bokeh-opacity:0.22" aria-hidden="true"></span>
<!-- /wp:html -->

<!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)"},"elements":{"link":{"color":{"text":"var(--wp--preset--color--heading)"}}}},"textColor":"heading","fontSize":"hero"} -->
<h1 class="wp-block-heading has-text-align-center has-heading-color has-text-color has-hero-font-size" style="font-family:var(--wp--preset--font-family--heading)">Explore With Kaira</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.125rem","letterSpacing":"0.05em"},"color":{"text":"var(--wp--preset--color--text)"}}} -->
<p class="has-text-align-center has-text-color" style="color:var(--wp--preset--color--text);font-size:1.125rem;letter-spacing:0.05em">Luxury travel &amp; lifestyle through the eyes of your favorite AI influencer</p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"2rem"}}}} -->
<div class="wp-block-buttons" style="margin-top:2rem">
<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="/destinations/">Begin the Journey</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->

<!-- wp:html -->
<div class="kaira-scroll-indicator" aria-hidden="true">
<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
</div>
<!-- /wp:html -->

</div>
</div>
<!-- /wp:cover -->

<!-- wp:group {"tagName":"section","layout":{"type":"constrained","contentSize":"1200px"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}}} -->
<section class="wp-block-group" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">

<!-- wp:heading {"textAlign":"center","level":2,"style":{"typography":{"fontSize":"0.75rem","textTransform":"uppercase","letterSpacing":"0.2em","fontWeight":"600"},"color":{"text":"var(--wp--preset--color--accent)"}}} -->
<h2 class="wp-block-heading has-text-align-center has-text-color" style="color:var(--wp--preset--color--accent);font-size:0.75rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase">Latest from Kaira</h2>
<!-- /wp:heading -->

<!-- wp:heading {"textAlign":"center","level":2,"style":{"spacing":{"margin":{"top":"1rem","bottom":"3rem"}}},"fontSize":"xx-large"} -->
<h2 class="wp-block-heading has-text-align-center has-xx-large-font-size" style="margin-top:1rem;margin-bottom:3rem">Stories &amp; Destinations</h2>
<!-- /wp:heading -->

<!-- wp:query {"queryId":1,"query":{"perPage":3,"postType":"post","order":"desc","orderBy":"date"},"className":"kaira-card-grid"} -->
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
<!-- wp:post-excerpt {"excerptLength":20} /-->
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

<!-- wp:heading {"textAlign":"center","level":2,"style":{"typography":{"fontSize":"0.75rem","textTransform":"uppercase","letterSpacing":"0.2em","fontWeight":"600"},"color":{"text":"var(--wp--preset--color--accent)"}}} -->
<h2 class="wp-block-heading has-text-align-center has-text-color" style="color:var(--wp--preset--color--accent);font-size:0.75rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase">Stay Connected</h2>
<!-- /wp:heading -->

<!-- wp:heading {"textAlign":"center","level":2,"style":{"spacing":{"margin":{"top":"1rem","bottom":"1rem"}}},"fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size" style="margin-top:1rem;margin-bottom:1rem">Join the Journey</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"color":{"text":"var(--wp--preset--color--muted)"}}} -->
<p class="has-text-align-center has-text-color" style="color:var(--wp--preset--color--muted)">Exclusive travel tips, behind-the-scenes content, and luxury lifestyle inspiration.</p>
<!-- /wp:paragraph -->

<!-- wp:html -->
<form class="kaira-newsletter-form" style="display:flex;gap:0.5rem;max-width:500px;margin:2rem auto 0;">
<input type="email" placeholder="Your email address" style="flex:1;padding:0.875rem 1rem;background:var(--wp--preset--color--background);border:1px solid var(--wp--preset--color--muted);color:var(--wp--preset--color--text);font-size:1rem;" required />
<button type="submit" style="padding:0.875rem 1.5rem;background:var(--wp--preset--color--accent);color:var(--wp--preset--color--background);border:none;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;cursor:pointer;">Subscribe</button>
</form>
<!-- /wp:html -->

</section>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer"} /-->
```

**Step 2: Commit**

```bash
cd /Users/curtisvaughan/Kaira
git add kaira-theme/templates/front-page.html
git commit -m "feat: add bokeh particles, scroll indicator, and gold overlay to homepage hero

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 4: Update Single Post Template with 70vh Hero

**Files:**
- Modify: `kaira-theme/templates/single.html`

**Step 1: Replace the entire single.html**

Adds a 70vh cover block hero with category pill and post meta. Post content follows below:

```html
<!-- wp:template-part {"slug":"header","area":"header"} /-->

<!-- wp:cover {"useFeaturedImage":true,"dimRatio":70,"overlayColor":"background","minHeight":70,"minHeightUnit":"vh","isDark":true,"className":"kaira-hero kaira-hero--70vh","layout":{"type":"constrained","contentSize":"800px"}} -->
<div class="wp-block-cover is-dark kaira-hero kaira-hero--70vh" style="min-height:70vh">
<span aria-hidden="true" class="wp-block-cover__background has-background-background-color has-background-dim-70 has-background-dim"></span>
<div class="wp-block-cover__inner-container">

<!-- wp:html -->
<div class="kaira-hero-overlay" aria-hidden="true"></div>
<!-- /wp:html -->

<!-- wp:post-terms {"term":"category","textAlign":"center","className":"kaira-hero-category"} /-->

<!-- wp:post-title {"textAlign":"center","level":1,"style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)"},"elements":{"link":{"color":{"text":"var(--wp--preset--color--heading)"}}}},"textColor":"heading","fontSize":"hero"} /-->

<!-- wp:html -->
<div class="kaira-hero-meta">
<span class="kaira-hero-date"></span>
</div>
<script>
(function(){
var d = document.querySelector('.kaira-hero-date');
if (d) {
	var pe = document.querySelector('.kaira-hero-meta');
	var dateEl = document.querySelector('time.wp-block-post-date');
	if (dateEl) d.textContent = dateEl.textContent;
}
})();
</script>
<!-- /wp:html -->

</div>
</div>
<!-- /wp:cover -->

<!-- wp:group {"tagName":"article","layout":{"type":"constrained","contentSize":"800px"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}}} -->
<article class="wp-block-group" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">

<!-- wp:post-content {"layout":{"type":"constrained","contentSize":"800px"}} /-->

<!-- wp:separator {"className":"kaira-divider--diamond","style":{"spacing":{"margin":{"top":"4rem","bottom":"4rem"}}}} -->
<hr class="wp-block-separator kaira-divider--diamond" style="margin-top:4rem;margin-bottom:4rem" />
<!-- /wp:separator -->

<!-- wp:heading {"textAlign":"center","level":2,"style":{"typography":{"fontSize":"0.75rem","textTransform":"uppercase","letterSpacing":"0.2em","fontWeight":"600"},"color":{"text":"var(--wp--preset--color--accent)"},"spacing":{"margin":{"bottom":"2rem"}}}} -->
<h2 class="wp-block-heading has-text-align-center has-text-color" style="color:var(--wp--preset--color--accent);font-size:0.75rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:2rem">Keep Exploring</h2>
<!-- /wp:heading -->

<!-- wp:query {"queryId":3,"query":{"perPage":3,"postType":"post","order":"desc","orderBy":"date"}} -->
<div class="wp-block-query">

<!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->

<!-- wp:group {"className":"kaira-card","layout":{"type":"default"}} -->
<div class="wp-block-group kaira-card">

<!-- wp:group {"className":"kaira-card-image","layout":{"type":"default"}} -->
<div class="wp-block-group kaira-card-image">
<!-- wp:post-featured-image {"isLink":true} /-->
</div>
<!-- /wp:group -->

<!-- wp:post-title {"level":3,"isLink":true,"style":{"typography":{"fontSize":"1.25rem"},"spacing":{"margin":{"top":"1rem"}}}} /-->

</div>
<!-- /wp:group -->

<!-- /wp:post-template -->

</div>
<!-- /wp:query -->

</article>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer"} /-->
```

**Step 2: Commit**

```bash
cd /Users/curtisvaughan/Kaira
git add kaira-theme/templates/single.html
git commit -m "feat: add 70vh hero with featured image, category pill, and diamond divider to single posts

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 5: Update Archive and Index Templates with 50vh Hero

**Files:**
- Modify: `kaira-theme/templates/archive.html`
- Modify: `kaira-theme/templates/index.html`

**Step 1: Replace archive.html**

Add a 50vh hero with the archive title overlaid on a gradient:

```html
<!-- wp:template-part {"slug":"header","area":"header"} /-->

<!-- wp:cover {"dimRatio":80,"overlayColor":"background","minHeight":50,"minHeightUnit":"vh","isDark":true,"className":"kaira-hero kaira-hero--50vh","layout":{"type":"constrained","contentSize":"800px"}} -->
<div class="wp-block-cover is-dark kaira-hero kaira-hero--50vh" style="min-height:50vh">
<span aria-hidden="true" class="wp-block-cover__background has-background-background-color has-background-dim-80 has-background-dim"></span>
<div class="wp-block-cover__inner-container">

<!-- wp:html -->
<div class="kaira-hero-overlay" aria-hidden="true"></div>
<!-- /wp:html -->

<!-- wp:query-title {"type":"archive","textAlign":"center","style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)"},"elements":{"link":{"color":{"text":"var(--wp--preset--color--heading)"}}}},"textColor":"heading","fontSize":"hero"} /-->

<!-- wp:term-description {"textAlign":"center","style":{"color":{"text":"var(--wp--preset--color--muted)"}}} /-->

</div>
</div>
<!-- /wp:cover -->

<!-- wp:group {"tagName":"main","layout":{"type":"constrained","contentSize":"1200px"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}}} -->
<main class="wp-block-group" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">

<!-- wp:query {"queryId":4,"query":{"perPage":12,"postType":"post","inherit":true}} -->
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
<!-- wp:post-excerpt {"excerptLength":20} /-->
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->

<!-- /wp:post-template -->

<!-- wp:query-pagination {"paginationArrow":"arrow","layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"var:preset|spacing|50"}}}} -->
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

**Step 2: Replace index.html**

Same hero treatment for the blog index:

```html
<!-- wp:template-part {"slug":"header","area":"header"} /-->

<!-- wp:cover {"dimRatio":80,"overlayColor":"background","minHeight":50,"minHeightUnit":"vh","isDark":true,"className":"kaira-hero kaira-hero--50vh","layout":{"type":"constrained","contentSize":"800px"}} -->
<div class="wp-block-cover is-dark kaira-hero kaira-hero--50vh" style="min-height:50vh">
<span aria-hidden="true" class="wp-block-cover__background has-background-background-color has-background-dim-80 has-background-dim"></span>
<div class="wp-block-cover__inner-container">

<!-- wp:html -->
<div class="kaira-hero-overlay" aria-hidden="true"></div>
<!-- /wp:html -->

<!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)"},"elements":{"link":{"color":{"text":"var(--wp--preset--color--heading)"}}}},"textColor":"heading","fontSize":"hero"} -->
<h1 class="wp-block-heading has-text-align-center has-heading-color has-text-color has-hero-font-size" style="font-family:var(--wp--preset--font-family--heading)">The Journal</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"color":{"text":"var(--wp--preset--color--muted)"}}} -->
<p class="has-text-align-center has-text-color" style="color:var(--wp--preset--color--muted)">Stories, destinations, and lifestyle inspiration</p>
<!-- /wp:paragraph -->

</div>
</div>
<!-- /wp:cover -->

<!-- wp:group {"tagName":"main","layout":{"type":"constrained","contentSize":"1200px"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}}} -->
<main class="wp-block-group" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">

<!-- wp:query {"queryId":2,"query":{"perPage":9,"postType":"post","order":"desc","orderBy":"date"}} -->
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
<!-- wp:post-excerpt {"excerptLength":20} /-->
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->

<!-- /wp:post-template -->

<!-- wp:query-pagination {"paginationArrow":"arrow","layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"var:preset|spacing|50"}}}} -->
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

**Step 3: Commit**

```bash
cd /Users/curtisvaughan/Kaira
git add kaira-theme/templates/archive.html kaira-theme/templates/index.html
git commit -m "feat: add 50vh hero to archive and index templates

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 6: Rebuild Theme Zip

**Files:**
- Regenerate: `kaira-theme.zip`

**Step 1: Rebuild zip**

```bash
cd /Users/curtisvaughan/Kaira
rm -f kaira-theme.zip
zip -r kaira-theme.zip kaira-theme/ -x "kaira-theme/.DS_Store" "kaira-theme/**/.DS_Store"
```

**Step 2: Commit**

```bash
cd /Users/curtisvaughan/Kaira
git add kaira-theme.zip
git commit -m "chore: rebuild theme zip with immersive header/hero system

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
