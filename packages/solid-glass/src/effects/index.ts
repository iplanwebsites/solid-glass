export { frosted } from "./frosted";
export { crystal } from "./crystal";
export { aurora } from "./aurora";
export { smoke } from "./smoke";
export { prism } from "./prism";
export { holographic } from "./holographic";
export { thin } from "./thin";
export { refraction } from "./refraction";

import { frosted } from "./frosted";
import { crystal } from "./crystal";
import { aurora } from "./aurora";
import { smoke } from "./smoke";
import { prism } from "./prism";
import { holographic } from "./holographic";
import { thin } from "./thin";
import { refraction } from "./refraction";
import type { GlassEffectName, GlassStyleGenerator, GlassBaseOptions, RenderTier } from "../types";

/** Registry of all built-in effects */
export const effects: Record<GlassEffectName, GlassStyleGenerator<GlassBaseOptions>> = {
  frosted: frosted as GlassStyleGenerator<GlassBaseOptions>,
  crystal: crystal as GlassStyleGenerator<GlassBaseOptions>,
  aurora: aurora as GlassStyleGenerator<GlassBaseOptions>,
  smoke: smoke as GlassStyleGenerator<GlassBaseOptions>,
  prism: prism as GlassStyleGenerator<GlassBaseOptions>,
  holographic: holographic as GlassStyleGenerator<GlassBaseOptions>,
  thin: thin as GlassStyleGenerator<GlassBaseOptions>,
  refraction: refraction as GlassStyleGenerator<GlassBaseOptions>,
};

/**
 * Rendering tier used by each effect.
 *
 * - `"css"` — Pure CSS (backdrop-filter, box-shadow, gradients)
 * - `"svg-filter"` — SVG filter via CSS `filter:` property (broadly supported)
 * - `"svg-backdrop"` — SVG filter via CSS `backdrop-filter: url()` (Chromium 113+)
 * - `"webgl"` — GPU shaders (reserved for future use)
 */
export const effectRenderTiers: Record<GlassEffectName, RenderTier> = {
  frosted: "css",
  crystal: "svg-filter",
  aurora: "css",
  smoke: "svg-filter",
  prism: "css",
  holographic: "css",
  thin: "css",
  refraction: "svg-backdrop",
};

/** Get a style generator by effect name */
export function getEffect(name: GlassEffectName): GlassStyleGenerator<GlassBaseOptions> {
  const effect = effects[name];
  if (!effect) {
    throw new Error(`[solid-glass] Unknown effect: "${name}". Available: ${Object.keys(effects).join(", ")}`);
  }
  return effect;
}
