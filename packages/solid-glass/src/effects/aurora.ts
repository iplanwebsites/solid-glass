import type { AuroraGlassOptions, GlassStyleGenerator } from "../types";

const DEFAULTS: Required<Omit<AuroraGlassOptions, "className" | "style">> = {
  blur: 16,
  colors: ["#a78bfa", "#818cf8", "#6ee7b7", "#fbbf24", "#f472b6"],
  animationSpeed: 8,
  angle: 135,
  colorOpacity: 0.15,
  borderRadius: 20,
  opacity: 1,
};

export const aurora: GlassStyleGenerator<AuroraGlassOptions> = (opts = {}) => {
  const o = { ...DEFAULTS, ...opts };
  const gradient = o.colors.join(", ");

  return {
    className: "sg-aurora",
    renderTier: "css",
    cssVars: {
      "--sg-blur": `${o.blur}px`,
      "--sg-aurora-gradient": `linear-gradient(${o.angle}deg, ${gradient})`,
      "--sg-aurora-speed": `${o.animationSpeed}s`,
      "--sg-aurora-opacity": o.colorOpacity,
      "--sg-radius": `${o.borderRadius}px`,
      "--sg-opacity": o.opacity,
    },
  };
};
