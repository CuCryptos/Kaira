# MCP Server Travel/Lifestyle Rebrand Design

**Date:** 2026-02-24
**Status:** Approved

## Summary

Rebrand the MCP server from a recipe/food blog tool to a travel/lifestyle content platform. Remove all recipe tools, rebrand Gemini Imagen for destination scenery, add travel-specific AI content generation tools, and keep the existing Kaira portrait generation and WordPress core tools.

## What Gets Removed

### Deleted Files
- `wp-mcp-server/tools/recipe-tools.js`
- `wp-mcp-server/utils/ingredient-parser.js`
- `wp-mcp-server/utils/nutrition-estimator.js`
- `wp-mcp-server/prompts/hawaiian-prompts.example.js`

### Removed Tools (from ai-tools.js)
- `generate_recipe_post` → replaced by `generate_travel_post`
- `generate_recipe_description` → replaced by `generate_destination_description`
- `generate_recipe_from_name` → removed entirely
- `generate_recipe_image` → replaced by `generate_destination_image`
- `generate_image_prompt` → rebranded for destination photography

### Removed from index.js
- Recipe tool imports, definitions, and `recipe_*` dispatch

### Rebranded
- `generate_seo_content` → updated for travel content (not recipe-specific)

## New/Rebranded AI Tools

### generate_travel_post (Anthropic)
- **Input:** destination, topic (e.g. "hidden gems", "luxury hotels"), focus_points[], word_count
- **Output:** HTML blog post in Kaira's voice — first-person luxury travel narrative
- **Replaces:** generate_recipe_post

### generate_destination_description (Anthropic)
- **Input:** destination, context (e.g. "weekend getaway", "honeymoon spot")
- **Output:** 150-300 word evocative description for excerpts/cards
- **Replaces:** generate_recipe_description

### generate_destination_image (Gemini Imagen)
- **Input:** destination, scene_type, filename, style, lighting, mood, upload_to_wordpress, post_id
- **Output:** Scenery/landscape photo (no people), uploaded to WP media library
- **Features:** Destination presets for consistent aesthetics
- **Replaces:** generate_recipe_image

### generate_seo_content (Anthropic, rebranded)
- **Input:** post_title, post_description, destination, category
- **Output:** meta title, meta description, excerpt, keywords — travel-focused

### generate_image_prompt (Anthropic, rebranded)
- **Input:** destination, scene_description, mood, time_of_day
- **Output:** Detailed prompt for destination photography (no people)

### Unchanged
- `generate_kaira_image` (Replicate) — Kaira portraits
- `list_kaira_presets` — Kaira scene presets

## Destination Image Presets

New file: `wp-mcp-server/prompts/destination-presets.js`

| Preset | Description |
|--------|-------------|
| tropical_beach | White sand, turquoise water, palm trees, golden hour |
| european_cityscape | Cobblestone streets, historic architecture, warm streetlamps |
| luxury_hotel | High-end interior, marble, warm ambient lighting |
| mountain_vista | Dramatic peaks, misty valleys, epic scale |
| coastal_village | Mediterranean or tropical village, colorful buildings |
| nightlife | City lights, neon reflections, moody evening |
| desert_luxury | Sand dunes or desert resort, warm tones, dramatic sky |
| tropical_jungle | Lush greenery, waterfalls, dappled light |

Each preset: base photography prompt + scene modifiers, cinematic editorial style matching Kaira brand.

## System Prompts Updates

File: `wp-mcp-server/prompts/system-prompts.js`

- **TRAVEL_POST_PROMPT:** Write as Kaira — well-traveled, aspirational, first-person luxury perspective. Rich sensory descriptions. Not generic travel guide content.
- **DESTINATION_DESCRIPTION_PROMPT:** Short, evocative, captures essence of a place.
- **SEO_CONTENT_PROMPT:** Updated for travel keywords.
- **IMAGE_PROMPT_TEMPLATE:** Updated for destination/scenery photography.

## index.js Updates

- Remove recipe tool imports and dispatch
- Update startup log (travel tools count instead of recipe tools)
- Keep `generate_*` prefix dispatch for AI tools
