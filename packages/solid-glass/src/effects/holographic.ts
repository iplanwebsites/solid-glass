import type { HolographicGlassOptions, GlassStyleGenerator } from "../types";

const DEFAULTS: Required<Omit<HolographicGlassOptions, "className" | "style">> = {
  blur: 10,
  iridescence: 0.4,
  animationSpeed: 6,
  colors: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#9b59b6"],
  noiseOpacity: 0.05,
  borderRadius: 20,
  opacity: 1,
};

export const holographic: GlassStyleGenerator<HolographicGlassOptions> = (opts = {}) => {
  const o = { ...DEFAULTS, ...opts };
  const gradient = o.colors.join(", ");

  return {
    className: "sg-holographic",
    cssVars: {
      "--sg-blur": `${o.blur}px`,
      "--sg-holo-gradient": `linear-gradient(135deg, ${gradient})`,
      "--sg-holo-iridescence": o.iridescence,
      "--sg-holo-speed": `${o.animationSpeed}s`,
      "--sg-holo-noise-opacity": o.noiseOpacity,
      "--sg-radius": `${o.borderRadius}px`,
      "--sg-opacity": o.opacity,
    },
  };
};
