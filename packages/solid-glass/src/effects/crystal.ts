import type { CrystalGlassOptions, GlassStyleGenerator } from "../types";
import { hexToRgb, uniqueId } from "../utils";

const DEFAULTS: Required<Omit<CrystalGlassOptions, "className" | "style">> = {
  blur: 8,
  noiseFrequency: 0.008,
  distortionStrength: 60,
  tintColor: "#ffffff",
  tintOpacity: 0.05,
  octaves: 2,
  seed: 42,
  borderRadius: 20,
  opacity: 1,
};

export const crystal: GlassStyleGenerator<CrystalGlassOptions> = (opts = {}) => {
  const o = { ...DEFAULTS, ...opts };
  const rgb = o.tintColor.startsWith("#") ? hexToRgb(o.tintColor) : o.tintColor;
  const filterId = uniqueId("sg-crystal");

  const svgFilter = `<svg width="0" height="0" style="position:absolute;overflow:hidden"><defs><filter id="${filterId}" x="0%" y="0%" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${o.noiseFrequency} ${o.noiseFrequency}" numOctaves="${o.octaves}" seed="${o.seed}" result="noise"/><feGaussianBlur in="noise" stdDeviation="2" result="blurred"/><feDisplacementMap in="SourceGraphic" in2="blurred" scale="${o.distortionStrength}" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>`;

  return {
    className: "sg-crystal",
    cssVars: {
      "--sg-blur": `${o.blur}px`,
      "--sg-tint-rgb": rgb,
      "--sg-tint-opacity": o.tintOpacity,
      "--sg-radius": `${o.borderRadius}px`,
      "--sg-opacity": o.opacity,
      "--sg-filter-id": `url(#${filterId})`,
    },
    svgFilter,
  };
};
