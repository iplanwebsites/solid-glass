import type { CSSProperties } from "react";
import type { SurfaceType } from "./engines/svg-refraction/surface-equations";

/**
 * Rendering technology tier used by a template.
 *
 * - `"css"` — Pure CSS (backdrop-filter, box-shadow, gradients, animations).
 * - `"svg-filter"` — SVG filter via CSS `filter:` property (e.g. crystal, smoke).
 *   Uses `backdrop-filter: blur()` + `filter: url(#svg)` — broadly supported.
 * - `"svg-backdrop"` — SVG filter inside CSS `backdrop-filter: url(#...)` (e.g. refraction).
 *   Chromium 113+ only — Firefox/Safari do not support SVG refs in backdrop-filter.
 * - `"webgl"` — GPU shaders (reserved for future use).
 */
export type RenderTier = "css" | "svg-filter" | "svg-backdrop" | "webgl";

/**
 * Unified glass material options.
 *
 * Every glass surface is built from the same set of controls.
 * Templates provide curated starting points; any option can be overridden.
 */
export interface GlassOptions {
  // ── Core ──────────────────────────────────────────────
  /** Backdrop blur in px (default: 12) */
  blur?: number;
  /** Overall opacity of the glass element 0-1 (default: 1) */
  opacity?: number;
  /** Border radius in px (default: 16) */
  borderRadius?: number;

  // ── Tint ──────────────────────────────────────────────
  /** Tint color as hex string (default: '#ffffff') */
  tintColor?: string;
  /** Tint opacity 0-1 (default: 0.08) */
  tintOpacity?: number;

  // ── Border ────────────────────────────────────────────
  /** Border color (default: 'rgba(255,255,255,0.2)') */
  borderColor?: string;
  /** Border width in px (default: 1) */
  borderWidth?: number;
  /** Border opacity 0-1 — overrides borderColor alpha when set */
  borderOpacity?: number;

  // ── Shadow ────────────────────────────────────────────
  /** Inner shadow color (default: 'rgba(255,255,255,0.6)') */
  shadowColor?: string;
  /** Inner shadow blur in px (default: 6) */
  shadowBlur?: number;
  /** Inner shadow spread in px (default: 0) */
  shadowSpread?: number;

  // ── Distortion / Refraction ───────────────────────────
  /** Noise-based distortion strength (0 = off, default per template) */
  distortion?: number;
  /** SVG noise frequency for distortion (default: 0.008) */
  noiseFrequency?: number;
  /** Number of noise octaves (default: 2) */
  noiseOctaves?: number;
  /** Noise seed (default: 42) */
  noiseSeed?: number;
  /** SVG turbulence frequency for smoke-like effects (default: 0.015) */
  turbulence?: number;

  // ── Physics refraction (SVG displacement maps) ────────
  /** Surface shape for physics refraction (default: "convexSquircle") */
  surface?: SurfaceType;
  /** Refractive index of the glass material (default: 2.05) */
  refractiveIndex?: number;
  /** Width of the refractive bezel in px (default: 22) */
  bezelWidth?: number;
  /** Glass thickness for refraction depth (default: 130) */
  glassThickness?: number;
  /** Specular highlight opacity 0-1 (default: 0.7) */
  specularOpacity?: number;
  /** Specular light angle in radians (default: Math.PI / 3) */
  specularAngle?: number;
  /** Element width in px — auto-measured if omitted */
  width?: number;
  /** Element height in px — auto-measured if omitted */
  height?: number;

  // ── Color effects ─────────────────────────────────────
  /** Color saturation multiplier (default: 1) */
  saturation?: number;
  /** Brightness multiplier (default: 1) */
  brightness?: number;
  /** Contrast multiplier (default: 1) */
  contrast?: number;
  /** Hue rotation in degrees (default: 0) */
  hueRotate?: number;

  // ── Color overlay / gradient ──────────────────────────
  /** Gradient color stops for overlay effects */
  colors?: string[];
  /** Color overlay opacity 0-1 (default: 0.15) */
  colorOpacity?: number;
  /** Gradient angle in degrees (default: 135) */
  gradientAngle?: number;
  /** Blend mode for the color overlay (default: "normal") */
  colorBlend?: "normal" | "overlay" | "screen" | "multiply" | "soft-light";

  // ── Animation ─────────────────────────────────────────
  /** Enable animation (default: depends on template) */
  animated?: boolean;
  /** Animation duration in seconds (default: 8) */
  animationSpeed?: number;
  /** Animation easing — CSS easing or "bouncy" for spring physics (default: "ease") */
  animationEasing?: "ease" | "linear" | "ease-in" | "ease-out" | "ease-in-out" | "bouncy";
  /** Bounciness factor 0-1 — controls overshoot in spring animations (default: 0.3) */
  bounciness?: number;
  /** Pause animation (default: false) */
  paused?: boolean;

  // ── Theme ─────────────────────────────────────────────
  /** Color scheme — "auto" follows prefers-color-scheme (default: "light") */
  colorScheme?: "light" | "dark" | "auto";

  // ── Pass-through ──────────────────────────────────────
  /** Additional CSS class names */
  className?: string;
  /** Additional inline styles */
  style?: CSSProperties;
}

/** Template names — curated starting points for glass materials */
export type TemplateName =
  | "frosted"
  | "crystal"
  | "aurora"
  | "smoke"
  | "prism"
  | "holographic"
  | "thin"
  | "refraction";

/** Named template presets with pre-configured variations */
export type TemplatePresetName =
  | "frostedLight"
  | "frostedDark"
  | "frostedBlue"
  | "crystalClear"
  | "crystalAmber"
  | "auroraNorth"
  | "auroraSunset"
  | "smokeNoir"
  | "smokeMist"
  | "prismRainbow"
  | "prismWarm"
  | "holoCard"
  | "holoSubtle"
  | "thinLight"
  | "thinDark"
  | "refractionPanel"
  | "refractionLoupe";

/** Props for the unified Glass component */
export interface GlassProps
  extends GlassOptions,
    Omit<React.HTMLAttributes<HTMLDivElement>, "style" | "className"> {
  /** Template — curated starting point (default: "frosted") */
  template?: TemplateName | TemplatePresetName;
  /** Content */
  children?: React.ReactNode;
  /** HTML tag to render (default: 'div') */
  as?: keyof JSX.IntrinsicElements;
  /** Fallback template if the primary requires unsupported features */
  fallback?: TemplateName;
}

/** CSS variable map returned by the glass renderer */
export type GlassCSSVars = Record<string, string | number>;

/** Result from the glass rendering pipeline */
export interface GlassRenderResult {
  /** CSS class name(s) to apply */
  className: string;
  /** CSS custom properties to set */
  cssVars: GlassCSSVars;
  /** SVG filter markup to inject (if needed) */
  svgFilter?: string;
  /** Additional inline styles */
  inlineStyle?: CSSProperties;
  /** The rendering technology used */
  renderTier: RenderTier;
}
