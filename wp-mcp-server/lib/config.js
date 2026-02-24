/**
 * Configuration for WordPress MCP Server
 *
 * All configuration is driven by environment variables.
 * No hardcoded credentials or site-specific values.
 */

// WordPress configuration (REQUIRED)
export const WP_CONFIG = {
  siteUrl: (process.env.WP_SITE_URL || "").replace(/\/$/, ""), // strip trailing slash
  username: process.env.WP_USERNAME || "",
  appPassword: process.env.WP_APP_PASSWORD || "",
};

// Server identity
export const SERVER_CONFIG = {
  name: process.env.MCP_SERVER_NAME || "wp-mcp-server",
  version: process.env.MCP_SERVER_VERSION || "1.0.0",
};

// Anthropic API configuration (OPTIONAL - enables AI content generation)
export const AI_CONFIG = {
  apiKey: process.env.ANTHROPIC_API_KEY || "",
  model: process.env.AI_MODEL || "claude-sonnet-4-20250514",
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || "4096", 10),
};

// Gemini API configuration (OPTIONAL - enables AI image generation)
export const GEMINI_CONFIG = {
  apiKey: process.env.GEMINI_API_KEY || "",
  imageModel: process.env.IMAGE_MODEL || "imagen-4.0-generate-001",
  aspectRatio: process.env.IMAGE_ASPECT_RATIO || "16:9",
};

// Replicate API configuration (OPTIONAL - enables Kaira image generation)
export const REPLICATE_CONFIG = {
  apiToken: process.env.REPLICATE_API_TOKEN || "",
  modelVersion: process.env.KAIRA_MODEL_VERSION || "",
  triggerToken: process.env.KAIRA_TRIGGER_TOKEN || "KAIRA",
};

// Recipe system configuration (OPTIONAL)
export const RECIPE_CONFIG = {
  postType: process.env.RECIPE_POST_TYPE || "",
  metaPrefix: process.env.RECIPE_META_PREFIX || "_cjc_recipe_",
};

// Create WordPress auth header
export const getAuthHeader = () => {
  return (
    "Basic " +
    Buffer.from(`${WP_CONFIG.username}:${WP_CONFIG.appPassword}`).toString(
      "base64"
    )
  );
};

// Validate configuration
export const validateConfig = () => {
  const errors = [];

  if (!WP_CONFIG.siteUrl) {
    errors.push("WP_SITE_URL is required (e.g., https://your-site.com)");
  }
  if (!WP_CONFIG.username) {
    errors.push("WP_USERNAME is required");
  }
  if (!WP_CONFIG.appPassword) {
    errors.push(
      "WP_APP_PASSWORD is required (create one at /wp-admin/profile.php)"
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    aiConfigured: !!AI_CONFIG.apiKey,
    geminiConfigured: !!GEMINI_CONFIG.apiKey,
    replicateConfigured: !!REPLICATE_CONFIG.apiToken && !!REPLICATE_CONFIG.modelVersion,
  };
};
