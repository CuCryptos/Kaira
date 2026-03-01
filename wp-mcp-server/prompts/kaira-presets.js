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
/**
 * Split base prompt into identity (who) and style (how it looks).
 * Scene/action is inserted BETWEEN these in buildKairaPrompt so that
 * pose and gesture prompts get higher attention weight.
 */
export const KAIRA_IDENTITY_PROMPT =
  "A candid photograph of {trigger}, a woman in her mid-to-late twenties " +
  "with an ethnically ambiguous appearance — she could be Mediterranean, Latin, " +
  "Middle Eastern, or mixed. Dark hair, warm skin tone, striking features. " +
  "She is always alone in the frame.";

export const KAIRA_STYLE_PROMPT =
  "Shot on Canon EOS R5 with 85mm f/1.4 lens, natural depth of field. " +
  "Visible skin texture and natural pores, subtle under-eye shadows, " +
  "flyaway hair strands caught by wind. Real fabric weight and natural wrinkles in clothing. " +
  "The style is candid editorial photography — caught mid-moment, not posing for camera. " +
  "Dark and warm color grading, rich shadows, warm highlights, slightly desaturated. " +
  "Slight film grain, subtle sensor noise. " +
  "The image should feel like an unretouched frame from a 35mm film scan, " +
  "not social media content.";

/**
 * Negative prompt — applied to all generations.
 */
export const KAIRA_NEGATIVE_PROMPT =
  "cartoon, anime, illustration, painting, watercolor, sketch, deformed, " +
  "disfigured, blurry, low quality, text, watermark, logo, multiple people, " +
  "group photo, bright saturated Instagram filter, " +
  "airbrushed skin, smooth skin, plastic skin, poreless skin, beauty filter, " +
  "over-processed, HDR, mannequin, wax figure, CGI, 3D render, " +
  "perfect symmetry, overly sharp, hyper-detailed, studio backdrop";

/**
 * Scene presets — each adds modifiers to the base prompt.
 */
export const KAIRA_PRESETS = {
  mykonos_pool: {
    description: "Infinity pool overlooking the Aegean, white Cycladic architecture, golden hour",
    scene: "Infinity pool overlooking the Aegean Sea, white Cycladic architecture in the background, golden hour light, wearing a swimsuit or flowing dress, leaning on poolside railing, sunlight catching water droplets on skin",
  },
  paris_night: {
    description: "Parisian street at night, elegant evening outfit",
    scene: "Parisian street at night, warm streetlamp glow, elegant evening outfit, café or bridge in background, mid-stride crossing street, streetlamp casting long shadow behind her",
  },
  paris_cafe: {
    description: "Seated at a Parisian café terrace, daytime chic casual",
    scene: "Seated at a Parisian café terrace, espresso or wine on table, daytime, wearing chic casual, glancing sideways at something off-camera, one hand around espresso cup",
  },
  bali_sunset: {
    description: "Tropical sunset with jungle or rice terraces",
    scene: "Tropical sunset, lush jungle or rice terraces, flowing fabric, warm golden light, walking barefoot on a stone path, hand brushing tall grass",
  },
  dubai_skyline: {
    description: "Modern cityscape at dusk, sleek fashion",
    scene: "Modern cityscape at dusk, luxurious setting, sleek fashion, city lights beginning to glow, standing at a balcony railing, wind pulling at her clothes and hair",
  },
  tulum_beach: {
    description: "Caribbean beach at dawn, bohemian luxury",
    scene: "Caribbean beach at dawn, soft morning light, bohemian luxury style, ruins or palm trees, walking along waterline, wet sand underfoot, hair blown across face",
  },
  amalfi_coast: {
    description: "Colorful Italian coastal village, Mediterranean light",
    scene: "Colorful Italian coastal village, Mediterranean light, sun hat and summer dress, lemon groves or terraces, paused on stone steps, adjusting sun hat with one hand",
  },
  gym_fitness: {
    description: "High-end gym, athletic wear, dynamic pose",
    scene: "High-end gym or studio, athletic wear, dynamic mid-movement pose, dramatic lighting, mid-rep with visible exertion, slight perspiration, focused expression",
  },
  high_fashion: {
    description: "Studio or urban editorial, magazine-quality",
    scene: "Studio or urban editorial setting, high-fashion outfit, strong directional lighting, magazine-quality composition, turning to look over her shoulder, coat caught mid-swing",
  },
  hotel_luxury: {
    description: "Luxury hotel interior, elegant attire",
    scene: "Luxury hotel interior — lobby, suite, or terrace — elegant attire, warm ambient lighting, seated on chair arm, one shoe half-off, relaxed unguarded moment",
  },
  restaurant: {
    description: "Upscale restaurant or bar, evening candid feel",
    scene: "Upscale restaurant or bar setting, evening lighting, cocktail or wine, candid mid-conversation feel, leaning forward mid-laugh, candlelight reflected in her eyes",
  },
  winter: {
    description: "Cold-weather destination, cozy luxury winter outfit",
    scene: "Cold-weather destination, cozy luxury winter outfit, snow or misty mountains, warm vs cold contrast, hands wrapped around a warm mug, breath visible in cold air",
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
  // Order: identity → scene/action → style
  // Scene comes right after identity so pose/gesture gets high attention weight
  const parts = [KAIRA_IDENTITY_PROMPT.replace("{trigger}", triggerToken)];

  if (presetKey && KAIRA_PRESETS[presetKey]) {
    parts.push(KAIRA_PRESETS[presetKey].scene);
  }

  if (sceneDescription) {
    parts.push(sceneDescription);
  }

  parts.push(KAIRA_STYLE_PROMPT);

  return parts.join(". ");
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
