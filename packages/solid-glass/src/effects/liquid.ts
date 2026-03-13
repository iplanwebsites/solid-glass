import type { LiquidGlassEffectOptions, GlassStyleGenerator } from "../types";
import { createLiquidGlass } from "../engines/svg-refraction";

const DEFAULTS = {
  blur: 2,
  surface: "convexSquircle" as const,
  bezelWidth: 22,
  glassThickness: 130,
  refractiveIndex: 2.05,
  specularOpacity: 0.7,
  specularAngle: Math.PI / 3,
  saturation: 1.2,
  borderRadius: 54,
  opacity: 1,
};

/**
 * Liquid glass effect — physics-based Snell-Descartes refraction via SVG filters.
 *
 * Uses `backdrop-filter: url(#...)` to refract the actual backdrop content
 * through a computed displacement map. Chromium 113+ for full backdrop support;
 * falls back to direct filter application in other browsers.
 *
 * Requires `width` and `height` in options to generate correctly-sized
 * displacement and specular maps.
 */
export const liquid: GlassStyleGenerator<LiquidGlassEffectOptions> = (opts) => {
  if (!opts || !opts.width || !opts.height) {
    throw new Error(
      '[solid-glass] The "liquid" effect requires width and height options ' +
        "for displacement map generation."
    );
  }

  const o = { ...DEFAULTS, ...opts };

  const result = createLiquidGlass({
    width: o.width,
    height: o.height,
    radius: o.borderRadius,
    bezelWidth: o.bezelWidth,
    glassThickness: o.glassThickness,
    blur: o.blur,
    refractiveIndex: o.refractiveIndex,
    surface: o.surface,
    specularOpacity: o.specularOpacity,
    specularAngle: o.specularAngle,
    saturation: o.saturation,
  });

  return {
    className: "sg-liquid",
    cssVars: {
      "--sg-radius": `${o.borderRadius}px`,
      "--sg-opacity": o.opacity,
      "--sg-liquid-filter": result.filterRef,
    },
    svgFilter: result.svgFilter,
    inlineStyle: {
      width: `${o.width}px`,
      height: `${o.height}px`,
    },
    renderTier: "svg-filter",
  };
};
