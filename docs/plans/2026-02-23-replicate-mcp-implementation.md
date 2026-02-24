# Replicate MCP Integration — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add MCP tools to wp-mcp-server for generating photorealistic Kaira images via Replicate API with a pre-trained Flux Dev LoRA model.

**Architecture:** New `replicate-client.js` library handles Replicate HTTP API (create prediction, poll, download). New `kaira-presets.js` provides the identity prompt and scene presets. Two new tools (`generate_kaira_image`, `list_kaira_presets`) are added to the existing `ai-tools.js` module. Config follows the existing pattern in `config.js`. No changes to `index.js` since the tools use the `generate_` prefix already routed to `handleAITool`.

**Tech Stack:** Node.js (ES modules), Replicate HTTP API, existing wp-mcp-server infrastructure

**Design doc:** `docs/plans/2026-02-23-replicate-mcp-design.md`

---

### Task 1: Add Replicate Configuration

**Files:**
- Modify: `wp-mcp-server/lib/config.js`
- Modify: `wp-mcp-server/.env.example`

**Step 1: Add REPLICATE_CONFIG to config.js**

Add after the `GEMINI_CONFIG` block (after line 33) in `wp-mcp-server/lib/config.js`:

```javascript
// Replicate API configuration (OPTIONAL - enables Kaira image generation)
export const REPLICATE_CONFIG = {
  apiToken: process.env.REPLICATE_API_TOKEN || "",
  modelVersion: process.env.KAIRA_MODEL_VERSION || "",
  triggerToken: process.env.KAIRA_TRIGGER_TOKEN || "KAIRA",
};
```

**Step 2: Add `replicateConfigured` to validateConfig return**

In the `validateConfig` function return block (line 67-73), add `replicateConfigured`:

```javascript
return {
  valid: errors.length === 0,
  errors,
  aiConfigured: !!AI_CONFIG.apiKey,
  geminiConfigured: !!GEMINI_CONFIG.apiKey,
  replicateConfigured: !!REPLICATE_CONFIG.apiToken && !!REPLICATE_CONFIG.modelVersion,
};
```

**Step 3: Add Replicate env vars to .env.example**

Append to `wp-mcp-server/.env.example` after the Gemini section:

```
# --- OPTIONAL: Kaira Image Generation (Replicate) ---
# Enables: generate_kaira_image, list_kaira_presets
# Get a token from https://replicate.com/account/api-tokens
# REPLICATE_API_TOKEN=r8_...
# Train a LoRA first, then set the model version ID:
# KAIRA_MODEL_VERSION=your-trained-model-version-id
# Trigger token used during LoRA training (default: KAIRA)
# KAIRA_TRIGGER_TOKEN=KAIRA
```

**Step 4: Commit**

```bash
git add wp-mcp-server/lib/config.js wp-mcp-server/.env.example
git commit -m "feat: add Replicate configuration to MCP server"
```

---

### Task 2: Create Kaira Presets Module

**Files:**
- Create: `wp-mcp-server/prompts/kaira-presets.js`

**Step 1: Create the presets file**

Create `wp-mcp-server/prompts/kaira-presets.js`:

```javascript
/**
 * Kaira Identity Prompt & Scene Presets
 *
 * Base identity prompt is injected into every generation.
 * Presets add scene-specific modifiers.
 * Trigger token is replaced at runtime from KAIRA_TRIGGER_TOKEN env var.
 */

/**
 * Base identity prompt — injected into every Kaira image generation.
 * The {trigger} placeholder is replaced with the configured trigger token.
 */
export const KAIRA_BASE_PROMPT =
  "A photorealistic portrait of {trigger}, a woman in her mid-to-late twenties " +
  "with an ethnically ambiguous appearance — she could be Mediterranean, Latin, " +
  "Middle Eastern, or mixed. Dark hair, warm skin tone, striking features. " +
  "She is always alone in the frame. The style is candid editorial photography — " +
  "she looks caught in a moment, not posing. Dark and warm color grading, rich " +
  "shadows, warm highlights, slightly desaturated. The image should feel like a " +
  "film still, not social media content.";

/**
 * Negative prompt — applied to all generations.
 */
export const KAIRA_NEGATIVE_PROMPT =
  "cartoon, anime, illustration, painting, watercolor, sketch, deformed, " +
  "disfigured, blurry, low quality, text, watermark, logo, multiple people, " +
  "group photo, bright saturated Instagram filter";

/**
 * Scene presets — each adds modifiers to the base prompt.
 */
export const KAIRA_PRESETS = {
  mykonos_pool: {
    description: "Infinity pool overlooking the Aegean, white Cycladic architecture, golden hour",
    scene: "Infinity pool overlooking the Aegean Sea, white Cycladic architecture in the background, golden hour light, wearing a swimsuit or flowing dress",
  },
  paris_night: {
    description: "Parisian street at night, elegant evening outfit",
    scene: "Parisian street at night, warm streetlamp glow, elegant evening outfit, café or bridge in background",
  },
  paris_cafe: {
    description: "Seated at a Parisian café terrace, daytime chic casual",
    scene: "Seated at a Parisian café terrace, espresso or wine on table, daytime, wearing chic casual",
  },
  bali_sunset: {
    description: "Tropical sunset with jungle or rice terraces",
    scene: "Tropical sunset, lush jungle or rice terraces, flowing fabric, warm golden light",
  },
  dubai_skyline: {
    description: "Modern cityscape at dusk, sleek fashion",
    scene: "Modern cityscape at dusk, luxurious setting, sleek fashion, city lights beginning to glow",
  },
  tulum_beach: {
    description: "Caribbean beach at dawn, bohemian luxury",
    scene: "Caribbean beach at dawn, soft morning light, bohemian luxury style, ruins or palm trees",
  },
  amalfi_coast: {
    description: "Colorful Italian coastal village, Mediterranean light",
    scene: "Colorful Italian coastal village, Mediterranean light, sun hat and summer dress, lemon groves or terraces",
  },
  gym_fitness: {
    description: "High-end gym, athletic wear, dynamic pose",
    scene: "High-end gym or studio, athletic wear, dynamic mid-movement pose, dramatic lighting",
  },
  high_fashion: {
    description: "Studio or urban editorial, magazine-quality",
    scene: "Studio or urban editorial setting, high-fashion outfit, strong directional lighting, magazine-quality composition",
  },
  hotel_luxury: {
    description: "Luxury hotel interior, elegant attire",
    scene: "Luxury hotel interior — lobby, suite, or terrace — elegant attire, warm ambient lighting",
  },
  restaurant: {
    description: "Upscale restaurant or bar, evening candid feel",
    scene: "Upscale restaurant or bar setting, evening lighting, cocktail or wine, candid mid-conversation feel",
  },
  winter: {
    description: "Cold-weather destination, cozy luxury winter outfit",
    scene: "Cold-weather destination, cozy luxury winter outfit, snow or misty mountains, warm vs cold contrast",
  },
};

/**
 * Build a complete Kaira image prompt from preset and/or custom description.
 * @param {string} triggerToken - The LoRA trigger word
 * @param {string|null} presetKey - Preset name (optional)
 * @param {string|null} sceneDescription - Custom scene description (optional)
 * @returns {string} Assembled prompt
 */
export function buildKairaPrompt(triggerToken, presetKey, sceneDescription) {
  const baseParts = [KAIRA_BASE_PROMPT.replace("{trigger}", triggerToken)];

  if (presetKey && KAIRA_PRESETS[presetKey]) {
    baseParts.push(KAIRA_PRESETS[presetKey].scene);
  }

  if (sceneDescription) {
    baseParts.push(sceneDescription);
  }

  return baseParts.join(". ");
}

/**
 * Get list of available presets with descriptions.
 * @returns {Array<{name: string, description: string}>}
 */
export function listPresets() {
  return Object.entries(KAIRA_PRESETS).map(([name, preset]) => ({
    name,
    description: preset.description,
  }));
}
```

**Step 2: Commit**

```bash
git add wp-mcp-server/prompts/kaira-presets.js
git commit -m "feat: add Kaira identity prompt and scene presets"
```

---

### Task 3: Create Replicate API Client

**Files:**
- Create: `wp-mcp-server/lib/replicate-client.js`

**Step 1: Create the Replicate client**

Create `wp-mcp-server/lib/replicate-client.js`:

```javascript
/**
 * Replicate API Client for Kaira Image Generation
 *
 * Handles prediction creation, polling, and image download.
 * Uses Replicate's HTTP API directly (no SDK dependency).
 */

import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { REPLICATE_CONFIG } from "./config.js";

const REPLICATE_API_BASE = "https://api.replicate.com/v1";

/**
 * Check if Replicate is available (token + model configured)
 * @returns {boolean}
 */
export function isReplicateAvailable() {
  return !!REPLICATE_CONFIG.apiToken && !!REPLICATE_CONFIG.modelVersion;
}

/**
 * Check if Replicate token is set (model may not be trained yet)
 * @returns {boolean}
 */
export function isReplicateTokenSet() {
  return !!REPLICATE_CONFIG.apiToken;
}

/**
 * Make an authenticated request to the Replicate API.
 * @param {string} endpoint - API endpoint (relative to base)
 * @param {object} options - Fetch options
 * @returns {Promise<object>} Response JSON
 */
async function replicateRequest(endpoint, options = {}) {
  const url = `${REPLICATE_API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${REPLICATE_CONFIG.apiToken}`,
      "Content-Type": "application/json",
      Prefer: "wait",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Replicate API error (${response.status}): ${error}`);
  }

  return response.json();
}

/**
 * Create a prediction (start image generation).
 * @param {string} prompt - The full assembled prompt
 * @param {string} negativePrompt - Negative prompt
 * @param {object} options - Generation options
 * @returns {Promise<object>} Prediction object with id and status
 */
export async function createPrediction(prompt, negativePrompt, options = {}) {
  const input = {
    prompt,
    num_outputs: options.numOutputs || 1,
    aspect_ratio: options.aspectRatio || "3:4",
    output_format: "png",
    guidance: options.guidance || 3.5,
    num_inference_steps: options.numInferenceSteps || 28,
  };

  // Only include negative prompt if supported by model
  if (negativePrompt) {
    input.negative_prompt = negativePrompt;
  }

  // For LoRA models, use the predictions endpoint with version
  return replicateRequest("/predictions", {
    method: "POST",
    body: JSON.stringify({
      version: REPLICATE_CONFIG.modelVersion,
      input,
    }),
  });
}

/**
 * Get the status of a prediction.
 * @param {string} predictionId - Prediction ID
 * @returns {Promise<object>} Prediction object with status and output
 */
export async function getPrediction(predictionId) {
  return replicateRequest(`/predictions/${predictionId}`);
}

/**
 * Poll a prediction until it completes or fails.
 * @param {string} predictionId - Prediction ID
 * @param {number} maxAttempts - Maximum polling attempts (default 120)
 * @param {number} intervalMs - Polling interval in ms (default 2000)
 * @returns {Promise<object>} Completed prediction object
 */
export async function pollPrediction(predictionId, maxAttempts = 120, intervalMs = 2000) {
  for (let i = 0; i < maxAttempts; i++) {
    const prediction = await getPrediction(predictionId);

    if (prediction.status === "succeeded") {
      return prediction;
    }

    if (prediction.status === "failed" || prediction.status === "canceled") {
      throw new Error(
        `Prediction ${prediction.status}: ${prediction.error || "Unknown error"}`
      );
    }

    // Still processing — wait and retry
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  // Timeout — return what we have
  const finalState = await getPrediction(predictionId);
  throw new Error(
    `Prediction timed out after ${(maxAttempts * intervalMs) / 1000}s. ` +
    `Status: ${finalState.status}. ID: ${predictionId}. ` +
    `Check https://replicate.com/p/${predictionId}`
  );
}

/**
 * Download an image from a URL and save it locally.
 * @param {string} imageUrl - URL of the generated image
 * @param {string} filename - Output filename (without extension)
 * @returns {Promise<string>} Local file path
 */
export async function downloadAndSaveImage(imageUrl, filename) {
  const outputDir =
    process.env.IMAGE_OUTPUT_DIR ||
    path.resolve(
      path.dirname(new URL(import.meta.url).pathname),
      "../output/generated-images"
    );

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to download image (${response.status}): ${imageUrl}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const outputPath = path.join(outputDir, `${filename}.png`);
  fs.writeFileSync(outputPath, buffer);

  return outputPath;
}

/**
 * Generate a Kaira image end-to-end: create prediction, poll, download.
 * @param {string} prompt - Full assembled prompt
 * @param {string} negativePrompt - Negative prompt
 * @param {string} filename - Output filename (without extension)
 * @param {object} options - Generation options (aspectRatio, numOutputs, etc.)
 * @returns {Promise<{paths: string[], prediction: object}>} Local paths and prediction data
 */
export async function generateKairaImage(prompt, negativePrompt, filename, options = {}) {
  // Create prediction
  const prediction = await createPrediction(prompt, negativePrompt, options);

  // Poll until complete
  const completed = await pollPrediction(prediction.id);

  // Download all output images
  const outputs = completed.output || [];
  const paths = [];

  for (let i = 0; i < outputs.length; i++) {
    const suffix = outputs.length > 1 ? `-${i + 1}` : "";
    const localPath = await downloadAndSaveImage(outputs[i], `${filename}${suffix}`);
    paths.push(localPath);
  }

  return { paths, prediction: completed };
}
```

**Step 2: Commit**

```bash
git add wp-mcp-server/lib/replicate-client.js
git commit -m "feat: add Replicate API client for image generation"
```

---

### Task 4: Add MCP Tools to ai-tools.js

**Files:**
- Modify: `wp-mcp-server/tools/ai-tools.js`

**Step 1: Add imports at top of file**

Add after the existing imports (after line 13) in `wp-mcp-server/tools/ai-tools.js`:

```javascript
import {
  isReplicateAvailable,
  generateKairaImage,
} from "../lib/replicate-client.js";
import {
  buildKairaPrompt,
  listPresets,
  KAIRA_NEGATIVE_PROMPT,
  KAIRA_PRESETS,
} from "../prompts/kaira-presets.js";
import { REPLICATE_CONFIG } from "../lib/config.js";
```

**Step 2: Add tool definitions**

Add two new tool definitions to the `aiToolDefinitions` array, before the closing `];` (after line 192):

```javascript
  {
    name: "generate_kaira_image",
    description:
      "Generate a photorealistic Kaira image using Replicate Flux Dev + LoRA. " +
      "Provide a preset name and/or custom scene description. " +
      "Saves locally and optionally uploads to WordPress media library. " +
      "Requires REPLICATE_API_TOKEN and KAIRA_MODEL_VERSION environment variables.",
    inputSchema: {
      type: "object",
      properties: {
        preset: {
          type: "string",
          description:
            "Scene preset name (e.g., 'paris_night', 'amalfi_coast', 'hotel_luxury'). " +
            "Use list_kaira_presets to see all available presets.",
        },
        scene_description: {
          type: "string",
          description:
            "Custom scene description. Combined with preset if both provided, " +
            "or used standalone. E.g., 'standing on Pont Alexandre III, wearing a black dress'",
        },
        filename: {
          type: "string",
          description:
            "Output filename without extension (e.g., 'kaira-paris-bridge-01'). " +
            "Use URL-safe characters: letters, numbers, hyphens, underscores.",
        },
        aspect_ratio: {
          type: "string",
          description: "Image aspect ratio: '1:1', '16:9', '9:16', '4:3', '3:4' (default: '3:4' portrait)",
          default: "3:4",
        },
        upload_to_wordpress: {
          type: "boolean",
          description: "Upload to WordPress media library (default: true)",
          default: true,
        },
        post_id: {
          type: "number",
          description: "Optional: Post ID to set this image as featured image",
        },
        num_outputs: {
          type: "number",
          description: "Number of image variants to generate (default: 1, max: 4)",
          default: 1,
        },
      },
      required: ["filename"],
    },
  },
  {
    name: "list_kaira_presets",
    description:
      "List all available Kaira scene presets for image generation. " +
      "Use preset names with generate_kaira_image.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
```

**Step 3: Add requireReplicate helper**

Add after the `requireGemini` function (after line 220):

```javascript
/**
 * Check if Replicate is available, throw helpful error if not
 */
function requireReplicate() {
  if (!isReplicateAvailable()) {
    const missing = [];
    if (!REPLICATE_CONFIG.apiToken) missing.push("REPLICATE_API_TOKEN");
    if (!REPLICATE_CONFIG.modelVersion) missing.push("KAIRA_MODEL_VERSION");
    throw new Error(
      `Kaira image generation requires: ${missing.join(" and ")}. ` +
      (missing.includes("REPLICATE_API_TOKEN")
        ? "Get a token from https://replicate.com/account/api-tokens. "
        : "") +
      (missing.includes("KAIRA_MODEL_VERSION")
        ? "Train a LoRA first on Replicate, then set the model version ID. "
        : "") +
      "Then restart Claude Code to reload the MCP server."
    );
  }
}
```

**Step 4: Add tool handlers**

Add two new cases to the `handleAITool` switch statement, before the `default:` case (before line 448):

```javascript
    case "generate_kaira_image": {
      requireReplicate();

      // Validate inputs
      if (!args.preset && !args.scene_description) {
        throw new Error(
          "At least one of 'preset' or 'scene_description' is required. " +
          "Use list_kaira_presets to see available presets."
        );
      }

      if (args.preset && !KAIRA_PRESETS[args.preset]) {
        const validPresets = Object.keys(KAIRA_PRESETS).join(", ");
        throw new Error(
          `Unknown preset '${args.preset}'. Valid presets: ${validPresets}`
        );
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(args.filename)) {
        throw new Error(
          "Filename must contain only letters, numbers, hyphens, and underscores."
        );
      }

      const numOutputs = Math.min(Math.max(args.num_outputs || 1, 1), 4);

      // Build prompt
      const prompt = buildKairaPrompt(
        REPLICATE_CONFIG.triggerToken,
        args.preset || null,
        args.scene_description || null
      );

      // Generate image(s)
      const { paths, prediction } = await generateKairaImage(
        prompt,
        KAIRA_NEGATIVE_PROMPT,
        args.filename,
        {
          aspectRatio: args.aspect_ratio || "3:4",
          numOutputs,
        }
      );

      // Build result
      const result = {
        preset: args.preset || null,
        scene_description: args.scene_description || null,
        prompt_used: prompt,
        prediction_id: prediction.id,
        local_paths: paths,
        images: [],
      };

      // Upload to WordPress if requested
      const shouldUpload = args.upload_to_wordpress !== false;
      if (shouldUpload) {
        for (let i = 0; i < paths.length; i++) {
          const localPath = paths[i];
          const uploadFilename = path.basename(localPath);
          const mediaResult = await uploadMedia(localPath, uploadFilename);

          const imageInfo = {
            local_path: localPath,
            uploaded: true,
            media_id: mediaResult.id,
            media_url: mediaResult.source_url,
            featured_image_set: false,
          };

          // Set featured image if post_id provided (only for first image)
          if (args.post_id && i === 0) {
            await wpRequestSimple(`/posts/${args.post_id}`, {
              method: "POST",
              body: JSON.stringify({ featured_media: mediaResult.id }),
            });
            imageInfo.featured_image_set = true;
            imageInfo.post_id = args.post_id;
          }

          result.images.push(imageInfo);
        }
      } else {
        for (const localPath of paths) {
          result.images.push({
            local_path: localPath,
            uploaded: false,
          });
        }
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case "list_kaira_presets": {
      const presets = listPresets();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                presets,
                usage: "Use a preset name with generate_kaira_image's 'preset' parameter.",
                note: "You can also provide a custom 'scene_description' with or without a preset.",
              },
              null,
              2
            ),
          },
        ],
      };
    }
```

**Step 5: Add path import at the top of file**

Add `path` to the imports at the top of `ai-tools.js` (near the existing imports):

```javascript
import path from "path";
```

**Step 6: Commit**

```bash
git add wp-mcp-server/tools/ai-tools.js
git commit -m "feat: add generate_kaira_image and list_kaira_presets MCP tools"
```

---

### Task 5: Update index.js Startup Logging

**Files:**
- Modify: `wp-mcp-server/index.js`

**Step 1: Add Replicate import**

Add after the `isGeminiAvailable` import (after line 34):

```javascript
import { isReplicateAvailable } from "./lib/replicate-client.js";
```

**Step 2: Add availability notes for Replicate tools in ListToolsRequestSchema**

In the `server.setRequestHandler(ListToolsRequestSchema, ...)` handler (around line 65-93), add a block for Replicate tools after the Gemini block (after line 79):

```javascript
    // Replicate-specific tools
    if (tool.name === "generate_kaira_image") {
      if (!isReplicateAvailable()) {
        return {
          ...tool,
          description:
            tool.description +
            " [NOTE: REPLICATE_API_TOKEN/KAIRA_MODEL_VERSION not set - Kaira image generation unavailable]",
        };
      }
      return tool;
    }
```

**Step 3: Add Replicate status to startup log**

Add after the Gemini log line (after line 143):

```javascript
  console.error(
    `  - Replicate Kaira: ${isReplicateAvailable() ? "enabled" : "REPLICATE_API_TOKEN/KAIRA_MODEL_VERSION not set"}`
  );
```

**Step 4: Commit**

```bash
git add wp-mcp-server/index.js
git commit -m "feat: add Replicate availability logging and tool status notes"
```

---

### Task 6: Configure Environment & Test

**Files:**
- Modify: `/Users/curtisvaughan/Kaira/.mcp.json`

**Step 1: Add Replicate env vars to .mcp.json**

Add `REPLICATE_API_TOKEN` and `KAIRA_TRIGGER_TOKEN` to the env block. `KAIRA_MODEL_VERSION` will be added after LoRA training.

In `.mcp.json`, add to the `env` object:

```json
"REPLICATE_API_TOKEN": "YOUR_TOKEN_HERE",
"KAIRA_TRIGGER_TOKEN": "KAIRA"
```

**Note:** The user must replace `YOUR_TOKEN_HERE` with their actual Replicate API token. `KAIRA_MODEL_VERSION` is intentionally omitted until the LoRA is trained — the tool will give a clear error message explaining what's needed.

**Step 2: Verify the server starts**

After adding the env vars, restart Claude Code (or the MCP server) to pick up the new tools. The `list_kaira_presets` tool should work immediately. The `generate_kaira_image` tool will return a helpful error about `KAIRA_MODEL_VERSION` until the LoRA is trained and configured.

**Step 3: Test list_kaira_presets**

Call the `list_kaira_presets` tool. Expected result: JSON with 12 presets and usage instructions.

**Step 4: Commit the .mcp.json changes (without secrets)**

Do NOT commit .mcp.json if it contains actual API tokens. If it's already in .gitignore, no action needed. If not, add it.

---

## Summary

| Task | Description | New/Modified Files |
|------|-------------|-------------------|
| 1 | Replicate configuration | config.js, .env.example |
| 2 | Kaira presets module | kaira-presets.js (new) |
| 3 | Replicate API client | replicate-client.js (new) |
| 4 | MCP tool definitions + handlers | ai-tools.js |
| 5 | Startup logging + availability | index.js |
| 6 | Environment config + test | .mcp.json |

### After Implementation: LoRA Training

Once the code is deployed, the next step is training the Kaira LoRA on Replicate:

1. Collect 20-80 Kaira training images (already have 80+ across destination folders)
2. Zip the images
3. Go to https://replicate.com and run `ostris/flux-dev-lora-trainer`
4. Upload the zip, set trigger word to `KAIRA`, steps to 1000-1500
5. Wait 15-45 minutes for training to complete
6. Copy the model version ID
7. Add `KAIRA_MODEL_VERSION` to `.mcp.json` env block
8. Restart Claude Code — `generate_kaira_image` is now fully operational
