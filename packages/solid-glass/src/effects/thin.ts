import type { ThinGlassOptions, GlassStyleGenerator } from "../types";

const DEFAULTS: Required<Omit<ThinGlassOptions, "className" | "style">> = {
  blur: 4,
  backgroundOpacity: 0.02,
  borderOpacity: 0.1,
  dark: false,
  borderRadius: 12,
  opacity: 1,
};

export const thin: GlassStyleGenerator<ThinGlassOptions> = (opts = {}) => {
  const o = { ...DEFAULTS, ...opts };
  const base = o.dark ? "0, 0, 0" : "255, 255, 255";

  return {
    className: `sg-thin${o.dark ? " sg-thin-dark" : ""}`,
    cssVars: {
      "--sg-blur": `${o.blur}px`,
      "--sg-thin-bg-rgb": base,
      "--sg-thin-bg-opacity": o.backgroundOpacity,
      "--sg-thin-border-opacity": o.borderOpacity,
      "--sg-radius": `${o.borderRadius}px`,
      "--sg-opacity": o.opacity,
    },
  };
};
