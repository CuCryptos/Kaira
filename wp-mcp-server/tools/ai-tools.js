/**
 * AI Content Generation Tools for MCP Server
 * Travel & Lifestyle focused — generates blog posts, descriptions, SEO, and images.
 */

import { generateContent, generateJSON, isAIAvailable } from "../lib/ai-client.js";
import { generateAndSaveImage, isGeminiAvailable } from "../lib/gemini-client.js";
import { uploadMedia, wpRequestSimple } from "../lib/wp-client.js";
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
import {
  buildDestinationPrompt,
  listDestinationPresets,
  DESTINATION_PRESETS,
} from "../prompts/destination-presets.js";
import { REPLICATE_CONFIG } from "../lib/config.js";

// Load prompts (supports custom prompts via CUSTOM_PROMPTS_PATH env var)
const PROMPTS = await getPrompts();

/**
 * Tool definitions for AI generation operations
 */
export const aiToolDefinitions = [
  {
    name: "generate_travel_post",
    description:
      "Generate a full travel blog post with Kaira's voice — first-person luxury travel narrative with sensory detail. Requires ANTHROPIC_API_KEY.",
    inputSchema: {
      type: "object",
      properties: {
        destination: {
          type: "string",
          description: "Destination name (e.g., 'Santorini', 'Tokyo', 'Tulum')",
        },
        topic: {
          type: "string",
          description: "Post angle (e.g., 'hidden gems', 'luxury hotels', 'nightlife', 'weekend guide')",
        },
        focus_points: {
          type: "array",
          items: { type: "string" },
          description: "Specific aspects to emphasize",
        },
        word_count: {
          type: "number",
          description: "Target word count (default 1500)",
          default: 1500,
        },
      },
      required: ["destination"],
    },
  },
  {
    name: "generate_destination_description",
    description:
      "Generate a 150-300 word destination description for post excerpts or cards. Requires ANTHROPIC_API_KEY.",
    inputSchema: {
      type: "object",
      properties: {
        destination: {
          type: "string",
          description: "Destination name",
        },
        context: {
          type: "string",
          description: "Context (e.g., 'weekend getaway', 'honeymoon', 'solo travel')",
        },
      },
      required: ["destination"],
    },
  },
  {
    name: "generate_seo_content",
    description:
      "Generate SEO-optimized metadata for a travel blog post including meta title, description, excerpt, and keywords. Requires ANTHROPIC_API_KEY.",
    inputSchema: {
      type: "object",
      properties: {
        post_title: {
          type: "string",
          description: "Blog post title",
        },
        post_description: {
          type: "string",
          description: "Brief description of the post",
        },
        destination: {
          type: "string",
          description: "Destination featured in the post",
        },
        category: {
          type: "string",
          description: "Post category (e.g., 'Destinations', 'Travel Tips', 'Luxury Hotels')",
        },
      },
      required: ["post_title"],
    },
  },
  {
    name: "generate_image_prompt",
    description:
      "Generate a detailed prompt for AI image generation to create cinematic destination photography (no people). Requires ANTHROPIC_API_KEY.",
    inputSchema: {
      type: "object",
      properties: {
        destination: {
          type: "string",
          description: "Destination or scene to describe",
        },
        scene_description: {
          type: "string",
          description: "Brief description of the desired scene",
        },
        mood: {
          type: "string",
          description: "Desired mood (e.g., 'romantic', 'dramatic', 'serene')",
        },
        time_of_day: {
          type: "string",
          description: "Time of day (e.g., 'golden hour', 'blue hour', 'midnight')",
        },
      },
      required: ["destination"],
    },
  },
  {
    name: "generate_destination_image",
    description:
      "Generate cinematic destination/scenery photography using Google Imagen AI (no people). " +
      "Saves locally and optionally uploads to WordPress. Requires GEMINI_API_KEY.",
    inputSchema: {
      type: "object",
      properties: {
        destination: {
          type: "string",
          description: "Destination or scene to photograph",
        },
        preset: {
          type: "string",
          description: "Scene preset (use list_destination_presets to see options)",
        },
        scene_description: {
          type: "string",
          description: "Custom scene description (combined with preset if both provided)",
        },
        filename: {
          type: "string",
          description: "Output filename without extension",
        },
        lighting: {
          type: "string",
          description: "Lighting style (default: from preset or 'golden hour')",
        },
        mood: {
          type: "string",
          description: "Image mood (default: 'cinematic, warm, editorial')",
        },
        time_of_day: {
          type: "string",
          description: "Time of day (e.g., 'sunset', 'blue hour', 'midday')",
        },
        upload_to_wordpress: {
          type: "boolean",
          description: "Upload to WordPress media library (default: true)",
          default: true,
        },
        post_id: {
          type: "number",
          description: "Optional: Post ID to set as featured image",
        },
      },
      required: ["filename"],
    },
  },
  {
    name: "list_destination_presets",
    description:
      "List all available destination scene presets for image generation. " +
      "Use with generate_destination_image.",
    inputSchema: {
      type: "object",
      properties: {},
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
    case "generate_travel_post": {
      requireAI();

      let userPrompt = `Generate a full travel blog post about: ${args.destination}`;

      if (args.topic) {
        userPrompt += `\n\nPost angle/topic: ${args.topic}`;
      }

      if (args.focus_points && args.focus_points.length > 0) {
        userPrompt += `\n\nPlease emphasize these aspects:\n- ${args.focus_points.join("\n- ")}`;
      }

      userPrompt += `\n\nTarget length: approximately ${args.word_count || 1500} words.`;

      const content = await generateContent(PROMPTS.TRAVEL_POST_PROMPT, userPrompt, {
        maxTokens: 8192,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                destination: args.destination,
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

    case "generate_destination_description": {
      requireAI();

      let userPrompt = `Generate a destination description for: ${args.destination}`;
      if (args.context) {
        userPrompt += `\n\nContext: ${args.context}`;
      }

      const description = await generateContent(PROMPTS.DESTINATION_DESCRIPTION_PROMPT, userPrompt);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                destination: args.destination,
                description: description.trim(),
                word_count: description.split(/\s+/).length,
                note: "Use for post excerpt or destination card description.",
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

      let userPrompt = `Generate SEO content for: ${args.post_title}`;
      if (args.post_description) {
        userPrompt += `\n\nDescription: ${args.post_description}`;
      }
      if (args.destination) {
        userPrompt += `\n\nDestination: ${args.destination}`;
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
                post_title: args.post_title,
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

      let userPrompt = `Generate an image prompt for cinematic destination photography of: ${args.destination}`;
      if (args.scene_description) {
        userPrompt += `\n\nScene description: ${args.scene_description}`;
      }
      if (args.mood) {
        userPrompt += `\n\nDesired mood: ${args.mood}`;
      }
      if (args.time_of_day) {
        userPrompt += `\n\nTime of day: ${args.time_of_day}`;
      }

      const imageData = await generateJSON(PROMPTS.IMAGE_PROMPT_TEMPLATE, userPrompt);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                destination: args.destination,
                image_prompt: imageData,
                note: "Use the 'prompt' field with generate_destination_image or other image generation tools.",
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "generate_destination_image": {
      requireGemini();

      // Validate preset if provided
      if (args.preset && !DESTINATION_PRESETS[args.preset]) {
        const validPresets = Object.keys(DESTINATION_PRESETS).join(", ");
        throw new Error(
          `Unknown preset '${args.preset}'. Valid presets: ${validPresets}`
        );
      }

      // Build the scene description — use destination as fallback if no preset or scene_description
      let sceneDescription = args.scene_description || null;
      if (args.destination && !args.preset && !sceneDescription) {
        sceneDescription = args.destination;
      }

      const prompt = buildDestinationPrompt(
        args.preset || null,
        sceneDescription,
        {
          lighting: args.lighting,
          mood: args.mood,
          timeOfDay: args.time_of_day,
        }
      );

      const imagePath = await generateAndSaveImage(prompt, args.filename);

      const result = {
        destination: args.destination || null,
        preset: args.preset || null,
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

    case "list_destination_presets": {
      const presets = listDestinationPresets();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                presets,
                usage: "Use a preset name with generate_destination_image's 'preset' parameter.",
                note: "You can also provide a custom 'scene_description' with or without a preset.",
              },
              null,
              2
            ),
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
