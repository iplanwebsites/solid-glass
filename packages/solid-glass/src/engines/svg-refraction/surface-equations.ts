/**
 * Surface equation functions that define the glass profile shape.
 *
 * Based on the physics-based refraction approach described by Kube (Chris Feijoo)
 * in "Liquid Glass in the Browser: Refraction with CSS and SVG"
 * https://kube.io/blog/liquid-glass-css-svg
 * https://github.com/kube/kube.io
 *
 * Each function maps x in [0, 1] (distance from edge, normalized by bezel width)
 * to a height y in [0, 1]. The derivative of this function determines the surface
 * normal, which drives the refraction calculation via Snell's law.
 */

export type SurfaceEquation = {
  name: string;
  fn: (x: number) => number;
};

/** Spherical dome — sharper refraction at edges */
export const CONVEX_CIRCLE: SurfaceEquation = {
  name: "Convex Circle",
  fn: (x) => Math.sqrt(1 - (1 - x) ** 2),
};

/** Squircle dome — smoother flat-to-curve transition (Apple-style) */
export const CONVEX_SQUIRCLE: SurfaceEquation = {
  name: "Convex Squircle",
  fn: (x) => Math.pow(1 - Math.pow(1 - x, 4), 1 / 4),
};

/** Bowl-shaped depression — diverges light */
export const CONCAVE: SurfaceEquation = {
  name: "Concave",
  fn: (x) => 1 - CONVEX_CIRCLE.fn(x),
};

/** Raised rim with shallow center dip — blends convex and concave via smootherstep */
export const LIP: SurfaceEquation = {
  name: "Lip",
  fn: (x) => {
    const convex = CONVEX_SQUIRCLE.fn(x * 2);
    const concave = CONCAVE.fn(x) + 0.1;
    const smootherstep = 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
    return convex * (1 - smootherstep) + concave * smootherstep;
  },
};

export const SURFACE_EQUATIONS = {
  convexCircle: CONVEX_CIRCLE,
  convexSquircle: CONVEX_SQUIRCLE,
  concave: CONCAVE,
  lip: LIP,
} as const;

export type SurfaceType = keyof typeof SURFACE_EQUATIONS;
