import type { GlassEffectName, GlassEffectMap } from "../types";
import { getEffect } from "../effects";

/**
 * Apply a glass effect to a plain DOM element.
 *
 * @example
 * ```js
 * import { applyGlass, removeGlass } from "solid-glass/vanilla";
 * import "solid-glass/css";
 *
 * const el = document.querySelector("#card");
 * const cleanup = applyGlass(el, "frosted", { blur: 16 });
 *
 * // Later: remove the effect
 * cleanup();
 * ```
 */
export function applyGlass<E extends GlassEffectName>(
  element: HTMLElement,
  effect: E,
  options?: GlassEffectMap[E]
): () => void {
  const gen = getEffect(effect);
  const result = gen(options ?? ({} as GlassEffectMap[E]));

  // Apply class
  element.classList.add(result.className);

  // Apply CSS variables
  for (const [key, val] of Object.entries(result.cssVars)) {
    element.style.setProperty(key, String(val));
  }

  // Inject SVG filter if needed
  let svgEl: Element | null = null;
  if (result.svgFilter) {
    const container = document.createElement("div");
    container.innerHTML = result.svgFilter;
    svgEl = container.firstElementChild;
    if (svgEl) {
      document.body.appendChild(svgEl);
    }
  }

  // Return cleanup function
  return () => {
    element.classList.remove(result.className);
    for (const key of Object.keys(result.cssVars)) {
      element.style.removeProperty(key);
    }
    if (svgEl) {
      svgEl.remove();
    }
  };
}

/**
 * Shorthand: remove a glass effect class from an element.
 * For full cleanup, use the function returned by `applyGlass`.
 */
export function removeGlass(element: HTMLElement, effect: GlassEffectName) {
  const gen = getEffect(effect);
  const result = gen({});
  element.classList.remove(result.className);
}
