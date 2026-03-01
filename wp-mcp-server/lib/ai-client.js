/**
 * Claude AI Client Wrapper
 */

import Anthropic from "@anthropic-ai/sdk";
import { AI_CONFIG } from "./config.js";

let client = null;

/**
 * Get or create the Anthropic client
 * @returns {Anthropic} Anthropic client instance
 */
export function getClient() {
  if (!client) {
    if (!AI_CONFIG.apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY environment variable is required for AI features. " +
          "Set it with: export ANTHROPIC_API_KEY=your_key"
      );
    }
    client = new Anthropic({ apiKey: AI_CONFIG.apiKey });
  }
  return client;
}

/**
 * Check if AI features are available
 * @returns {boolean} True if API key is configured
 */
export function isAIAvailable() {
  return !!AI_CONFIG.apiKey;
}

/**
 * Generate content using Claude
 * @param {string} systemPrompt - System prompt for the conversation
 * @param {string} userPrompt - User message/prompt
 * @param {object} options - Additional options
 * @returns {Promise<string>} Generated text
 */
export async function generateContent(systemPrompt, userPrompt, options = {}) {
  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model: options.model || AI_CONFIG.model,
    max_tokens: options.maxTokens || AI_CONFIG.maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  // Extract text from response
  const textContent = response.content.find((block) => block.type === "text");
  return textContent ? textContent.text : "";
}

/**
 * Generate JSON content using Claude
 * @param {string} systemPrompt - System prompt for the conversation
 * @param {string} userPrompt - User message/prompt
 * @param {object} options - Additional options
 * @returns {Promise<object>} Parsed JSON response
 */
export async function generateJSON(systemPrompt, userPrompt, options = {}) {
  const text = await generateContent(
    systemPrompt +
      "\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown code blocks, no explanations.",
    userPrompt,
    options
  );

  // Try to extract JSON from the response
  let jsonStr = text.trim();

  // Remove markdown code blocks if present
  if (jsonStr.startsWith("```json")) {
    jsonStr = jsonStr.slice(7);
  } else if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.slice(3);
  }
  if (jsonStr.endsWith("```")) {
    jsonStr = jsonStr.slice(0, -3);
  }
  jsonStr = jsonStr.trim();

  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    throw new Error(
      `Failed to parse AI response as JSON: ${error.message}\nResponse was: ${text.slice(0, 500)}`
    );
  }
}
