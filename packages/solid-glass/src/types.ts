import type { CSSProperties, HTMLAttributes } from "react";
import type { SurfaceType } from "./engines/svg-refraction/surface-equations";

/**
 * Rendering technology tier used by an effect.
 *
 * - `"css"` — Pure CSS (`backdrop-filter`, `box-shadow`, gradients, animations).
 *   Broadest browser support.
 * - `"svg-filter"` — SVG filter primitives (`feTurbulence`, `feDisplacementMap`,
 *   `feGaussianBlur`, `feColorMatrix`, etc.). Moderate support; some filters
 *   in `backdrop-filter` are Chromium-only.
 * - `"webgl"` — GPU-accelerated WebGL/WebGPU shaders. Most powerful, narrowest
 *   support. Reserved for future use.
 */
export type RenderTier = "css" | "svg-filter" | "webgl";

/** Base configuration shared by all glass effects */
export interface GlassBaseOptions {
  /** Border radius in px */
  borderRadius?: number;
  /** Overall opacity of the glass effect (0-1) */
  opacity?: number;
  /** Additional CSS class names */
  className?: string;
  /** Additional inline styles */
  style?: CSSProperties;
}

/** Configuration for the frosted glass effect */
export interface FrostedGlassOptions extends GlassBaseOptions {
  /** Backdrop blur amount in px (default: 12) */
  blur?: number;
  /** Tint color as hex string (default: '#ffffff') */
  tintColor?: string;
  /** Tint opacity 0-1 (default: 0.08) */
  tintOpacity?: number;
  /** Inner shadow color (default: 'rgba(255,255,255,0.6)') */
  shadowColor?: string;
  /** Inner shadow blur in px (default: 6) */
  shadowBlur?: number;
  /** Inner shadow spread in px (default: 0) */
  shadowSpread?: number;
  /** Border color (default: 'rgba(255,255,255,0.2)') */
  borderColor?: string;
  /** Border width in px (default: 1) */
  borderWidth?: number;
}

/** Configuration for the crystal glass effect with refraction */
export interface CrystalGlassOptions extends GlassBaseOptions {
  /** Backdrop blur in px (default: 8) */
  blur?: number;
  /** SVG noise frequency for refraction (default: 0.008) */
  noiseFrequency?: number;
  /** Distortion displacement scale (default: 60) */
  distortionStrength?: number;
  /** Tint color hex (default: '#ffffff') */
  tintColor?: string;
  /** Tint opacity (default: 0.05) */
  tintOpacity?: number;
  /** Number of noise octaves (default: 2) */
  octaves?: number;
  /** Noise seed (default: random) */
  seed?: number;
}

/** Configuration for the aurora glass effect */
export interface AuroraGlassOptions extends GlassBaseOptions {
  /** Backdrop blur in px (default: 16) */
  blur?: number;
  /** Gradient color stops (default: pastel rainbow) */
  colors?: string[];
  /** Gradient animation speed in seconds (default: 8) */
  animationSpeed?: number;
  /** Gradient angle in degrees (default: 135) */
  angle?: number;
  /** Color layer opacity (default: 0.15) */
  colorOpacity?: number;
}

/** Configuration for the smoke glass effect */
export interface SmokeGlassOptions extends GlassBaseOptions {
  /** Backdrop blur in px (default: 20) */
  blur?: number;
  /** Smoke density 0-1 (default: 0.3) */
  density?: number;
  /** Smoke color hex (default: '#000000') */
  smokeColor?: string;
  /** Turbulence base frequency (default: 0.015) */
  turbulence?: number;
  /** Animation enabled (default: true) */
  animated?: boolean;
  /** Animation duration in seconds (default: 12) */
  animationDuration?: number;
}

/** Configuration for the prism glass effect */
export interface PrismGlassOptions extends GlassBaseOptions {
  /** Backdrop blur in px (default: 6) */
  blur?: number;
  /** Spectral spread intensity (default: 3) */
  spread?: number;
  /** Hue rotation in degrees (default: 0) */
  hueRotate?: number;
  /** Saturation boost (default: 1.2) */
  saturation?: number;
  /** Brightness (default: 1.05) */
  brightness?: number;
  /** Contrast (default: 1.1) */
  contrast?: number;
}

/** Configuration for the holographic glass effect */
export interface HolographicGlassOptions extends GlassBaseOptions {
  /** Backdrop blur in px (default: 10) */
  blur?: number;
  /** Iridescent color shift intensity 0-1 (default: 0.4) */
  iridescence?: number;
  /** Animation speed in seconds (default: 6) */
  animationSpeed?: number;
  /** Base gradient colors */
  colors?: string[];
  /** Noise pattern overlay opacity (default: 0.05) */
  noiseOpacity?: number;
}

/** Configuration for the minimal/flat glass effect */
export interface ThinGlassOptions extends GlassBaseOptions {
  /** Subtle blur in px (default: 4) */
  blur?: number;
  /** Background opacity (default: 0.02) */
  backgroundOpacity?: number;
  /** Border opacity (default: 0.1) */
  borderOpacity?: number;
  /** Use dark mode variant (default: false) */
  dark?: boolean;
}

/** Configuration for the liquid glass effect (physics-based SVG refraction) */
export interface LiquidGlassEffectOptions extends GlassBaseOptions {
  /** Width of the glass element in px (required for displacement map generation) */
  width: number;
  /** Height of the glass element in px (required for displacement map generation) */
  height: number;
  /** Backdrop blur in px (default: 2) */
  blur?: number;
  /** Surface shape profile (default: "convexSquircle") */
  surface?: SurfaceType;
  /** Width of the refractive bezel in px (default: 22) */
  bezelWidth?: number;
  /** Glass thickness for refraction depth (default: 130) */
  glassThickness?: number;
  /** Refractive index of the glass material (default: 2.05) */
  refractiveIndex?: number;
  /** Specular highlight opacity 0-1 (default: 0.7) */
  specularOpacity?: number;
  /** Specular light angle in radians (default: Math.PI / 3) */
  specularAngle?: number;
  /** Color saturation boost (default: 1.2) */
  saturation?: number;
}

/** Union type mapping effect names to their option types */
export type GlassEffectMap = {
  frosted: FrostedGlassOptions;
  crystal: CrystalGlassOptions;
  aurora: AuroraGlassOptions;
  smoke: SmokeGlassOptions;
  prism: PrismGlassOptions;
  holographic: HolographicGlassOptions;
  thin: ThinGlassOptions;
  liquid: LiquidGlassEffectOptions;
};

export type GlassEffectName = keyof GlassEffectMap;

/** Props for the unified Glass component */
export interface GlassProps<E extends GlassEffectName = "frosted">
  extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "className"> {
  /** Which glass effect to render */
  effect?: E;
  /** Options specific to the chosen effect */
  options?: GlassEffectMap[E];
  /** Shorthand: border radius */
  radius?: number;
  /** Shorthand: blur amount */
  blur?: number;
  /** Content */
  children?: React.ReactNode;
  /** HTML tag to render (default: 'div') */
  as?: keyof JSX.IntrinsicElements;
  /** Additional CSS class names */
  className?: string;
  /** Additional inline styles (also used for CSS variable injection) */
  style?: CSSProperties;
}

/** CSS variable map returned by effect style generators */
export type GlassCSSVars = Record<string, string | number>;

/** An effect style generator function */
export type GlassStyleGenerator<T extends GlassBaseOptions = GlassBaseOptions> = (
  options?: T
) => {
  className: string;
  cssVars: GlassCSSVars;
  svgFilter?: string;
  inlineStyle?: CSSProperties;
  /** The rendering technology used by this effect */
  renderTier?: RenderTier;
};
