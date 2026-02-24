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

  if (negativePrompt) {
    input.negative_prompt = negativePrompt;
  }

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

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

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
  const prediction = await createPrediction(prompt, negativePrompt, options);

  const completed = await pollPrediction(prediction.id);

  const outputs = completed.output || [];
  const paths = [];

  for (let i = 0; i < outputs.length; i++) {
    const suffix = outputs.length > 1 ? `-${i + 1}` : "";
    const localPath = await downloadAndSaveImage(outputs[i], `${filename}${suffix}`);
    paths.push(localPath);
  }

  return { paths, prediction: completed };
}
