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
export { effects, getEffect } from "./effects";

// Presets
export { presets, presetNames } from "./presets";

// Utilities
export { hexToRgb, rgbToHex, cn } from "./utils";

// Types
export type {
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
} from "./types";

export type { PresetName } from "./presets";
