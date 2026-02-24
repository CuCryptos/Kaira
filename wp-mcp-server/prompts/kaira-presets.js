/**
 * Kaira Identity Prompt & Scene Presets
 *
 * Base identity prompt is injected into every generation.
 * Presets add scene-specific modifiers.
 * Trigger token is replaced at runtime from KAIRA_TRIGGER_TOKEN env var.
 */

/**
 * Base identity prompt — injected into every Kaira image generation.
 * The {trigger} placeholder is replaced with the configured trigger token.
 */
export const KAIRA_BASE_PROMPT =
  "A photorealistic portrait of {trigger}, a woman in her mid-to-late twenties " +
  "with an ethnically ambiguous appearance — she could be Mediterranean, Latin, " +
  "Middle Eastern, or mixed. Dark hair, warm skin tone, striking features. " +
  "She is always alone in the frame. The style is candid editorial photography — " +
  "she looks caught in a moment, not posing. Dark and warm color grading, rich " +
  "shadows, warm highlights, slightly desaturated. The image should feel like a " +
  "film still, not social media content.";

/**
 * Negative prompt — applied to all generations.
 */
export const KAIRA_NEGATIVE_PROMPT =
  "cartoon, anime, illustration, painting, watercolor, sketch, deformed, " +
  "disfigured, blurry, low quality, text, watermark, logo, multiple people, " +
  "group photo, bright saturated Instagram filter";

/**
 * Scene presets — each adds modifiers to the base prompt.
 */
export const KAIRA_PRESETS = {
  mykonos_pool: {
    description: "Infinity pool overlooking the Aegean, white Cycladic architecture, golden hour",
    scene: "Infinity pool overlooking the Aegean Sea, white Cycladic architecture in the background, golden hour light, wearing a swimsuit or flowing dress",
  },
  paris_night: {
    description: "Parisian street at night, elegant evening outfit",
    scene: "Parisian street at night, warm streetlamp glow, elegant evening outfit, café or bridge in background",
  },
  paris_cafe: {
    description: "Seated at a Parisian café terrace, daytime chic casual",
    scene: "Seated at a Parisian café terrace, espresso or wine on table, daytime, wearing chic casual",
  },
  bali_sunset: {
    description: "Tropical sunset with jungle or rice terraces",
    scene: "Tropical sunset, lush jungle or rice terraces, flowing fabric, warm golden light",
  },
  dubai_skyline: {
    description: "Modern cityscape at dusk, sleek fashion",
    scene: "Modern cityscape at dusk, luxurious setting, sleek fashion, city lights beginning to glow",
  },
  tulum_beach: {
    description: "Caribbean beach at dawn, bohemian luxury",
    scene: "Caribbean beach at dawn, soft morning light, bohemian luxury style, ruins or palm trees",
  },
  amalfi_coast: {
    description: "Colorful Italian coastal village, Mediterranean light",
    scene: "Colorful Italian coastal village, Mediterranean light, sun hat and summer dress, lemon groves or terraces",
  },
  gym_fitness: {
    description: "High-end gym, athletic wear, dynamic pose",
    scene: "High-end gym or studio, athletic wear, dynamic mid-movement pose, dramatic lighting",
  },
  high_fashion: {
    description: "Studio or urban editorial, magazine-quality",
    scene: "Studio or urban editorial setting, high-fashion outfit, strong directional lighting, magazine-quality composition",
  },
  hotel_luxury: {
    description: "Luxury hotel interior, elegant attire",
    scene: "Luxury hotel interior — lobby, suite, or terrace — elegant attire, warm ambient lighting",
  },
  restaurant: {
    description: "Upscale restaurant or bar, evening candid feel",
    scene: "Upscale restaurant or bar setting, evening lighting, cocktail or wine, candid mid-conversation feel",
  },
  winter: {
    description: "Cold-weather destination, cozy luxury winter outfit",
    scene: "Cold-weather destination, cozy luxury winter outfit, snow or misty mountains, warm vs cold contrast",
  },
};

/**
 * Build a complete Kaira image prompt from preset and/or custom description.
 * @param {string} triggerToken - The LoRA trigger word
 * @param {string|null} presetKey - Preset name (optional)
 * @param {string|null} sceneDescription - Custom scene description (optional)
 * @returns {string} Assembled prompt
 */
export function buildKairaPrompt(triggerToken, presetKey, sceneDescription) {
  const baseParts = [KAIRA_BASE_PROMPT.replace("{trigger}", triggerToken)];

  if (presetKey && KAIRA_PRESETS[presetKey]) {
    baseParts.push(KAIRA_PRESETS[presetKey].scene);
  }

  if (sceneDescription) {
    baseParts.push(sceneDescription);
  }

  return baseParts.join(". ");
}

/**
 * Get list of available presets with descriptions.
 * @returns {Array<{name: string, description: string}>}
 */
export function listPresets() {
  return Object.entries(KAIRA_PRESETS).map(([name, preset]) => ({
    name,
    description: preset.description,
  }));
}
