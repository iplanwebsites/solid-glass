import type { GlassOptions, TemplateName, TemplatePresetName, RenderTier } from "./types";
import type { LiquidGlassOptions } from "./engines/svg-refraction";

/** Base template definitions — minimal defaults that define each look */
export const templates: Record<TemplateName, GlassOptions> = {
  frosted: {
    blur: 12,
    tintColor: "#ffffff",
    tintOpacity: 0.08,
    shadowColor: "rgba(255, 255, 255, 0.6)",
    shadowBlur: 6,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderRadius: 16,
  },
  crystal: {
    blur: 8,
    tintColor: "#ffffff",
    tintOpacity: 0.05,
    distortion: 60,
    noiseFrequency: 0.008,
    noiseOctaves: 2,
    noiseSeed: 42,
    borderRadius: 20,
  },
  aurora: {
    blur: 16,
    colors: ["#a78bfa", "#818cf8", "#6ee7b7", "#fbbf24", "#f472b6"],
    colorOpacity: 0.15,
    gradientAngle: 135,
    animated: true,
    animationSpeed: 8,
    borderRadius: 20,
  },
  smoke: {
    blur: 20,
    tintColor: "#000000",
    tintOpacity: 0.3,
    turbulence: 0.015,
    distortion: 30,
    animated: true,
    animationSpeed: 12,
    borderRadius: 20,
  },
  prism: {
    blur: 6,
    hueRotate: 0,
    saturation: 1.2,
    brightness: 1.05,
    contrast: 1.1,
    borderRadius: 20,
  },
  holographic: {
    blur: 10,
    colors: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#9b59b6"],
    colorOpacity: 0.4,
    colorBlend: "overlay",
    animated: true,
    animationSpeed: 6,
    borderRadius: 20,
  },
  thin: {
    blur: 4,
    tintColor: "#ffffff",
    tintOpacity: 0.02,
    borderOpacity: 0.1,
    borderRadius: 12,
  },
  refraction: {
    blur: 2,
    surface: "convexSquircle",
    bezelWidth: 22,
    glassThickness: 130,
    refractiveIndex: 2.05,
    specularOpacity: 0.7,
    specularAngle: Math.PI / 3,
    saturation: 1.2,
    borderRadius: 54,
  },
};

/** Named preset variations — extend a base template with specific overrides */
export const templatePresets: Record<TemplatePresetName, { base: TemplateName; overrides: GlassOptions }> = {
  // Frosted
  frostedLight: { base: "frosted", overrides: { blur: 12, tintColor: "#ffffff", tintOpacity: 0.1 } },
  frostedDark: { base: "frosted", overrides: { blur: 14, tintColor: "#000000", tintOpacity: 0.2, shadowColor: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.08)", colorScheme: "dark" } },
  frostedBlue: { base: "frosted", overrides: { blur: 16, tintColor: "#3b82f6", tintOpacity: 0.12, borderRadius: 20 } },

  // Crystal
  crystalClear: { base: "crystal", overrides: { blur: 6, noiseFrequency: 0.006, distortion: 40 } },
  crystalAmber: { base: "crystal", overrides: { blur: 8, tintColor: "#f59e0b", tintOpacity: 0.08, noiseFrequency: 0.01, distortion: 70, borderRadius: 24 } },

  // Aurora
  auroraNorth: { base: "aurora", overrides: { colors: ["#a78bfa", "#818cf8", "#6ee7b7"], animationSpeed: 10 } },
  auroraSunset: { base: "aurora", overrides: { colors: ["#f97316", "#ef4444", "#ec4899", "#8b5cf6"], animationSpeed: 12 } },

  // Smoke
  smokeNoir: { base: "smoke", overrides: { blur: 24, tintOpacity: 0.4, tintColor: "#000000" } },
  smokeMist: { base: "smoke", overrides: { blur: 18, tintOpacity: 0.15, tintColor: "#ffffff", turbulence: 0.02 } },

  // Prism
  prismRainbow: { base: "prism", overrides: { blur: 8, hueRotate: 0, saturation: 1.4, brightness: 1.1 } },
  prismWarm: { base: "prism", overrides: { blur: 6, hueRotate: -20, saturation: 1.3, contrast: 1.15, borderRadius: 16 } },

  // Holographic
  holoCard: { base: "holographic", overrides: { blur: 8, colorOpacity: 0.5, animationSpeed: 4, borderRadius: 16 } },
  holoSubtle: { base: "holographic", overrides: { blur: 12, colorOpacity: 0.2, animationSpeed: 10 } },

  // Thin
  thinLight: { base: "thin", overrides: { tintColor: "#ffffff", tintOpacity: 0.03 } },
  thinDark: { base: "thin", overrides: { tintColor: "#000000", tintOpacity: 0.05, colorScheme: "dark" } },

  // Refraction
  refractionPanel: { base: "refraction", overrides: { width: 300, height: 200 } },
  refractionLoupe: { base: "refraction", overrides: { width: 200, height: 200, blur: 0, surface: "convexCircle", bezelWidth: 20, glassThickness: 200, refractiveIndex: 1.5, borderRadius: 100 } },
};

/** Rendering tier for each base template */
export const templateRenderTiers: Record<TemplateName, RenderTier> = {
  frosted: "css",
  crystal: "svg-filter",
  aurora: "css",
  smoke: "svg-filter",
  prism: "css",
  holographic: "css",
  thin: "css",
  refraction: "svg-backdrop",
};

/**
 * CSS-only fallback mapping.
 *
 * Only `svg-backdrop` templates need fallbacks — they use `backdrop-filter: url(#...)`
 * which requires Chromium 113+.
 *
 * `svg-filter` templates (crystal, smoke) use standard CSS `filter: url(#...)` on top of
 * `backdrop-filter: blur()`, which is broadly supported and does NOT need fallbacks.
 */
export const templateFallbacks: Partial<Record<TemplateName, TemplateName>> = {
  refraction: "frosted",
};

/** All template names (base + preset) */
export const templateNames: TemplateName[] = Object.keys(templates) as TemplateName[];
export const templatePresetNames: TemplatePresetName[] = Object.keys(templatePresets) as TemplatePresetName[];

/**
 * Liquid glass presets for the SVG refraction engine.
 * These define dimension-independent settings; width/height should be set per-use.
 */
export const refractionPresets = {
  /** Default panel style — balanced refraction with soft blur */
  panel: {
    radius: 54,
    bezelWidth: 22,
    glassThickness: 130,
    blur: 2,
    refractiveIndex: 2.05,
    surface: "convexSquircle",
    specularOpacity: 0.7,
  },
  /** Magnifying loupe — no blur, strong refraction */
  loupe: {
    radius: 50,
    bezelWidth: 20,
    glassThickness: 200,
    blur: 0,
    refractiveIndex: 1.5,
    surface: "convexCircle",
    specularOpacity: 0.7,
  },
  /** Subtle card — light refraction for content cards */
  card: {
    radius: 20,
    bezelWidth: 16,
    glassThickness: 100,
    blur: 4,
    refractiveIndex: 1.8,
    surface: "convexSquircle",
    specularOpacity: 0.5,
  },
  /** Bold bubble — pronounced convex effect */
  bubble: {
    radius: 40,
    bezelWidth: 30,
    glassThickness: 180,
    blur: 1,
    refractiveIndex: 2.2,
    surface: "convexCircle",
    specularOpacity: 0.8,
  },
  /** Concave dish — inverted glass surface */
  dish: {
    radius: 24,
    bezelWidth: 24,
    glassThickness: 150,
    blur: 3,
    refractiveIndex: 1.6,
    surface: "concave",
    specularOpacity: 0.6,
  },
} as const satisfies Record<string, Omit<LiquidGlassOptions, "width" | "height">>;

export type RefractionPresetName = keyof typeof refractionPresets;
export const refractionPresetNames = Object.keys(refractionPresets) as RefractionPresetName[];

/**
 * Resolve a template name (base or preset) into merged GlassOptions.
 * Returns the base template name and the merged options.
 */
export function resolveTemplate(
  name: TemplateName | TemplatePresetName
): { base: TemplateName; options: GlassOptions } {
  // Check if it's a preset first
  if (name in templatePresets) {
    const preset = templatePresets[name as TemplatePresetName];
    const baseOpts = templates[preset.base];
    return {
      base: preset.base,
      options: { ...baseOpts, ...preset.overrides },
    };
  }

  // It's a base template
  const base = name as TemplateName;
  return { base, options: { ...templates[base] } };
}
