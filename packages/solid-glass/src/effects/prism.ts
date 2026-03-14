import type { PrismGlassOptions, GlassStyleGenerator } from "../types";

const DEFAULTS: Required<Omit<PrismGlassOptions, "className" | "style">> = {
  blur: 6,
  spread: 3,
  hueRotate: 0,
  saturation: 1.2,
  brightness: 1.05,
  contrast: 1.1,
  borderRadius: 20,
  opacity: 1,
};

export const prism: GlassStyleGenerator<PrismGlassOptions> = (opts = {}) => {
  const o = { ...DEFAULTS, ...opts };

  return {
    className: "sg-prism",
    renderTier: "css",
    cssVars: {
      "--sg-blur": `${o.blur}px`,
      "--sg-prism-hue": `${o.hueRotate}deg`,
      "--sg-prism-saturate": o.saturation,
      "--sg-prism-brightness": o.brightness,
      "--sg-prism-contrast": o.contrast,
      "--sg-prism-spread": `${o.spread}px`,
      "--sg-radius": `${o.borderRadius}px`,
      "--sg-opacity": o.opacity,
    },
  };
};
