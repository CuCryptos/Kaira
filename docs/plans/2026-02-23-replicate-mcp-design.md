# Replicate MCP Integration — Design Document

**Date:** 2026-02-23
**Project:** Kaira Image Generation via Replicate API + MCP Tools
**Platform:** wp-mcp-server (Node.js MCP server for WordPress)

---

## 1. Goal

Add MCP tools to the existing wp-mcp-server so Claude Code can generate photorealistic Kaira images on demand using a pre-trained Flux Dev LoRA model on Replicate. Images are saved locally and uploaded to WordPress media library, matching the existing pattern used by the Gemini recipe image tool.

## 2. Architecture

### New Files
- `wp-mcp-server/lib/replicate-client.js` — Replicate API client (create prediction, poll, download)
- `wp-mcp-server/prompts/kaira-presets.js` — Kaira identity prompt + scene presets

### Modified Files
- `wp-mcp-server/lib/config.js` — Add `REPLICATE_CONFIG`
- `wp-mcp-server/tools/ai-tools.js` — Add `generate_kaira_image` and `list_kaira_presets` tools
- `wp-mcp-server/.env.example` — Document new env vars

### No Changes To
- `index.js` — Tools auto-discovered from existing ai-tools.js import
- `kaira-theme/` — WP admin Image Studio stays as-is, independent

### Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| `REPLICATE_API_TOKEN` | Yes | Replicate API token |
| `KAIRA_MODEL_VERSION` | Yes | Trained LoRA model version ID (from one-time training) |
| `KAIRA_TRIGGER_TOKEN` | No | LoRA trigger word — default `KAIRA` |

### Data Flow
1. Claude calls `generate_kaira_image` with preset and/or scene description
2. Tool injects base Kaira identity prompt + preset modifiers + LoRA trigger token
3. Replicate API creates a Flux Dev prediction with the LoRA
4. Tool polls until complete (~10-30 seconds)
5. Downloads image, saves locally to `output/generated-images/`
6. Optionally uploads to WordPress media library + sets as featured image
7. Returns local path, media ID, and URL

---

## 3. Kaira Identity Prompt System

### Base Identity Prompt
Injected into every generation automatically:

> A photorealistic portrait of KAIRA, a woman in her mid-to-late twenties with an ethnically ambiguous appearance — she could be Mediterranean, Latin, Middle Eastern, or mixed. Dark hair, warm skin tone, striking features. She is always alone in the frame. The style is candid editorial photography — she looks caught in a moment, not posing. Dark and warm color grading, rich shadows, warm highlights, slightly desaturated. The image should feel like a film still, not social media content.

(The trigger token `KAIRA` matches the LoRA training trigger word.)

### Negative Prompt
Applied to all generations:

> cartoon, anime, illustration, painting, watercolor, sketch, deformed, disfigured, blurry, low quality, text, watermark, logo, multiple people, group photo, bright saturated Instagram filter

### Scene Presets

| Preset Key | Scene Modifiers |
|------------|----------------|
| `mykonos_pool` | Infinity pool overlooking the Aegean Sea, white Cycladic architecture, golden hour light, wearing a swimsuit or flowing dress |
| `paris_night` | Parisian street at night, warm streetlamp glow, elegant evening outfit, café or bridge in background |
| `paris_cafe` | Seated at a Parisian café terrace, espresso or wine on table, daytime, wearing chic casual |
| `bali_sunset` | Tropical sunset, lush jungle or rice terraces, flowing fabric, warm golden light |
| `dubai_skyline` | Modern cityscape at dusk, luxurious setting, sleek fashion, city lights beginning to glow |
| `tulum_beach` | Caribbean beach at dawn, soft morning light, bohemian luxury style, ruins or palm trees |
| `amalfi_coast` | Colorful Italian coastal village, Mediterranean light, sun hat and summer dress, lemon groves or terraces |
| `gym_fitness` | High-end gym or studio, athletic wear, dynamic mid-movement pose, dramatic lighting |
| `high_fashion` | Studio or urban editorial setting, high-fashion outfit, strong directional lighting, magazine-quality composition |
| `hotel_luxury` | Luxury hotel interior — lobby, suite, or terrace — elegant attire, warm ambient lighting |
| `restaurant` | Upscale restaurant or bar setting, evening lighting, cocktail or wine, candid mid-conversation feel |
| `winter` | Cold-weather destination, cozy luxury winter outfit, snow or misty mountains, warm vs cold contrast |

Custom scene descriptions can be provided standalone or combined with a preset for specificity.

---

## 4. MCP Tool Interfaces

### Tool 1: `generate_kaira_image`

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `preset` | string | no | — | Preset name (e.g., `paris_night`, `amalfi_coast`) |
| `scene_description` | string | no | — | Custom scene description |
| `filename` | string | yes | — | Output filename without extension |
| `aspect_ratio` | string | no | `3:4` | `1:1`, `16:9`, `9:16`, `4:3`, `3:4` |
| `upload_to_wordpress` | boolean | no | `true` | Upload to WordPress media library |
| `post_id` | number | no | — | Set as featured image for this post |
| `num_outputs` | number | no | `1` | Generate variants (max 4) |

At least one of `preset` or `scene_description` is required.

**Prompt assembly order:**
1. Base identity prompt (with trigger token)
2. Preset scene modifiers (if preset provided)
3. Custom scene description (if provided)

### Tool 2: `list_kaira_presets`

No parameters. Returns preset names with descriptions.

---

## 5. Replicate Client

### API Calls
- **Create prediction:** `POST https://api.replicate.com/v1/predictions` with model version, prompt, and parameters
- **Get prediction:** `GET https://api.replicate.com/v1/predictions/{id}` to check status
- **Poll:** Loop get-prediction every 2 seconds until `succeeded` or `failed`

### Model Parameters (Flux Dev + LoRA)
```json
{
  "version": "{KAIRA_MODEL_VERSION}",
  "input": {
    "prompt": "{assembled prompt}",
    "negative_prompt": "{negative prompt}",
    "num_outputs": 1,
    "aspect_ratio": "3:4",
    "output_format": "png",
    "guidance_scale": 7.5,
    "num_inference_steps": 28
  }
}
```

---

## 6. Error Handling

| Scenario | Behavior |
|----------|----------|
| Missing `REPLICATE_API_TOKEN` | Clear error: "Replicate API token not configured. Set REPLICATE_API_TOKEN." |
| Missing `KAIRA_MODEL_VERSION` | Clear error: "No Kaira LoRA model configured. Set KAIRA_MODEL_VERSION." |
| Replicate server error / rate limit | Retry once after 5 seconds, then return error with status code |
| Prediction failure (NSFW filter, model error) | Return Replicate's error message directly |
| Polling timeout (4 min / 120 attempts) | Return prediction ID for manual checking, don't silently fail |
| Image download failure | Retry once, then return Replicate URL as fallback |
| Invalid preset name | Return error listing all valid preset names |
| Invalid filename (non-URL-safe chars) | Return validation error |
| `num_outputs` > 4 | Cap at 4, proceed with generation |

---

## 7. One-Time LoRA Training Setup

Training is done once outside of Claude Code. Documented steps:

1. **Prepare training images:** Collect 20-80 high-quality Kaira images. Variety of poses, outfits, lighting, and settings. Consistent face/identity across all images. Recommended: crop to square or 3:4, at least 1024px.

2. **Create training on Replicate:** Use `ostris/flux-dev-lora-trainer` via Replicate dashboard or API:
   - Upload a zip of training images
   - Set trigger word: `KAIRA`
   - Steps: 1000-1500 (more images = fewer steps needed)
   - Resolution: 1024
   - Learning rate: default (1e-4)

3. **Get model version:** Once training completes, copy the model version ID from Replicate.

4. **Configure env:** Set `KAIRA_MODEL_VERSION` in .mcp.json or .env to the version ID.

5. **Test:** Run `generate_kaira_image` with a simple preset to verify identity consistency.

---

## 8. File Structure (Final)

```
wp-mcp-server/
├── lib/
│   ├── config.js              (modified — add REPLICATE_CONFIG)
│   ├── replicate-client.js    (new — API client)
│   ├── wp-client.js           (unchanged)
│   ├── ai-client.js           (unchanged)
│   └── gemini-client.js       (unchanged)
├── tools/
│   ├── ai-tools.js            (modified — add 2 tools)
│   ├── wp-tools.js            (unchanged)
│   └── recipe-tools.js        (unchanged)
├── prompts/
│   ├── kaira-presets.js        (new — identity prompt + presets)
│   └── system-prompts.js      (unchanged)
├── index.js                    (unchanged)
└── .env.example                (modified — document new vars)
```
