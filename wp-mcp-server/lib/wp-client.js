/**
 * WordPress REST API Client
 */

import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { WP_CONFIG, getAuthHeader } from "./config.js";

/**
 * Make a request to the WordPress REST API
 * @param {string} endpoint - API endpoint (without /wp-json/wp/v2 prefix)
 * @param {object} options - Fetch options
 * @param {string} apiBase - API base path (default: /wp-json/wp/v2)
 * @returns {Promise<object>} Response data
 */
export async function wpRequest(endpoint, options = {}, apiBase = "/wp-json/wp/v2") {
  const url = `${WP_CONFIG.siteUrl}${apiBase}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`WordPress API error (${response.status}): ${error}`);
  }

  // Return response with headers for pagination info
  const data = await response.json();
  return {
    data,
    headers: {
      total: response.headers.get("X-WP-Total"),
      totalPages: response.headers.get("X-WP-TotalPages"),
    },
  };
}

/**
 * Simplified request that returns just data (for backward compatibility)
 */
export async function wpRequestSimple(endpoint, options = {}, apiBase = "/wp-json/wp/v2") {
  const result = await wpRequest(endpoint, options, apiBase);
  return result.data;
}

/**
 * Make a request to a custom REST API namespace
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @param {string} namespace - API namespace (e.g., "cjc/v1")
 * @returns {Promise<object>} Response data
 */
export async function customRequest(endpoint, options = {}, namespace = "cjc/v1") {
  return wpRequest(endpoint, options, `/wp-json/${namespace}`);
}

/**
 * Upload a media file to WordPress
 * @param {string} filePath - Local file path
 * @param {string} filename - Optional filename override
 * @returns {Promise<object>} Media object from WordPress
 */
export async function uploadMedia(filePath, filename) {
  const url = `${WP_CONFIG.siteUrl}/wp-json/wp/v2/media`;
  const actualFilename = filename || path.basename(filePath);

  const fileBuffer = fs.readFileSync(filePath);
  const mimeType = getMimeType(actualFilename);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Disposition": `attachment; filename="${actualFilename}"`,
      "Content-Type": mimeType,
    },
    body: fileBuffer,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Media upload error (${response.status}): ${error}`);
  }

  return response.json();
}

/**
 * Get MIME type from filename
 * @param {string} filename - Filename with extension
 * @returns {string} MIME type
 */
function getMimeType(filename) {
  const ext = filename.toLowerCase().split(".").pop();
  const mimeTypes = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    pdf: "application/pdf",
    mp4: "video/mp4",
    webm: "video/webm",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

/**
 * Get site info from WordPress
 * @returns {Promise<object>} Site information
 */
export async function getSiteInfo() {
  const response = await fetch(`${WP_CONFIG.siteUrl}/wp-json`, {
    headers: { Authorization: getAuthHeader() },
  });
  return response.json();
}
