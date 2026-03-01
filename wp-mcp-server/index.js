#!/usr/bin/env node

/**
 * WordPress MCP Server
 *
 * Provides tools for WordPress content management and optional AI-powered content generation.
 *
 * Tools available:
 * - WordPress: wp_list_posts, wp_get_post, wp_create_post, wp_update_post, wp_delete_post,
 *              wp_list_categories, wp_create_category, wp_list_tags, wp_create_tag,
 *              wp_list_media, wp_upload_media, wp_set_featured_image, wp_get_site_info,
 *              wp_list_pages, wp_get_page, wp_create_page, wp_update_page, wp_delete_page,
 *              wp_get_block_patterns, wp_get_post_as_template
 * - AI Gen:    generate_travel_post, generate_destination_description,
 *              generate_seo_content, generate_image_prompt, generate_destination_image
 * - Kaira:     generate_kaira_image, list_kaira_presets, list_destination_presets
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Import tool definitions and handlers
import { wpToolDefinitions, handleWPTool } from "./tools/wp-tools.js";
import { aiToolDefinitions, handleAITool } from "./tools/ai-tools.js";

// Import configuration
import { validateConfig, SERVER_CONFIG } from "./lib/config.js";
import { isAIAvailable } from "./lib/ai-client.js";
import { isGeminiAvailable } from "./lib/gemini-client.js";
import { isReplicateAvailable } from "./lib/replicate-client.js";

// Validate configuration on startup
const configStatus = validateConfig();
if (!configStatus.valid) {
  console.error("Configuration errors:", configStatus.errors.join(", "));
  console.error("See .env.example for required environment variables.");
  process.exit(1);
}

// Create MCP server
const server = new Server(
  {
    name: SERVER_CONFIG.name,
    version: SERVER_CONFIG.version,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Combine all tool definitions
const allTools = [
  ...wpToolDefinitions,
  ...aiToolDefinitions,
];

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  // Add availability notes to AI tool descriptions if not configured
  const tools = allTools.map((tool) => {
    // Gemini-specific tool
    if (tool.name === "generate_destination_image") {
      if (!isGeminiAvailable()) {
        return {
          ...tool,
          description:
            tool.description +
            " [NOTE: GEMINI_API_KEY not set - image generation unavailable]",
        };
      }
      return tool;
    }
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
    // Anthropic-specific tools
    if (tool.name.startsWith("generate_") && !isAIAvailable()) {
      return {
        ...tool,
        description:
          tool.description +
          " [NOTE: ANTHROPIC_API_KEY not set - AI features unavailable]",
      };
    }
    return tool;
  });

  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Try WordPress tools
    if (name.startsWith("wp_")) {
      const result = await handleWPTool(name, args);
      if (result) return result;
    }

    // Try AI tools
    if (name.startsWith("generate_") || name === "list_kaira_presets" || name === "list_destination_presets") {
      const result = await handleAITool(name, args);
      if (result) return result;
    }

    // Unknown tool
    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log startup info to stderr (won't interfere with MCP protocol)
  console.error(`${SERVER_CONFIG.name} v${SERVER_CONFIG.version} running`);
  console.error(`WordPress tools: ${wpToolDefinitions.length}`);
  console.error(`AI/content tools: ${aiToolDefinitions.length}`);
  console.error(
    `  - Anthropic: ${isAIAvailable() ? "enabled" : "ANTHROPIC_API_KEY not set"}`
  );
  console.error(
    `  - Gemini Imagen: ${isGeminiAvailable() ? "enabled" : "GEMINI_API_KEY not set"}`
  );
  console.error(
    `  - Replicate Kaira: ${isReplicateAvailable() ? "enabled" : "REPLICATE_API_TOKEN/KAIRA_MODEL_VERSION not set"}`
  );
}

main().catch(console.error);
