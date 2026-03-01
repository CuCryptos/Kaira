# MCP Server Travel/Lifestyle Rebrand Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove all recipe/food tools from the MCP server and replace with travel/lifestyle content tools aligned to the Kaira brand.

**Architecture:** The MCP server keeps its existing structure (index.js dispatcher, tools/, prompts/, lib/). Recipe tools and utils are deleted. AI tools in ai-tools.js are rewritten for travel content. Gemini client gets a new `buildDestinationPhotoPrompt` function. New destination-presets.js mirrors kaira-presets.js pattern.

**Tech Stack:** Node.js ESM, MCP SDK, Anthropic SDK, Google GenAI SDK, Replicate API

---

### Task 1: Delete recipe files

**Files:**
- Delete: `wp-mcp-server/tools/recipe-tools.js`
- Delete: `wp-mcp-server/utils/ingredient-parser.js`
- Delete: `wp-mcp-server/utils/nutrition-estimator.js`
- Delete: `wp-mcp-server/prompts/hawaiian-prompts.example.js`

**Step 1: Delete recipe tool files and utils**

```bash
rm wp-mcp-server/tools/recipe-tools.js
rm wp-mcp-server/utils/ingredient-parser.js
rm wp-mcp-server/utils/nutrition-estimator.js
rm wp-mcp-server/prompts/hawaiian-prompts.example.js
rmdir wp-mcp-server/utils 2>/dev/null || true
```

**Step 2: Remove RECIPE_CONFIG from config.js**

In `wp-mcp-server/lib/config.js`, delete the `RECIPE_CONFIG` export (lines 42-46).

**Step 3: Commit**

```bash
git add -A wp-mcp-server/tools/recipe-tools.js wp-mcp-server/utils/ wp-mcp-server/prompts/hawaiian-prompts.example.js wp-mcp-server/lib/config.js
git commit -m "chore: remove recipe tools, utils, and config"
```

---

### Task 2: Update index.js — remove recipe dispatch

**Files:**
- Modify: `wp-mcp-server/index.js`

**Step 1: Remove recipe imports**

Remove line 28:
```js
import { recipeToolDefinitions, handleRecipeTool } from "./tools/recipe-tools.js";
```

**Step 2: Remove recipe tools from allTools array**

Change lines 59-63 from:
```js
const allTools = [
  ...wpToolDefinitions,
  ...recipeToolDefinitions,
  ...aiToolDefinitions,
];
```
To:
```js
const allTools = [
  ...wpToolDefinitions,
  ...aiToolDefinitions,
];
```

**Step 3: Remove recipe dispatch block**

Remove lines 119-123:
```js
    // Try recipe tools
    if (name.startsWith("recipe_")) {
      const result = await handleRecipeTool(name, args);
      if (result) return result;
    }
```

**Step 4: Update startup log**

Change lines 148-149 from:
```js
  console.error(`WordPress tools: ${wpToolDefinitions.length}`);
  console.error(`Recipe tools: ${recipeToolDefinitions.length}`);
  console.error(`AI tools: ${aiToolDefinitions.length}`);
```
To:
```js
  console.error(`WordPress tools: ${wpToolDefinitions.length}`);
  console.error(`AI/content tools: ${aiToolDefinitions.length}`);
```

**Step 5: Update file header comment**

Replace the `* - Recipes:` line in the header comment with nothing (remove it). Update `* - AI Gen:` to list the new tool names:
```
 * - AI Gen:    generate_travel_post, generate_destination_description,
 *              generate_seo_content, generate_image_prompt, generate_destination_image
 * - Kaira:     generate_kaira_image, list_kaira_presets
```

**Step 6: Commit**

```bash
git add wp-mcp-server/index.js
git commit -m "chore: remove recipe dispatch from index.js"
```

---

### Task 3: Create destination-presets.js

**Files:**
- Create: `wp-mcp-server/prompts/destination-presets.js`

**Step 1: Create the presets file**

```js
/**
 * Destination Scene Presets for Gemini Imagen
 *
 * Each preset defines a scene template for generating destination/scenery photos.
 * No people — Gemini personGeneration is set to DONT_ALLOW.
 * Style matches Kaira brand: cinematic, warm, editorial.
 */

/**
 * Base photography prompt — injected into every destination image generation.
 */
export const DESTINATION_BASE_PROMPT =
  "Cinematic editorial photography. Rich warm color grading, deep shadows, " +
  "golden highlights. Shot on a full-frame camera with shallow depth of field. " +
  "No people, no text, no watermarks. The image should feel like a film still " +
  "from a luxury travel documentary.";

/**
 * Destination scene presets
 */
export const DESTINATION_PRESETS = {
  tropical_beach: {
    description: "White sand, turquoise water, palm trees, golden hour",
    scene: "Pristine white sand beach, crystal turquoise water, palm trees swaying, golden hour light casting long shadows, gentle waves",
  },
  european_cityscape: {
    description: "Cobblestone streets, historic architecture, warm streetlamps",
    scene: "European cobblestone street at dusk, warm streetlamp glow on historic stone buildings, café tables on the sidewalk, ambient golden light",
  },
  luxury_hotel: {
    description: "High-end interior, marble, warm ambient lighting",
    scene: "Luxury hotel interior, marble floors, plush furnishings, warm ambient lighting, floor-to-ceiling windows with a city or ocean view",
  },
  mountain_vista: {
    description: "Dramatic peaks, misty valleys, epic scale",
    scene: "Dramatic mountain peaks at sunrise, misty valleys below, epic scale landscape, golden light breaking through clouds",
  },
  coastal_village: {
    description: "Mediterranean or tropical village, colorful buildings",
    scene: "Colorful coastal village buildings cascading down a hillside to the sea, Mediterranean light, terracotta roofs, vibrant bougainvillea",
  },
  nightlife: {
    description: "City lights, neon reflections, moody evening",
    scene: "Urban nightscape, city lights reflecting on wet streets, neon signs, moody blue and amber tones, rooftop bar or boulevard view",
  },
  desert_luxury: {
    description: "Sand dunes or desert resort, warm tones, dramatic sky",
    scene: "Golden sand dunes at sunset, dramatic sky with warm orange and purple tones, luxury desert camp or infinity pool in the distance",
  },
  tropical_jungle: {
    description: "Lush greenery, waterfalls, dappled light",
    scene: "Lush tropical jungle, cascading waterfall, dappled sunlight through dense canopy, emerald green foliage, misty atmosphere",
  },
};

/**
 * Build a destination image prompt from preset and/or custom description.
 * @param {string|null} presetKey - Preset name (optional)
 * @param {string|null} sceneDescription - Custom scene description (optional)
 * @param {object} options - Additional prompt options (style, lighting, mood)
 * @returns {string} Assembled prompt
 */
export function buildDestinationPrompt(presetKey, sceneDescription, options = {}) {
  const parts = [DESTINATION_BASE_PROMPT];

  if (presetKey && DESTINATION_PRESETS[presetKey]) {
    parts.push(DESTINATION_PRESETS[presetKey].scene);
  }

  if (sceneDescription) {
    parts.push(sceneDescription);
  }

  if (options.lighting) {
    parts.push(`Lighting: ${options.lighting}`);
  }

  if (options.mood) {
    parts.push(`Mood: ${options.mood}`);
  }

  if (options.timeOfDay) {
    parts.push(`Time of day: ${options.timeOfDay}`);
  }

  return parts.join(". ");
}

/**
 * Get list of available destination presets with descriptions.
 * @returns {Array<{name: string, description: string}>}
 */
export function listDestinationPresets() {
  return Object.entries(DESTINATION_PRESETS).map(([name, preset]) => ({
    name,
    description: preset.description,
  }));
}
```

**Step 2: Commit**

```bash
git add wp-mcp-server/prompts/destination-presets.js
git commit -m "feat: add destination scene presets for Gemini image generation"
```

---

### Task 4: Rewrite system-prompts.js for travel content

**Files:**
- Modify: `wp-mcp-server/prompts/system-prompts.js`

**Step 1: Replace entire file contents**

```js
/**
 * System Prompts for Kaira Travel/Lifestyle Content Generation
 *
 * These prompts define Kaira's voice for AI-generated travel content.
 * Requires ANTHROPIC_API_KEY for the generate_* tools that use these.
 *
 * Option 1: Set CUSTOM_PROMPTS_PATH env var pointing to your own prompts file.
 * Option 2: Edit this file directly.
 */

/**
 * Base voice — Kaira's writing personality
 */
export const VOICE_BASE = `You are writing as Kaira for a luxury travel and lifestyle blog called "Explore With Kaira."

WRITING STYLE:
- First-person, aspirational, and intimate — like confiding in a well-traveled friend
- Rich sensory descriptions: what you see, smell, taste, hear, feel
- Confident but never pretentious — knowledgeable without being a know-it-all
- Weave in personal moments and candid observations
- Balance beauty with honesty — mention the imperfect, the unexpected, the real

BRAND VOICE:
- Luxury is a feeling, not a price tag
- Travel is about transformation, not just destinations
- Every place has a story — find the one most people miss
- Dark, warm aesthetic — think film stills, not Instagram filters`;

/**
 * Travel blog post generation prompt
 */
export const TRAVEL_POST_PROMPT = `${VOICE_BASE}

Write a full blog post about a travel destination or experience. Follow this structure:

1. OPENING HOOK (1-2 paragraphs)
   - Drop the reader into a vivid moment — a scene, a sensation, a surprising detail
   - Make them feel like they're already there

2. "Why [Destination]" SECTION
   - What drew Kaira here — the allure, the reputation, the hidden reason
   - Set expectations for what the reader will discover

3. "The Experience" SECTION (2-3 subsections)
   - The best moments, places, and discoveries
   - Specific recommendations with sensory detail
   - Insider tips that go beyond guidebook advice

4. "Where to Stay" or "Where to Eat" SECTION (if relevant)
   - Curated picks, not exhaustive lists
   - Why each place matters, not just what it is

5. "What Most People Miss" SECTION
   - The hidden gem, the off-schedule detour, the local secret

6. CLOSING
   - Reflective moment — what this place taught or revealed
   - Subtle call to explore

Write in HTML with <h2> for main sections. Target length is flexible but rich.`;

/**
 * Destination description prompt (150-300 words for excerpts/cards)
 */
export const DESTINATION_DESCRIPTION_PROMPT = `${VOICE_BASE}

Write a compelling destination description (150-300 words) that captures the essence of this place.

- Open with a vivid sensory moment or striking image
- Convey the atmosphere and what makes this destination unique
- End with something that pulls the reader toward wanting to go
- Suitable for a post excerpt, destination card, or preview snippet

Do NOT write a full guide — just the feeling and the promise of the place.`;

/**
 * SEO content generation prompt
 */
export const SEO_CONTENT_PROMPT = `${VOICE_BASE}

Generate SEO-optimized content for a travel blog post. Return a JSON object:

{
  "meta_title": "SEO title (50-60 characters, include destination and hook)",
  "meta_description": "Meta description (150-160 characters, compelling and includes destination)",
  "excerpt": "Post excerpt for archives (1-2 sentences, evocative)",
  "focus_keyword": "Primary keyword for the post",
  "secondary_keywords": ["array", "of", "related", "travel", "keywords"],
  "suggested_slug": "url-friendly-slug"
}

Guidelines:
- Meta description should evoke wanderlust, not just describe
- Use natural language, not keyword stuffing
- Focus on search intent: someone dreaming of or planning travel to this destination
- Include location-specific terms (neighborhood names, landmarks, local terms)`;

/**
 * Image prompt generation for destination photography
 */
export const IMAGE_PROMPT_TEMPLATE = `${VOICE_BASE}

Generate a detailed prompt for AI image generation to create cinematic destination photography (NO PEOPLE).

The prompt should describe:
1. The specific scene and setting
2. Time of day and lighting conditions
3. Color palette and mood
4. Composition and camera angle
5. Atmospheric details (mist, reflections, shadows)
6. Textures and foreground/background elements

Return a JSON object:
{
  "prompt": "Detailed image generation prompt",
  "negative_prompt": "Things to avoid in the image",
  "style_notes": "Additional styling guidance",
  "aspect_ratio": "16:9"
}

IMPORTANT:
- NO people in the image — this is scenery/destination only
- Cinematic, editorial quality — like a frame from a luxury travel documentary
- Warm color grading, rich shadows, golden highlights
- Include atmospheric and textural details for depth`;

/**
 * Load prompts — supports custom prompts via CUSTOM_PROMPTS_PATH env var
 * @returns {Promise<object>} Prompt constants
 */
export async function getPrompts() {
  const customPath = process.env.CUSTOM_PROMPTS_PATH;

  if (customPath) {
    try {
      const customPrompts = await import(customPath);
      return {
        TRAVEL_POST_PROMPT: customPrompts.TRAVEL_POST_PROMPT || TRAVEL_POST_PROMPT,
        DESTINATION_DESCRIPTION_PROMPT: customPrompts.DESTINATION_DESCRIPTION_PROMPT || DESTINATION_DESCRIPTION_PROMPT,
        SEO_CONTENT_PROMPT: customPrompts.SEO_CONTENT_PROMPT || SEO_CONTENT_PROMPT,
        IMAGE_PROMPT_TEMPLATE: customPrompts.IMAGE_PROMPT_TEMPLATE || IMAGE_PROMPT_TEMPLATE,
      };
    } catch (error) {
      console.error(`Warning: Could not load custom prompts from ${customPath}: ${error.message}`);
      console.error("Falling back to default prompts.");
    }
  }

  return {
    TRAVEL_POST_PROMPT,
    DESTINATION_DESCRIPTION_PROMPT,
    SEO_CONTENT_PROMPT,
    IMAGE_PROMPT_TEMPLATE,
  };
}
```

**Step 2: Commit**

```bash
git add wp-mcp-server/prompts/system-prompts.js
git commit -m "feat: rewrite system prompts for Kaira travel/lifestyle voice"
```

---

### Task 5: Rewrite ai-tools.js with travel tools

**Files:**
- Modify: `wp-mcp-server/tools/ai-tools.js`

**Step 1: Replace entire file with travel-focused tools**

The new file should:
- Import from `destination-presets.js` instead of using `buildFoodPhotoPrompt`
- Remove `generate_recipe_*` tools entirely
- Remove `generate_recipe_from_name` (no equivalent)
- Replace with: `generate_travel_post`, `generate_destination_description`, `generate_destination_image`, `list_destination_presets`
- Rebrand `generate_seo_content` for travel
- Rebrand `generate_image_prompt` for destination photography
- Keep `generate_kaira_image` and `list_kaira_presets` unchanged

New tool definitions:

```js
// generate_travel_post
{
  name: "generate_travel_post",
  description: "Generate a full travel blog post with Kaira's voice — first-person luxury travel narrative with sensory detail. Requires ANTHROPIC_API_KEY.",
  inputSchema: {
    type: "object",
    properties: {
      destination: { type: "string", description: "Destination name (e.g., 'Santorini', 'Tokyo', 'Tulum')" },
      topic: { type: "string", description: "Post angle (e.g., 'hidden gems', 'luxury hotels', 'nightlife', 'weekend guide')" },
      focus_points: { type: "array", items: { type: "string" }, description: "Specific aspects to emphasize" },
      word_count: { type: "number", description: "Target word count (default 1500)", default: 1500 },
    },
    required: ["destination"],
  },
}

// generate_destination_description
{
  name: "generate_destination_description",
  description: "Generate a 150-300 word destination description for post excerpts or cards. Requires ANTHROPIC_API_KEY.",
  inputSchema: {
    type: "object",
    properties: {
      destination: { type: "string", description: "Destination name" },
      context: { type: "string", description: "Context (e.g., 'weekend getaway', 'honeymoon', 'solo travel')" },
    },
    required: ["destination"],
  },
}

// generate_destination_image (Gemini)
{
  name: "generate_destination_image",
  description: "Generate cinematic destination/scenery photography using Google Imagen AI (no people). Saves locally and optionally uploads to WordPress. Requires GEMINI_API_KEY.",
  inputSchema: {
    type: "object",
    properties: {
      destination: { type: "string", description: "Destination or scene to photograph" },
      preset: { type: "string", description: "Scene preset (use list_destination_presets to see options)" },
      scene_description: { type: "string", description: "Custom scene description (combined with preset if both provided)" },
      filename: { type: "string", description: "Output filename without extension" },
      lighting: { type: "string", description: "Lighting style (default: from preset or 'golden hour')" },
      mood: { type: "string", description: "Image mood (default: 'cinematic, warm, editorial')" },
      time_of_day: { type: "string", description: "Time of day (e.g., 'sunset', 'blue hour', 'midday')" },
      upload_to_wordpress: { type: "boolean", description: "Upload to WordPress media library (default: true)", default: true },
      post_id: { type: "number", description: "Optional: Post ID to set as featured image" },
    },
    required: ["filename"],
  },
}

// list_destination_presets
{
  name: "list_destination_presets",
  description: "List all available destination scene presets for image generation. Use with generate_destination_image.",
  inputSchema: { type: "object", properties: {} },
}
```

The handlers follow the same patterns as existing code:
- `generate_travel_post` calls `generateContent(PROMPTS.TRAVEL_POST_PROMPT, ...)`
- `generate_destination_description` calls `generateContent(PROMPTS.DESTINATION_DESCRIPTION_PROMPT, ...)`
- `generate_destination_image` calls `buildDestinationPrompt()` then `generateAndSaveImage()`
- `generate_seo_content` uses updated `PROMPTS.SEO_CONTENT_PROMPT` with travel inputs
- `generate_image_prompt` uses updated `PROMPTS.IMAGE_PROMPT_TEMPLATE` with destination inputs

**Step 2: Commit**

```bash
git add wp-mcp-server/tools/ai-tools.js
git commit -m "feat: replace recipe AI tools with travel/lifestyle tools"
```

---

### Task 6: Update index.js dispatch for new tools

**Files:**
- Modify: `wp-mcp-server/index.js`

**Step 1: Add destination prefix dispatch**

In the `CallToolRequestSchema` handler, update the AI tools block to also catch `list_destination_presets`:

```js
    // Try AI tools
    if (name.startsWith("generate_") || name === "list_kaira_presets" || name === "list_destination_presets") {
      const result = await handleAITool(name, args);
      if (result) return result;
    }
```

**Step 2: Update tool availability annotations**

In the `ListToolsRequestSchema` handler, replace the `generate_recipe_image` check with `generate_destination_image`:

```js
    if (tool.name === "generate_destination_image") {
      if (!isGeminiAvailable()) {
        return {
          ...tool,
          description: tool.description + " [NOTE: GEMINI_API_KEY not set - image generation unavailable]",
        };
      }
      return tool;
    }
```

**Step 3: Commit**

```bash
git add wp-mcp-server/index.js
git commit -m "feat: update index.js dispatch for travel tools"
```

---

### Task 7: Update CLAUDE.md and local notes

**Files:**
- Modify: `CLAUDE.md`
- Modify: `.claude.local.md`

**Step 1: Update CLAUDE.md**

- Change MCP server description from recipe/food references to travel/lifestyle
- Update tool dispatch comment to reflect new prefixes
- Remove recipe-related notes
- Update the tool list in the MCP Server section

**Step 2: Update .claude.local.md**

- Update "Current State" section to reflect completed rebrand
- Update "Next" steps
- Remove recipe-related API config notes

**Step 3: Commit**

```bash
git add CLAUDE.md .claude.local.md
git commit -m "docs: update project docs for travel/lifestyle rebrand"
```

---

### Task 8: Verify MCP server starts

**Step 1: Check for syntax errors**

```bash
cd wp-mcp-server && node --check index.js
```

Expected: No output (clean parse)

**Step 2: Verify no broken imports**

```bash
cd wp-mcp-server && node -e "import('./index.js').catch(e => { console.error(e.message); process.exit(1); })"
```

Note: This will fail at MCP transport setup (no stdin), but should NOT fail on import errors. If it shows "WP_SITE_URL is required", that's the config validation — the imports worked.

**Step 3: Note for user**

After implementation, restart Claude Code to reload the MCP server. Then test:
- `list_kaira_presets` — should work (unchanged)
- `list_destination_presets` — should show 8 destination presets
- `generate_destination_image` with a preset — should generate scenery via Gemini
- `generate_kaira_image` with a preset — should still work (unchanged)
