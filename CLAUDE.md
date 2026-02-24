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
