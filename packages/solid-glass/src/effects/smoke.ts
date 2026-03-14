import type { SmokeGlassOptions, GlassStyleGenerator } from "../types";
import { hexToRgb, uniqueId } from "../utils";

const DEFAULTS: Required<Omit<SmokeGlassOptions, "className" | "style">> = {
  blur: 20,
  density: 0.3,
  smokeColor: "#000000",
  turbulence: 0.015,
  animated: true,
  animationDuration: 12,
  borderRadius: 20,
  opacity: 1,
};

export const smoke: GlassStyleGenerator<SmokeGlassOptions> = (opts = {}) => {
  const o = { ...DEFAULTS, ...opts };
  const rgb = o.smokeColor.startsWith("#") ? hexToRgb(o.smokeColor) : o.smokeColor;
  const filterId = uniqueId("sg-smoke");

  const svgFilter = `<svg width="0" height="0" style="position:absolute;overflow:hidden"><defs><filter id="${filterId}" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="${o.turbulence}" numOctaves="4" seed="0" result="noise"><animate attributeName="seed" from="0" to="100" dur="${o.animationDuration}s" repeatCount="${o.animated ? "indefinite" : "0"}"/></feTurbulence><feGaussianBlur in="noise" stdDeviation="3" result="blur"/><feDisplacementMap in="SourceGraphic" in2="blur" scale="30" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>`;

  return {
    className: "sg-smoke",
    renderTier: "svg-filter",
    cssVars: {
      "--sg-blur": `${o.blur}px`,
      "--sg-smoke-rgb": rgb,
      "--sg-smoke-density": o.density,
      "--sg-radius": `${o.borderRadius}px`,
      "--sg-opacity": o.opacity,
      "--sg-filter-id": `url(#${filterId})`,
    },
    svgFilter,
  };
};
