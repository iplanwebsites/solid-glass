/**
 * SVG Refraction Engine — Physics-based liquid glass effect.
 *
 * Implements Snell-Descartes refraction through a curved glass surface,
 * rendered via SVG displacement maps. Inspired by the excellent work of
 * Kube (Chris Feijoo) — "Liquid Glass in the Browser: Refraction with CSS and SVG"
 * https://kube.io/blog/liquid-glass-css-svg
 * https://github.com/kube/kube.io
 *
 * NOTE: backdrop-filter with SVG filters is currently only supported in
 * Chromium-based browsers. For cross-browser support, this engine applies
 * the filter to the element directly (not as a backdrop).
 */

export {
  SURFACE_EQUATIONS,
  CONVEX_CIRCLE,
  CONVEX_SQUIRCLE,
  CONCAVE,
  LIP,
  type SurfaceEquation,
  type SurfaceType,
} from "./surface-equations";

export {
  computeBezelDisplacement,
  generateDisplacementMap,
  generateMagnifyingMap,
} from "./displacement-map";

export { generateSpecularMap } from "./specular";

export { pixelDataToUrl } from "./image-data-url";

import type { SurfaceType } from "./surface-equations";
import { SURFACE_EQUATIONS } from "./surface-equations";
import { generateDisplacementMap } from "./displacement-map";
import { generateSpecularMap } from "./specular";
import { pixelDataToUrl } from "./image-data-url";

export interface LiquidGlassOptions {
  /** Width of the glass element in px */
  width: number;
  /** Height of the glass element in px */
  height: number;
  /** Corner radius in px (default: 20) */
  radius?: number;
  /** Width of the refractive bezel in px (default: 50) */
  bezelWidth?: number;
  /** Glass thickness for refraction depth (default: 200) */
  glassThickness?: number;
  /** Backdrop blur in px (default: 8) */
  blur?: number;
  /** Refractive index of the glass material (default: 1.5) */
  refractiveIndex?: number;
  /** Surface shape (default: "convexSquircle") */
  surface?: SurfaceType;
  /** Specular highlight opacity 0-1 (default: 0.6) */
  specularOpacity?: number;
  /** Specular light angle in radians (default: Math.PI / 3) */
  specularAngle?: number;
  /** Color saturation boost (default: 1.2) */
  saturation?: number;
  /** Device pixel ratio override */
  dpr?: number;
}

export interface LiquidGlassResult {
  /** The complete SVG filter markup to inject into the DOM */
  svgFilter: string;
  /** The CSS filter reference: url(#filterId) */
  filterRef: string;
  /** The unique filter ID */
  filterId: string;
  /** Maximum displacement in pixels (the `scale` value) */
  maxDisplacement: number;
}

let _counter = 0;

/**
 * Generate a physics-based liquid glass SVG filter.
 *
 * @example
 * ```ts
 * import { createLiquidGlass } from "solid-glass/engines/svg-refraction";
 *
 * const glass = createLiquidGlass({
 *   width: 300,
 *   height: 200,
 *   radius: 24,
 *   bezelWidth: 40,
 *   surface: "convexSquircle",
 * });
 *
 * document.body.insertAdjacentHTML("beforeend", glass.svgFilter);
 * element.style.backdropFilter = glass.filterRef;
 * ```
 */
export function createLiquidGlass(opts: LiquidGlassOptions): LiquidGlassResult {
  const {
    width,
    height,
    radius = 20,
    bezelWidth = 50,
    glassThickness = 200,
    blur = 8,
    refractiveIndex = 1.5,
    surface = "convexSquircle",
    specularOpacity = 0.6,
    specularAngle = Math.PI / 3,
    saturation = 1.2,
    dpr = 1,
  } = opts;

  const filterId = `sg-liquid-${++_counter}`;
  const surfaceEq = SURFACE_EQUATIONS[surface];

  // Generate displacement map
  const dispMap = generateDisplacementMap({
    width,
    height,
    radius,
    bezelWidth,
    glassThickness,
    surface: surfaceEq,
    refractiveIndex,
    dpr,
  });

  const dispUrl = pixelDataToUrl(dispMap.data, dispMap.width, dispMap.height);

  // Generate specular highlight
  const specMap = generateSpecularMap({
    width,
    height,
    radius,
    bezelWidth,
    specularAngle,
    dpr,
  });

  const specUrl = pixelDataToUrl(specMap.data, specMap.width, specMap.height);

  const scale = dispMap.maxDisplacement;

  const svgFilter = `<svg width="0" height="0" style="position:absolute;overflow:hidden" color-interpolation-filters="sRGB"><defs><filter id="${filterId}" x="0%" y="0%" width="100%" height="100%"><feGaussianBlur in="SourceGraphic" stdDeviation="${blur}" result="blurred"/><feImage href="${dispUrl}" x="0" y="0" width="${width}" height="${height}" result="disp_map"/><feDisplacementMap in="blurred" in2="disp_map" scale="${scale}" xChannelSelector="R" yChannelSelector="G" result="displaced"/><feColorMatrix in="displaced" type="saturate" values="${saturation}" result="saturated"/><feImage href="${specUrl}" x="0" y="0" width="${width}" height="${height}" result="spec_layer"/><feComponentTransfer in="spec_layer" result="spec_faded"><feFuncA type="linear" slope="${specularOpacity}"/></feComponentTransfer><feBlend in="spec_faded" in2="saturated" mode="screen"/></filter></defs></svg>`;

  return {
    svgFilter,
    filterRef: `url(#${filterId})`,
    filterId,
    maxDisplacement: scale,
  };
}
