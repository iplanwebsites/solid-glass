// React components & hooks
export { Glass } from "./react/Glass";
export { useGlass } from "./react/use-glass";

// Effect style generators
export { frosted } from "./effects/frosted";
export { crystal } from "./effects/crystal";
export { aurora } from "./effects/aurora";
export { smoke } from "./effects/smoke";
export { prism } from "./effects/prism";
export { holographic } from "./effects/holographic";
export { thin } from "./effects/thin";
export { refraction } from "./effects/refraction";
export { effects, getEffect, effectRenderTiers } from "./effects";

// Presets
export { presets, presetNames, refractionPresets, refractionPresetNames } from "./presets";

// Utilities
export { hexToRgb, rgbToHex, cn, detectRenderTier } from "./utils";

// Types
export type {
  RenderTier,
  GlassBaseOptions,
  GlassEffectName,
  GlassEffectMap,
  GlassProps,
  GlassCSSVars,
  GlassStyleGenerator,
  FrostedGlassOptions,
  CrystalGlassOptions,
  AuroraGlassOptions,
  SmokeGlassOptions,
  PrismGlassOptions,
  HolographicGlassOptions,
  ThinGlassOptions,
  RefractionGlassEffectOptions,
} from "./types";

export type { PresetName, RefractionPresetName } from "./presets";
