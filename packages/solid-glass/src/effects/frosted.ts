import type { FrostedGlassOptions, GlassStyleGenerator } from "../types";
import { hexToRgb } from "../utils";

const DEFAULTS: Required<Omit<FrostedGlassOptions, "className" | "style">> = {
  blur: 12,
  tintColor: "#ffffff",
  tintOpacity: 0.08,
  shadowColor: "rgba(255, 255, 255, 0.6)",
  shadowBlur: 6,
  shadowSpread: 0,
  borderColor: "rgba(255, 255, 255, 0.2)",
  borderWidth: 1,
  borderRadius: 16,
  opacity: 1,
};

export const frosted: GlassStyleGenerator<FrostedGlassOptions> = (opts = {}) => {
  const o = { ...DEFAULTS, ...opts };
  const rgb = o.tintColor.startsWith("#") ? hexToRgb(o.tintColor) : o.tintColor;

  return {
    className: "sg-frosted",
    renderTier: "css",
    cssVars: {
      "--sg-blur": `${o.blur}px`,
      "--sg-tint-rgb": rgb,
      "--sg-tint-opacity": o.tintOpacity,
      "--sg-shadow-color": o.shadowColor,
      "--sg-shadow-blur": `${o.shadowBlur}px`,
      "--sg-shadow-spread": `${o.shadowSpread}px`,
      "--sg-border-color": o.borderColor,
      "--sg-border-width": `${o.borderWidth}px`,
      "--sg-radius": `${o.borderRadius}px`,
      "--sg-opacity": o.opacity,
    },
  };
};
