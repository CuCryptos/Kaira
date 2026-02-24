/**
 * AI Content Generation Tools for MCP Server
 */

import { generateContent, generateJSON, isAIAvailable } from "../lib/ai-client.js";
import {
  generateAndSaveImage,
  buildFoodPhotoPrompt,
  isGeminiAvailable,
} from "../lib/gemini-client.js";
import { uploadMedia } from "../lib/wp-client.js";
import { wpRequestSimple } from "../lib/wp-client.js";
import { getPrompts } from "../prompts/system-prompts.js";
import path from "path";
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

// Load prompts (supports custom prompts via CUSTOM_PROMPTS_PATH env var)
const PROMPTS = await getPrompts();

/**
 * Tool definitions for AI generation operations
 */
export const aiToolDefinitions = [
  {
    name: "generate_recipe_post",
    description:
      "Generate a full blog post for a recipe with cultural narrative, personal stories, and structured content. Requires ANTHROPIC_API_KEY environment variable.",
    inputSchema: {
      type: "object",
      properties: {
        recipe_name: {
          type: "string",
          description: "Name of the dish",
        },
        recipe_data: {
          type: "object",
          description: "Optional: existing recipe data (ingredients, instructions) to incorporate",
        },
        focus_points: {
          type: "array",
          items: { type: "string" },
          description: "Optional: specific aspects to emphasize (e.g., history, technique, family tradition)",
        },
        word_count: {
          type: "number",
          description: "Target word count for the post (default 1500)",
          default: 1500,
        },
      },
      required: ["recipe_name"],
    },
  },
  {
    name: "generate_recipe_description",
    description:
      "Generate a cultural story/description for a recipe card (150-300 words). Focuses on the cultural significance and sensory experience.",
    inputSchema: {
      type: "object",
      properties: {
        recipe_name: {
          type: "string",
          description: "Name of the dish",
        },
        ingredients_summary: {
          type: "string",
          description: "Brief summary of main ingredients",
        },
        context: {
          type: "string",
          description: "Optional: additional context (occasion, tradition, personal connection)",
        },
      },
      required: ["recipe_name"],
    },
  },
  {
    name: "generate_recipe_from_name",
    description:
      "Generate a complete recipe data structure from just a dish name. Returns structured JSON with ingredients, instructions, nutrition estimates, and cultural description.",
    inputSchema: {
      type: "object",
      properties: {
        dish_name: {
          type: "string",
          description: "Name of the dish",
        },
        servings: {
          type: "number",
          description: "Number of servings (default 6)",
          default: 6,
        },
        difficulty: {
          type: "string",
          enum: ["easy", "medium", "advanced"],
          description: "Recipe difficulty level",
          default: "medium",
        },
        notes: {
          type: "string",
          description: "Optional: specific requests or variations",
        },
      },
      required: ["dish_name"],
    },
  },
  {
    name: "generate_seo_content",
    description:
      "Generate SEO-optimized metadata for a recipe post including meta title, description, excerpt, and keywords.",
    inputSchema: {
      type: "object",
      properties: {
        recipe_name: {
          type: "string",
          description: "Name of the recipe",
        },
        recipe_description: {
          type: "string",
          description: "Brief description of the recipe",
        },
        main_ingredients: {
          type: "array",
          items: { type: "string" },
          description: "List of main ingredients",
        },
        category: {
          type: "string",
          description: "Recipe category (e.g., Main Dish, Appetizer)",
        },
      },
      required: ["recipe_name"],
    },
  },
  {
    name: "generate_image_prompt",
    description:
      "Generate a detailed prompt for AI image generation (Imagen/DALL-E) to create professional food photography.",
    inputSchema: {
      type: "object",
      properties: {
        dish_name: {
          type: "string",
          description: "Name of the dish",
        },
        dish_description: {
          type: "string",
          description: "Brief description of how the dish looks",
        },
        serving_style: {
          type: "string",
          description: "Optional: specific serving style (traditional, modern, family-style)",
        },
        mood: {
          type: "string",
          description: "Optional: mood/atmosphere (rustic, elegant, casual)",
        },
      },
      required: ["dish_name"],
    },
  },
  {
    name: "generate_recipe_image",
    description:
      "Generate a professional food photography image for a recipe using Google Imagen AI. Saves locally and optionally uploads to WordPress media library and sets as featured image. Requires GEMINI_API_KEY environment variable.",
    inputSchema: {
      type: "object",
      properties: {
        dish_name: {
          type: "string",
          description: "Name of the dish to photograph",
        },
        filename: {
          type: "string",
          description: "Output filename without extension (e.g., 'huli-huli-chicken')",
        },
        style: { type: "string", description: "Photography style (default: 'professional food photography')" },
        lighting: { type: "string", description: "Lighting style (default: 'natural window light')" },
        angle: { type: "string", description: "Camera angle (default: '45-degree angle')" },
        background: { type: "string", description: "Background description (default: 'rustic wooden table')" },
        mood: { type: "string", description: "Image mood (default: 'warm, inviting, appetizing')" },
        additional_details: { type: "string", description: "Any additional details for the prompt" },
        upload_to_wordpress: {
          type: "boolean",
          description: "Upload generated image to WordPress media library (default: true)",
          default: true,
        },
        post_id: {
          type: "number",
          description: "Optional: Post ID to set this image as featured image",
        },
      },
      required: ["dish_name", "filename"],
    },
  },
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
];

/**
 * Check if AI is available, throw helpful error if not
 */
function requireAI() {
  if (!isAIAvailable()) {
    throw new Error(
      "AI features require ANTHROPIC_API_KEY environment variable. " +
        "Set it with: export ANTHROPIC_API_KEY=your_key_here\n" +
        "Then restart Claude Code to reload the MCP server."
    );
  }
}

/**
 * Check if Gemini/Imagen is available, throw helpful error if not
 */
function requireGemini() {
  if (!isGeminiAvailable()) {
    throw new Error(
      "Image generation requires GEMINI_API_KEY environment variable. " +
        "Set it with: export GEMINI_API_KEY=your_key_here\n" +
        "Get a key from https://aistudio.google.com/apikey\n" +
        "Then restart Claude Code to reload the MCP server."
    );
  }
}

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

/**
 * Handle AI tool calls
 */
export async function handleAITool(name, args) {
  switch (name) {
    case "generate_recipe_post": {
      requireAI();

      let userPrompt = `Generate a full blog post for: ${args.recipe_name}`;

      if (args.recipe_data) {
        userPrompt += `\n\nExisting recipe data to incorporate:\n${JSON.stringify(args.recipe_data, null, 2)}`;
      }

      if (args.focus_points && args.focus_points.length > 0) {
        userPrompt += `\n\nPlease emphasize these aspects:\n- ${args.focus_points.join("\n- ")}`;
      }

      userPrompt += `\n\nTarget length: approximately ${args.word_count || 1500} words.`;

      const content = await generateContent(PROMPTS.RECIPE_POST_PROMPT, userPrompt, {
        maxTokens: 8192,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                recipe_name: args.recipe_name,
                generated_content: content,
                word_count: content.split(/\s+/).length,
                note: "Content is in HTML format. Use for wp_create_post content field.",
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "generate_recipe_description": {
      requireAI();

      let userPrompt = `Generate a recipe description for: ${args.recipe_name}`;
      if (args.ingredients_summary) {
        userPrompt += `\n\nMain ingredients: ${args.ingredients_summary}`;
      }
      if (args.context) {
        userPrompt += `\n\nAdditional context: ${args.context}`;
      }

      const description = await generateContent(PROMPTS.RECIPE_DESCRIPTION_PROMPT, userPrompt);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                recipe_name: args.recipe_name,
                description: description.trim(),
                word_count: description.split(/\s+/).length,
                note: "Use for recipe_create description field.",
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "generate_recipe_from_name": {
      requireAI();

      let userPrompt = `Generate a complete recipe for: ${args.dish_name}`;
      userPrompt += `\n\nServings: ${args.servings || 6}`;
      userPrompt += `\nDifficulty: ${args.difficulty || "medium"}`;

      if (args.notes) {
        userPrompt += `\n\nSpecial requests: ${args.notes}`;
      }

      const recipeData = await generateJSON(PROMPTS.RECIPE_FROM_NAME_PROMPT, userPrompt, {
        maxTokens: 8192,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                dish_name: args.dish_name,
                recipe: recipeData,
                note: "Use this data with recipe_create to create the recipe in WordPress.",
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "generate_seo_content": {
      requireAI();

      let userPrompt = `Generate SEO content for: ${args.recipe_name}`;
      if (args.recipe_description) {
        userPrompt += `\n\nDescription: ${args.recipe_description}`;
      }
      if (args.main_ingredients && args.main_ingredients.length > 0) {
        userPrompt += `\n\nMain ingredients: ${args.main_ingredients.join(", ")}`;
      }
      if (args.category) {
        userPrompt += `\n\nCategory: ${args.category}`;
      }

      const seoData = await generateJSON(PROMPTS.SEO_CONTENT_PROMPT, userPrompt);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                recipe_name: args.recipe_name,
                seo: seoData,
                note: "Use meta_title and meta_description for Yoast/Rank Math SEO plugin. Use excerpt for post excerpt.",
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "generate_image_prompt": {
      requireAI();

      let userPrompt = `Generate an image prompt for professional food photography of: ${args.dish_name}`;
      if (args.dish_description) {
        userPrompt += `\n\nDish description: ${args.dish_description}`;
      }
      if (args.serving_style) {
        userPrompt += `\n\nServing style: ${args.serving_style}`;
      }
      if (args.mood) {
        userPrompt += `\n\nDesired mood: ${args.mood}`;
      }

      const imageData = await generateJSON(PROMPTS.IMAGE_PROMPT_TEMPLATE, userPrompt);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                dish_name: args.dish_name,
                image_prompt: imageData,
                note: "Use the 'prompt' field with Imagen or DALL-E for image generation.",
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "generate_recipe_image": {
      requireGemini();

      const prompt = buildFoodPhotoPrompt(args.dish_name, {
        style: args.style,
        lighting: args.lighting,
        angle: args.angle,
        background: args.background,
        mood: args.mood,
        additionalDetails: args.additional_details,
      });

      const imagePath = await generateAndSaveImage(prompt, args.filename);

      const result = {
        dish_name: args.dish_name,
        prompt_used: prompt,
        local_path: imagePath,
        uploaded: false,
        media_id: null,
        featured_image_set: false,
      };

      const shouldUpload = args.upload_to_wordpress !== false;
      if (shouldUpload) {
        const mediaResult = await uploadMedia(imagePath, `${args.filename}.png`);
        result.uploaded = true;
        result.media_id = mediaResult.id;
        result.media_url = mediaResult.source_url;

        if (args.post_id) {
          await wpRequestSimple(`/posts/${args.post_id}`, {
            method: "POST",
            body: JSON.stringify({ featured_media: mediaResult.id }),
          });
          result.featured_image_set = true;
          result.post_id = args.post_id;
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

    case "generate_kaira_image": {
      requireReplicate();

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

      const prompt = buildKairaPrompt(
        REPLICATE_CONFIG.triggerToken,
        args.preset || null,
        args.scene_description || null
      );

      const { paths, prediction } = await generateKairaImage(
        prompt,
        KAIRA_NEGATIVE_PROMPT,
        args.filename,
        {
          aspectRatio: args.aspect_ratio || "3:4",
          numOutputs,
        }
      );

      const result = {
        preset: args.preset || null,
        scene_description: args.scene_description || null,
        prompt_used: prompt,
        prediction_id: prediction.id,
        local_paths: paths,
        images: [],
      };

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

    default:
      return null;
  }
}
