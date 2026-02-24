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
