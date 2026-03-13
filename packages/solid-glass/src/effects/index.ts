export { frosted } from "./frosted";
export { crystal } from "./crystal";
export { aurora } from "./aurora";
export { smoke } from "./smoke";
export { prism } from "./prism";
export { holographic } from "./holographic";
export { thin } from "./thin";

import { frosted } from "./frosted";
import { crystal } from "./crystal";
import { aurora } from "./aurora";
import { smoke } from "./smoke";
import { prism } from "./prism";
import { holographic } from "./holographic";
import { thin } from "./thin";
import type { GlassEffectName, GlassStyleGenerator, GlassBaseOptions } from "../types";

/** Registry of all built-in effects */
export const effects: Record<GlassEffectName, GlassStyleGenerator<GlassBaseOptions>> = {
  frosted: frosted as GlassStyleGenerator<GlassBaseOptions>,
  crystal: crystal as GlassStyleGenerator<GlassBaseOptions>,
  aurora: aurora as GlassStyleGenerator<GlassBaseOptions>,
  smoke: smoke as GlassStyleGenerator<GlassBaseOptions>,
  prism: prism as GlassStyleGenerator<GlassBaseOptions>,
  holographic: holographic as GlassStyleGenerator<GlassBaseOptions>,
  thin: thin as GlassStyleGenerator<GlassBaseOptions>,
};

/** Get a style generator by effect name */
export function getEffect(name: GlassEffectName): GlassStyleGenerator<GlassBaseOptions> {
  const effect = effects[name];
  if (!effect) {
    throw new Error(`[solid-glass] Unknown effect: "${name}". Available: ${Object.keys(effects).join(", ")}`);
  }
  return effect;
}
