// ── Main API ────────────────────────────────────────────────────────────────

// React components & hooks
export { Glass } from "./react/Glass";
export { useGlass } from "./react/use-glass";

// Rendering pipeline
export { renderGlass } from "./render-glass";

// Templates
export {
  templates,
  templatePresets,
  templateNames,
  templatePresetNames,
  templateRenderTiers,
  templateFallbacks,
  resolveTemplate,
  refractionPresets,
  refractionPresetNames,
} from "./templates";

export type { RefractionPresetName } from "./templates";

// DOM utilities
export { injectSvgFilter, ensureStyles } from "./dom";

// ── Types ───────────────────────────────────────────────────────────────────

export type {
  RenderTier,
  GlassOptions,
  GlassProps,
  GlassCSSVars,
  GlassRenderResult,
  TemplateName,
  TemplatePresetName,
} from "./types";

// ── Utilities (for advanced use) ────────────────────────────────────────────

export { hexToRgb, rgbToHex, detectRenderTier } from "./utils";
