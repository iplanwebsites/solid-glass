import type { GlassOptions, GlassRenderResult, TemplateName, TemplatePresetName } from "./types";
import { resolveTemplate, templateRenderTiers, templateFallbacks } from "./templates";
import { hexToRgb, uniqueId, detectRenderTier } from "./utils";
import { createLiquidGlass } from "./engines/svg-refraction";

/**
 * Unified glass rendering pipeline.
 *
 * Takes a template name and flat options, resolves defaults, detects browser
 * capabilities, and returns everything needed to render the glass effect.
 */
export function renderGlass(
  templateName: TemplateName | TemplatePresetName = "frosted",
  overrides: GlassOptions = {}
): GlassRenderResult {
  // Resolve template defaults + user overrides
  const { base, options: templateOpts } = resolveTemplate(templateName);
  const opts = { ...templateOpts, ...stripUndefined(overrides) };

  // Apply dark/auto color scheme
  applyColorScheme(opts);

  // Check if browser supports the required render tier
  let effectiveBase = base;
  const requiredTier = templateRenderTiers[base];
  if (requiredTier === "svg-filter" && typeof document !== "undefined") {
    const supported = detectRenderTier();
    if (supported === "css" && templateFallbacks[base]) {
      effectiveBase = templateFallbacks[base]!;
      // Re-resolve with fallback template but keep user overrides
      const fallbackOpts = resolveTemplate(effectiveBase).options;
      // Keep user-specified values, fill gaps from fallback
      Object.keys(fallbackOpts).forEach((key) => {
        if (!(key in overrides) && !(key in templateOpts)) {
          (opts as Record<string, unknown>)[key] = (fallbackOpts as Record<string, unknown>)[key];
        }
      });

      if (typeof console !== "undefined" && process?.env?.NODE_ENV !== "production") {
        console.warn(
          `[solid-glass] "${base}" requires SVG filters (Chromium 113+). ` +
          `Falling back to "${effectiveBase}". Pass fallback="${effectiveBase}" to silence this.`
        );
      }
    }
  }

  // Dispatch to the appropriate renderer
  switch (effectiveBase) {
    case "frosted": return renderFrosted(opts);
    case "crystal": return renderCrystal(opts);
    case "aurora": return renderAurora(opts);
    case "smoke": return renderSmoke(opts);
    case "prism": return renderPrism(opts);
    case "holographic": return renderHolographic(opts);
    case "thin": return renderThin(opts);
    case "refraction": return renderRefraction(opts);
    default: return renderFrosted(opts);
  }
}

// ── Renderers ───────────────────────────────────────────────────────────────

function renderFrosted(o: GlassOptions): GlassRenderResult {
  const rgb = toRgb(o.tintColor ?? "#ffffff");
  return {
    className: classNames("sg-frosted", o),
    renderTier: "css",
    cssVars: {
      "--sg-blur": px(o.blur ?? 12),
      "--sg-tint-rgb": rgb,
      "--sg-tint-opacity": o.tintOpacity ?? 0.08,
      "--sg-shadow-color": o.shadowColor ?? "rgba(255, 255, 255, 0.6)",
      "--sg-shadow-blur": px(o.shadowBlur ?? 6),
      "--sg-shadow-spread": px(o.shadowSpread ?? 0),
      "--sg-border-color": o.borderColor ?? "rgba(255, 255, 255, 0.2)",
      "--sg-border-width": px(o.borderWidth ?? 1),
      ...commonVars(o),
      ...animationVars(o),
    },
  };
}

function renderCrystal(o: GlassOptions): GlassRenderResult {
  const rgb = toRgb(o.tintColor ?? "#ffffff");
  const filterId = uniqueId("sg-crystal");
  const freq = o.noiseFrequency ?? 0.008;
  const strength = o.distortion ?? 60;
  const octaves = o.noiseOctaves ?? 2;
  const seed = o.noiseSeed ?? 42;

  const svgFilter = `<svg width="0" height="0" style="position:absolute;overflow:hidden"><defs><filter id="${filterId}" x="0%" y="0%" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq} ${freq}" numOctaves="${octaves}" seed="${seed}" result="noise"/><feGaussianBlur in="noise" stdDeviation="2" result="blurred"/><feDisplacementMap in="SourceGraphic" in2="blurred" scale="${strength}" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>`;

  return {
    className: classNames("sg-crystal", o),
    renderTier: "svg-filter",
    cssVars: {
      "--sg-blur": px(o.blur ?? 8),
      "--sg-tint-rgb": rgb,
      "--sg-tint-opacity": o.tintOpacity ?? 0.05,
      "--sg-filter-id": `url(#${filterId})`,
      ...commonVars(o),
      ...animationVars(o),
    },
    svgFilter,
  };
}

function renderAurora(o: GlassOptions): GlassRenderResult {
  const colors = o.colors ?? ["#a78bfa", "#818cf8", "#6ee7b7", "#fbbf24", "#f472b6"];
  const angle = o.gradientAngle ?? 135;
  const gradient = `linear-gradient(${angle}deg, ${colors.join(", ")})`;

  return {
    className: classNames("sg-aurora", o),
    renderTier: "css",
    cssVars: {
      "--sg-blur": px(o.blur ?? 16),
      "--sg-aurora-gradient": gradient,
      "--sg-aurora-speed": `${o.animationSpeed ?? 8}s`,
      "--sg-aurora-opacity": o.colorOpacity ?? 0.15,
      ...commonVars(o),
      ...animationVars(o),
    },
  };
}

function renderSmoke(o: GlassOptions): GlassRenderResult {
  const rgb = toRgb(o.tintColor ?? "#000000");
  const filterId = uniqueId("sg-smoke");
  const freq = o.turbulence ?? 0.015;
  const duration = o.animationSpeed ?? 12;
  const isAnimated = o.animated !== false;
  const strength = o.distortion ?? 30;

  const svgFilter = `<svg width="0" height="0" style="position:absolute;overflow:hidden"><defs><filter id="${filterId}" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="4" seed="0" result="noise"><animate attributeName="seed" from="0" to="100" dur="${duration}s" repeatCount="${isAnimated ? "indefinite" : "0"}"/></feTurbulence><feGaussianBlur in="noise" stdDeviation="3" result="blur"/><feDisplacementMap in="SourceGraphic" in2="blur" scale="${strength}" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>`;

  return {
    className: classNames("sg-smoke", o),
    renderTier: "svg-filter",
    cssVars: {
      "--sg-blur": px(o.blur ?? 20),
      "--sg-smoke-rgb": rgb,
      "--sg-smoke-density": o.tintOpacity ?? 0.3,
      "--sg-filter-id": `url(#${filterId})`,
      ...commonVars(o),
      ...animationVars(o),
    },
    svgFilter,
  };
}

function renderPrism(o: GlassOptions): GlassRenderResult {
  return {
    className: classNames("sg-prism", o),
    renderTier: "css",
    cssVars: {
      "--sg-blur": px(o.blur ?? 6),
      "--sg-prism-hue": `${o.hueRotate ?? 0}deg`,
      "--sg-prism-saturate": o.saturation ?? 1.2,
      "--sg-prism-brightness": o.brightness ?? 1.05,
      "--sg-prism-contrast": o.contrast ?? 1.1,
      ...commonVars(o),
      ...animationVars(o),
    },
  };
}

function renderHolographic(o: GlassOptions): GlassRenderResult {
  const colors = o.colors ?? ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#9b59b6"];
  const gradient = `linear-gradient(135deg, ${colors.join(", ")})`;

  return {
    className: classNames("sg-holographic", o),
    renderTier: "css",
    cssVars: {
      "--sg-blur": px(o.blur ?? 10),
      "--sg-holo-gradient": gradient,
      "--sg-holo-iridescence": o.colorOpacity ?? 0.4,
      "--sg-holo-speed": `${o.animationSpeed ?? 6}s`,
      ...commonVars(o),
      ...animationVars(o),
    },
  };
}

function renderThin(o: GlassOptions): GlassRenderResult {
  const isDark = o.colorScheme === "dark";
  const rgb = isDark ? "0, 0, 0" : "255, 255, 255";

  return {
    className: classNames(`sg-thin${isDark ? " sg-thin-dark" : ""}`, o),
    renderTier: "css",
    cssVars: {
      "--sg-blur": px(o.blur ?? 4),
      "--sg-thin-bg-rgb": rgb,
      "--sg-thin-bg-opacity": o.tintOpacity ?? 0.02,
      "--sg-thin-border-opacity": o.borderOpacity ?? 0.1,
      ...commonVars(o),
      ...animationVars(o),
    },
  };
}

function renderRefraction(o: GlassOptions): GlassRenderResult {
  const w = o.width;
  const h = o.height;

  // If no dimensions provided, return a placeholder that needs measuring
  if (!w || !h) {
    return {
      className: classNames("sg-refraction sg-refraction--needs-measure", o),
      renderTier: "svg-filter",
      cssVars: {
        ...commonVars(o),
      },
      inlineStyle: {
        // Signal to the component that it needs to measure and re-render
      },
    };
  }

  const result = createLiquidGlass({
    width: w,
    height: h,
    radius: o.borderRadius ?? 54,
    bezelWidth: o.bezelWidth ?? 22,
    glassThickness: o.glassThickness ?? 130,
    blur: o.blur ?? 2,
    refractiveIndex: o.refractiveIndex ?? 2.05,
    surface: o.surface ?? "convexSquircle",
    specularOpacity: o.specularOpacity ?? 0.7,
    specularAngle: o.specularAngle ?? Math.PI / 3,
    saturation: o.saturation ?? 1.2,
  });

  return {
    className: classNames("sg-refraction", o),
    renderTier: "svg-filter",
    cssVars: {
      "--sg-refraction-filter": result.filterRef,
      ...commonVars(o),
    },
    svgFilter: result.svgFilter,
    inlineStyle: {
      width: `${w}px`,
      height: `${h}px`,
    },
  };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function commonVars(o: GlassOptions): GlassCSSVars {
  const vars: GlassCSSVars = {
    "--sg-radius": px(o.borderRadius ?? 16),
    "--sg-opacity": o.opacity ?? 1,
  };
  return vars;
}

function animationVars(o: GlassOptions): GlassCSSVars {
  const vars: GlassCSSVars = {};

  if (o.paused) {
    vars["--sg-animation-state"] = "paused";
  }

  if (o.animationEasing === "bouncy" || o.bounciness !== undefined) {
    const bounce = o.bounciness ?? 0.3;
    // Spring-like cubic-bezier approximation
    // Higher bounciness = more overshoot
    const p1 = 0.68 - bounce * 0.3;
    const p2 = -0.6 * bounce;
    const p3 = 0.32 + bounce * 0.3;
    const p4 = 1 + bounce * 0.8;
    vars["--sg-animation-easing"] = `cubic-bezier(${p1}, ${p2}, ${p3}, ${p4})`;
  } else if (o.animationEasing && o.animationEasing !== "ease") {
    vars["--sg-animation-easing"] = o.animationEasing;
  }

  return vars;
}

type GlassCSSVars = Record<string, string | number>;

function classNames(base: string, o: GlassOptions): string {
  let cls = base;
  if (o.className) cls += ` ${o.className}`;
  return cls;
}

function toRgb(color: string): string {
  return color.startsWith("#") ? hexToRgb(color) : color;
}

function px(n: number): string {
  return `${n}px`;
}

function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) result[key] = val;
  }
  return result;
}

function applyColorScheme(opts: GlassOptions): void {
  if (opts.colorScheme === "auto" && typeof window !== "undefined") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    opts.colorScheme = prefersDark ? "dark" : "light";
  }

  if (opts.colorScheme === "dark") {
    // Apply dark defaults only where user hasn't set explicit values
    opts.tintColor ??= "#000000";
    opts.shadowColor ??= "rgba(0, 0, 0, 0.3)";
    opts.borderColor ??= "rgba(255, 255, 255, 0.08)";
  }
}
