import type { GlassOptions, TemplateName, TemplatePresetName } from "../types";
import { renderGlass } from "../render-glass";
import { injectSvgFilter, ensureStyles } from "../dom";

/**
 * Apply a glass effect to a plain DOM element.
 * Returns a cleanup function that fully removes the effect.
 *
 * @example
 * ```js
 * import { applyGlass } from "solid-glass/vanilla";
 *
 * // Zero config
 * const cleanup = applyGlass(document.querySelector("#card"));
 *
 * // With template + overrides
 * const cleanup = applyGlass(el, "aurora", { blur: 20, paused: true });
 *
 * // Named preset
 * const cleanup = applyGlass(el, "frostedDark");
 *
 * // Later: full cleanup
 * cleanup();
 * ```
 */
export function applyGlass(
  element: HTMLElement,
  template: TemplateName | TemplatePresetName = "frosted",
  options?: GlassOptions
): () => void {
  ensureStyles();

  const result = renderGlass(template, options ?? {});

  // Apply classes
  const classes = result.className.split(" ").filter(Boolean);
  element.classList.add(...classes);

  // Apply CSS variables
  const appliedVars: string[] = [];
  for (const [key, val] of Object.entries(result.cssVars)) {
    element.style.setProperty(key, String(val));
    appliedVars.push(key);
  }

  // Apply inline styles
  const appliedStyles: string[] = [];
  if (result.inlineStyle) {
    for (const [key, val] of Object.entries(result.inlineStyle)) {
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      element.style.setProperty(cssKey, String(val));
      appliedStyles.push(cssKey);
    }
  }

  // Inject SVG filter
  let cleanupSvg: (() => void) | null = null;
  if (result.svgFilter) {
    cleanupSvg = injectSvgFilter(result.svgFilter);
  }

  // Return full cleanup
  return () => {
    element.classList.remove(...classes);
    for (const key of appliedVars) {
      element.style.removeProperty(key);
    }
    for (const key of appliedStyles) {
      element.style.removeProperty(key);
    }
    cleanupSvg?.();
  };
}
