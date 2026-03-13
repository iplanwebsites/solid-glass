import type {
  FrostedGlassOptions,
  CrystalGlassOptions,
  AuroraGlassOptions,
  SmokeGlassOptions,
  PrismGlassOptions,
  HolographicGlassOptions,
  ThinGlassOptions,
  LiquidGlassEffectOptions,
} from "./types";
import type { LiquidGlassOptions } from "./engines/svg-refraction";

/** Pre-configured effect combos for quick use */
export const presets = {
  // --- Frosted variants ---
  frostedLight: {
    effect: "frosted" as const,
    options: { blur: 12, tintColor: "#ffffff", tintOpacity: 0.1, borderRadius: 16 } satisfies FrostedGlassOptions,
  },
  frostedDark: {
    effect: "frosted" as const,
    options: { blur: 14, tintColor: "#000000", tintOpacity: 0.2, shadowColor: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.08)", borderRadius: 16 } satisfies FrostedGlassOptions,
  },
  frostedBlue: {
    effect: "frosted" as const,
    options: { blur: 16, tintColor: "#3b82f6", tintOpacity: 0.12, borderRadius: 20 } satisfies FrostedGlassOptions,
  },

  // --- Crystal variants ---
  crystalClear: {
    effect: "crystal" as const,
    options: { blur: 6, noiseFrequency: 0.006, distortionStrength: 40, borderRadius: 20 } satisfies CrystalGlassOptions,
  },
  crystalAmber: {
    effect: "crystal" as const,
    options: { blur: 8, tintColor: "#f59e0b", tintOpacity: 0.08, noiseFrequency: 0.01, distortionStrength: 70, borderRadius: 24 } satisfies CrystalGlassOptions,
  },

  // --- Aurora variants ---
  auroraNorth: {
    effect: "aurora" as const,
    options: { colors: ["#a78bfa", "#818cf8", "#6ee7b7"], animationSpeed: 10, borderRadius: 20 } satisfies AuroraGlassOptions,
  },
  auroraSunset: {
    effect: "aurora" as const,
    options: { colors: ["#f97316", "#ef4444", "#ec4899", "#8b5cf6"], animationSpeed: 12, borderRadius: 20 } satisfies AuroraGlassOptions,
  },

  // --- Smoke variants ---
  smokeNoir: {
    effect: "smoke" as const,
    options: { blur: 24, density: 0.4, smokeColor: "#000000", borderRadius: 16 } satisfies SmokeGlassOptions,
  },
  smokeMist: {
    effect: "smoke" as const,
    options: { blur: 18, density: 0.15, smokeColor: "#ffffff", turbulence: 0.02, borderRadius: 20 } satisfies SmokeGlassOptions,
  },

  // --- Prism variants ---
  prismRainbow: {
    effect: "prism" as const,
    options: { blur: 8, hueRotate: 0, saturation: 1.4, brightness: 1.1, borderRadius: 20 } satisfies PrismGlassOptions,
  },
  prismWarm: {
    effect: "prism" as const,
    options: { blur: 6, hueRotate: -20, saturation: 1.3, contrast: 1.15, borderRadius: 16 } satisfies PrismGlassOptions,
  },

  // --- Holographic variants ---
  holoCard: {
    effect: "holographic" as const,
    options: { blur: 8, iridescence: 0.5, animationSpeed: 4, borderRadius: 16 } satisfies HolographicGlassOptions,
  },
  holoSubtle: {
    effect: "holographic" as const,
    options: { blur: 12, iridescence: 0.2, animationSpeed: 10, borderRadius: 20 } satisfies HolographicGlassOptions,
  },

  // --- Thin variants ---
  thinLight: {
    effect: "thin" as const,
    options: { blur: 4, backgroundOpacity: 0.03, borderRadius: 12 } satisfies ThinGlassOptions,
  },
  thinDark: {
    effect: "thin" as const,
    options: { blur: 4, dark: true, backgroundOpacity: 0.05, borderRadius: 12 } satisfies ThinGlassOptions,
  },

  // --- Liquid variants (physics-based SVG refraction) ---
  liquidPanel: {
    effect: "liquid" as const,
    options: { width: 300, height: 200, blur: 2, surface: "convexSquircle", bezelWidth: 22, glassThickness: 130, refractiveIndex: 2.05, specularOpacity: 0.7, borderRadius: 54 } satisfies LiquidGlassEffectOptions,
  },
  liquidLoupe: {
    effect: "liquid" as const,
    options: { width: 200, height: 200, blur: 0, surface: "convexCircle", bezelWidth: 20, glassThickness: 200, refractiveIndex: 1.5, specularOpacity: 0.7, borderRadius: 100 } satisfies LiquidGlassEffectOptions,
  },
} as const;

export type PresetName = keyof typeof presets;
export const presetNames = Object.keys(presets) as PresetName[];

/**
 * Liquid glass presets for the SVG refraction engine.
 * These define dimension-independent settings; width/height should be set per-use.
 */
export const liquidGlassPresets = {
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

export type LiquidGlassPresetName = keyof typeof liquidGlassPresets;
export const liquidGlassPresetNames = Object.keys(liquidGlassPresets) as LiquidGlassPresetName[];
