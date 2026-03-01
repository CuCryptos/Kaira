# Kaira Project

## Project Structure
- `kaira-theme/` — WordPress block theme (the deployable unit)
- `wp-mcp-server/` — MCP server for WordPress content management
- `scripts/sync-presets.js` — Generates PHP presets from MCP JS source of truth
- `deploy.sh` — Automated deploy script (WP Pusher + Bluehost SSO + cache clear)
- `docs/plans/` — Design docs and implementation plans

## Live Site
- URL: https://explorewithkaira.com
- Hosting: Bluehost (WordPress 6.9+)
- Theme: kaira-theme (block theme, FSE)
- GitHub: CuCryptos/Kaira (public)

## Key Commands
- `node scripts/sync-presets.js` — Regenerate kaira-presets-generated.php from MCP presets
- `rm -f kaira-theme.zip && cd kaira-theme && zip -r ../kaira-theme.zip . -x '*.DS_Store' '*__MACOSX*' '*.git*'` — Rebuild theme zip
- `git subtree split --prefix=kaira-theme -b deploy && git push origin deploy --force` — Update deploy branch
- `WP_USER=xxx WP_APP_PASS=xxx ./deploy.sh` — Full deploy (once WP Pusher is configured)

## Deployment (Current)
- Manual: Upload kaira-theme.zip via wp-admin > Appearance > Themes > Upload
- Always bump KAIRA_VERSION in functions.php before deploying (cache bust + triggers template reset)
- After upload, hard refresh (Cmd+Shift+R) to clear browser cache

## Bluehost Gotchas
- Bluehost injects NFD (Newtonify Design Framework) CSS/JS that overrides theme styles
- functions.php has `kaira_dequeue_nfd_assets()` at priority 999 to remove them
- Blocked prefixes: nfd-, jeep-, bluehost-, newfold-, wonder-, jeep_starter
- CSS selectors that need to beat NFD must be prefixed with `body` (e.g., `body .kaira-header`)
- Triple-layer caching: WP Super Cache, Bluehost Nginx/Endurance, Cloudflare CDN
- SSO endpoint: /wp-json/newfold-sso/v1/sso (Bluehost-specific)

## WordPress Block Theme Gotchas
- Site Editor customizations stored in DB (wp_template, wp_template_part posts) override theme files
- functions.php has `kaira_reset_templates_on_update()` that clears these when KAIRA_VERSION changes
- Must bump version to trigger reset — stale DB templates are the #1 cause of "my changes don't show up"
- Cover blocks: use `useFeaturedImage:true` for dynamic hero backgrounds on single posts

## Architecture Decisions
- MCP server (wp-mcp-server/prompts/kaira-presets.js) is source of truth for Kaira identity/presets
- Build script generates PHP from JS: scripts/sync-presets.js → kaira-theme/inc/kaira-presets-generated.php
- No !important in CSS — use `body` prefix for specificity instead
- No PHP available locally — cannot run php -l for linting
- No test suite — verify via build script run and visual inspection on live site

## MCP Server (wp-mcp-server)
- Tool dispatch in index.js routes by prefix: `wp_*` → wp-tools, `generate_*` → ai-tools
- Non-standard prefixed tools (e.g., `list_kaira_presets`, `list_destination_presets`) need explicit dispatch entries in index.js
- Restart Claude Code after changes to `.mcp.json` or MCP server code
- Test Replicate API directly: `curl -s -H "Authorization: Bearer $TOKEN" -H "Prefer: wait" https://api.replicate.com/v1/predictions -d '{"version":"...","input":{"prompt":"..."}}'`

## Image Generation APIs
- **Replicate (Kaira portraits only)**: Flux Dev + LoRA, model `cucryptos/kaira`, trigger word `skye`
- `KAIRA_MODEL_VERSION` must be the version hash (not training ID) — get from training output or `/v1/models/cucryptos/kaira`
- API defaults: guidance 3.0, num_inference_steps 32, output_format png, aspect_ratio 3:4
- **Gemini Imagen (everything else)**: locations, backgrounds, website imagery — anything that isn't Kaira herself
- Model: `imagen-4.0-generate-001`, personGeneration: DONT_ALLOW (no people in Gemini images)
- 12 Kaira scene presets in `wp-mcp-server/prompts/kaira-presets.js`: mykonos, paris_night, paris_cafe, bali, dubai, tulum, amalfi, gym, fashion, hotel, restaurant, winter
- 8 destination scene presets in `wp-mcp-server/prompts/destination-presets.js`: tropical_beach, european_cityscape, luxury_hotel, mountain_vista, coastal_village, nightlife, desert_luxury, tropical_jungle

## Kaira Image Realism (v2.2.0)
- Base prompt emphasizes: candid photograph (not portrait), Canon EOS R5 85mm f/1.4, visible skin texture/pores, flyaway hair, film grain, "unretouched 35mm film scan"
- Negative prompt blocks: airbrushed/smooth/plastic/poreless skin, beauty filter, HDR, CGI, perfect symmetry, studio backdrop
- Each preset has a "micro-narrative" (natural gesture/movement) to break static AI posing
- MCP server must be restarted after changes to kaira-presets.js (it caches modules at startup)
- Image Studio PHP (inc/image-studio.php) has matching guidance/steps params — keep in sync with replicate-client.js

## WordPress Layout System Conflicts
- WP adds `is-layout-constrained` + `has-global-padding` classes that inject `margin-left: auto !important` and `max-width` on children
- Override with `max-width: none` on specific elements — cannot avoid !important from WP core
- Blog post template grid: WP generates `grid-template-columns` — custom gap/margin overrides needed

## Design Tokens (theme.json)
- Background: #0a0a0a | Surface: #141414 | Accent: #c9a84c (gold)
- Text: #f5f0e8 | Heading: #ffffff | Muted: #8a8275
- Fonts: Playfair Display (heading), Inter (body) — self-hosted woff2
- Hero font size: clamp(2.5rem, 5vw, 5rem)

## Hero System
- Homepage: 100vh, class `kaira-hero-home`, bokeh particles + scroll indicator
- Single posts: 70vh, class `kaira-hero--70vh`, featured image bg + category pill + post meta
- Archive/Index: 50vh, class `kaira-hero--50vh`, title overlay
- All heroes: gold-tinted gradient overlay, wave edge SVG, diamond pattern pseudo-element

## Post Image Grids (v2.2.0)
- CSS in custom.css section 10b — 4 layout patterns for inline images in post content
- `.kaira-image-grid--2` — 2-column side-by-side (4:3 aspect)
- `.kaira-image-grid--3` — 3-column grid (1:1 square)
- `.kaira-image-grid--asymmetric` — 1 large + 2 small stacked (magazine layout)
- `.kaira-image-full-bleed` — Full viewport-width breakout (60vh)
- Add `data-lightbox` attribute to enable click-to-expand with arrow key navigation
- Responsive: stacks to single column below 768px
- gallery.js loaded on single posts (not just gallery page) via `is_single()` condition
- Lightbox HTML injected via `wp_footer` hook on single posts

## Kaira's Writing Voice

This is the most important section. Every piece of content must sound like Kaira — not a travel guide, not a tourism board, not a wiki page.

### Core Principle: Story First, Information Embedded
Kaira writes like a well-traveled friend confiding over wine, not a guidebook listing facts. Practical details (prices, hours, addresses, logistics) are woven INTO the narrative as insider knowledge — never presented as bullet-point checklists or standalone data.

**Wrong:** "Tickets: 170 MAD (~$18) per person, online purchase only."
**Right:** "Tickets are 170 MAD and online purchase only now — I watched a couple get turned away at the gate last October because they didn't know."

**Wrong:** "Tip: Start haggling at 30% of asking price."
**Right:** "Start at about a third of whatever they ask, expect to meet around 40 to 50 percent, and know that walking away slowly is the most powerful negotiating tool you have."

### Voice Characteristics
- **First-person lived experience** — Kaira has been there. She remembers the weight of the brass key, the scent at 7 AM, the exact moment the light changed. Write from memory, not research.
- **Sensory and atmospheric** — Every section earns its place through what she saw, smelled, tasted, heard, or felt. The reader should feel transported before they learn anything practical.
- **Mystery and discovery** — Doors that open onto hidden worlds, gardens that open only on Fridays, underground tunnels, artisans in closet-sized workshops. Marrakech (or any city) is a place that reveals itself to those who look.
- **Specific and actionable** — Real prices, real names, real hours. But delivered as insider knowledge, not data points. The specificity builds trust; the storytelling builds desire.
- **Emotionally resonant** — What places teach you. How they change you. The things you still dream about months later. Travel is transformation, not itinerary completion.
- **Respectful of culture** — Show rather than explain. Learn through encounters with real people (the zellige artisan, the gardener Hassan, Maître Brahim). Never reduce a culture to "tips for tourists."

### What Kaira Never Does
- Never writes bullet-point price lists in the body (one souk price guide per post is acceptable if it serves the reader — but make it flow)
- Never sounds like a tourism FAQ or TripAdvisor review
- Never uses the phrase "here's what you need to know" or "top 10" or "ultimate guide"
- Never describes herself as AI, virtual, digital, or algorithm-generated
- Never writes a section that's pure logistics without atmosphere — even the "before you land" paragraph should have a point of view
- Never sacrifices voice for information density — if a fact doesn't fit the narrative flow, restructure the narrative, don't dump the fact

### Content Research Standard
Posts must be backed by deep research — specific hotel rates, ticket prices, restaurant names, seasonal advice, cultural context, scam warnings, transportation costs. But the research is invisible scaffolding. The reader experiences Kaira's story; the accuracy is what makes them trust her.

### Post Structure (Flexible)
1. **Opening hook** — Drop the reader into a vivid moment. No preamble.
2. **Atmospheric sections** — Each built around a place, experience, or discovery. Prices and logistics woven in naturally.
3. **The thing most people miss** — A hidden gem, a cultural insight, a perspective shift.
4. **Closing** — Reflective. What stays with you. An invitation, not a summary.
