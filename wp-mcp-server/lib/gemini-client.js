/**
 * Gemini API Client for Image Generation (Imagen)
 */

import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { GEMINI_CONFIG } from "./config.js";

let client = null;

/**
 * Get or create Gemini client instance
 * @returns {GoogleGenAI} Gemini client
 */
export function getGeminiClient() {
  if (!client && GEMINI_CONFIG.apiKey) {
    client = new GoogleGenAI({ apiKey: GEMINI_CONFIG.apiKey });
  }
  return client;
}

/**
 * Check if Gemini/Imagen is available
 * @returns {boolean} True if Gemini API key is configured
 */
export function isGeminiAvailable() {
  return !!GEMINI_CONFIG.apiKey;
}

/**
 * Generate an image using Gemini Imagen
 * @param {string} prompt - Image generation prompt
 * @param {object} options - Generation options
 * @returns {Promise<Buffer>} Generated image as buffer
 */
export async function generateImage(prompt, options = {}) {
  const gemini = getGeminiClient();
  if (!gemini) {
    throw new Error("Gemini API key not configured");
  }

  const response = await gemini.models.generateImages({
    model: options.model || GEMINI_CONFIG.imageModel,
    prompt: prompt,
    config: {
      numberOfImages: options.numberOfImages || 1,
      aspectRatio: options.aspectRatio || GEMINI_CONFIG.aspectRatio,
      safetyFilterLevel: options.safetyFilterLevel || "BLOCK_LOW_AND_ABOVE",
      personGeneration: options.personGeneration || "DONT_ALLOW",
    },
  });

  if (!response.generatedImages || response.generatedImages.length === 0) {
    throw new Error("No images generated");
  }

  // Return the first image as a buffer
  const imageData = response.generatedImages[0].image.imageBytes;
  return Buffer.from(imageData, "base64");
}

/**
 * Generate and save an image locally
 * @param {string} prompt - Image generation prompt
 * @param {string} filename - Output filename (without extension)
 * @param {object} options - Generation options
 * @returns {Promise<string>} Path to saved image
 */
export async function generateAndSaveImage(prompt, filename, options = {}) {
  const imageBuffer = await generateImage(prompt, options);

  // Save to a generated-images directory relative to the server
  const outputDir =
    process.env.IMAGE_OUTPUT_DIR ||
    path.resolve(path.dirname(new URL(import.meta.url).pathname), "../output/generated-images");

  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Save the image
  const outputPath = path.join(outputDir, `${filename}.png`);
  fs.writeFileSync(outputPath, imageBuffer);

  return outputPath;
}

/**
 * Build a food photography prompt
 * @param {string} dishName - Name of the dish
 * @param {object} options - Prompt options
 * @returns {string} Formatted prompt for Imagen
 */
export function buildFoodPhotoPrompt(dishName, options = {}) {
  const style = options.style || "professional food photography";
  const lighting = options.lighting || "natural window light";
  const angle = options.angle || "45-degree angle";
  const background = options.background || "rustic wooden table";
  const mood = options.mood || "warm, inviting, appetizing";

  let prompt = `${style} of ${dishName}. `;
  prompt += `Shot from ${angle} with ${lighting}. `;
  prompt += `${background}. `;
  prompt += `Mood: ${mood}. `;
  prompt += `High resolution, sharp focus on the food, shallow depth of field, `;
  prompt += `vibrant colors, steam rising if hot dish, garnished beautifully. `;
  prompt += `Editorial quality, suitable for food blog or cookbook.`;

  if (options.additionalDetails) {
    prompt += ` ${options.additionalDetails}`;
  }

  return prompt;
}
