/**
 * Displacement map generation for physics-based glass refraction.
 *
 * Based on the approach by Kube (Chris Feijoo):
 * https://kube.io/blog/liquid-glass-css-svg
 * https://github.com/kube/kube.io
 *
 * Generates an RGBA image where:
 *   Red channel   = X-axis displacement (128 = neutral)
 *   Green channel = Y-axis displacement (128 = neutral)
 *   Blue          = unused (128)
 *   Alpha         = 255
 *
 * The `scale` attribute of feDisplacementMap then multiplies this.
 */

import { CONVEX_SQUIRCLE, type SurfaceEquation } from "./surface-equations";

/**
 * Pre-compute 1D displacement magnitudes along a single bezel radius.
 * Uses Snell-Descartes law for refraction through a curved glass surface.
 */
export function computeBezelDisplacement(
  glassThickness: number,
  bezelWidth: number,
  surface: SurfaceEquation = CONVEX_SQUIRCLE,
  refractiveIndex: number = 1.5,
  samples: number = 128
): number[] {
  const eta = 1 / refractiveIndex;

  function refract(nx: number, ny: number): [number, number] | null {
    const dot = ny;
    const k = 1 - eta * eta * (1 - dot * dot);
    if (k < 0) return null; // total internal reflection
    const kSqrt = Math.sqrt(k);
    return [-(eta * dot + kSqrt) * nx, eta - (eta * dot + kSqrt) * ny];
  }

  return Array.from({ length: samples }, (_, i) => {
    const x = i / samples;
    const y = surface.fn(x);

    // Numerical derivative for surface normal
    const dx = x < 1 ? 0.0001 : -0.0001;
    const y2 = surface.fn(x + dx);
    const derivative = (y2 - y) / dx;
    const magnitude = Math.sqrt(derivative * derivative + 1);
    const normal: [number, number] = [
      -derivative / magnitude,
      -1 / magnitude,
    ];

    const refracted = refract(normal[0], normal[1]);
    if (!refracted) return 0;

    const remainingHeight = y * bezelWidth + glassThickness;
    return refracted[0] * (remainingHeight / refracted[1]);
  });
}

/**
 * Generate a full 2D displacement map as raw RGBA pixel data.
 * Returns { data, width, height, maxDisplacement }.
 */
export function generateDisplacementMap(opts: {
  width: number;
  height: number;
  radius: number;
  bezelWidth: number;
  glassThickness?: number;
  surface?: SurfaceEquation;
  refractiveIndex?: number;
  dpr?: number;
}): { data: Uint8ClampedArray; width: number; height: number; maxDisplacement: number } {
  const {
    width,
    height,
    radius,
    bezelWidth,
    glassThickness = 200,
    surface = CONVEX_SQUIRCLE,
    refractiveIndex = 1.5,
    dpr = typeof window !== "undefined" ? window.devicePixelRatio ?? 1 : 1,
  } = opts;

  const bw = width * dpr;
  const bh = height * dpr;
  const data = new Uint8ClampedArray(bw * bh * 4);

  // Fill neutral (128, 128, 128, 255)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 128;
    data[i + 1] = 128;
    data[i + 2] = 128;
    data[i + 3] = 255;
  }

  const bezel1D = computeBezelDisplacement(
    glassThickness,
    bezelWidth,
    surface,
    refractiveIndex
  );
  const maxDisplacement = Math.max(...bezel1D.map(Math.abs)) || 1;

  const r = radius * dpr;
  const bz = bezelWidth * dpr;
  const rSq = r ** 2;
  const rPlusSq = (r + 1) ** 2;
  const rMinusBzSq = (r - bz) ** 2;
  const wBetween = bw - r * 2;
  const hBetween = bh - r * 2;

  for (let y1 = 0; y1 < bh; y1++) {
    for (let x1 = 0; x1 < bw; x1++) {
      const isLeft = x1 < r;
      const isRight = x1 >= bw - r;
      const isTop = y1 < r;
      const isBottom = y1 >= bh - r;

      const x = isLeft ? x1 - r : isRight ? x1 - r - wBetween : 0;
      const y = isTop ? y1 - r : isBottom ? y1 - r - hBetween : 0;
      const dSq = x * x + y * y;

      if (dSq <= rPlusSq && dSq >= rMinusBzSq) {
        const dist = Math.sqrt(dSq);
        const distFromSide = r - dist;

        const opacity =
          dSq < rSq
            ? 1
            : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(rPlusSq) - Math.sqrt(rSq));

        const cos = x / dist;
        const sin = y / dist;
        const idx1D = ((distFromSide / bz) * bezel1D.length) | 0;
        const displacement = bezel1D[idx1D] ?? 0;

        const dX = (-cos * displacement) / maxDisplacement;
        const dY = (-sin * displacement) / maxDisplacement;

        const idx = (y1 * bw + x1) * 4;
        data[idx] = 128 + dX * 127 * opacity;
        data[idx + 1] = 128 + dY * 127 * opacity;
        data[idx + 2] = 0;
        data[idx + 3] = 255;
      }
    }
  }

  return { data, width: bw, height: bh, maxDisplacement };
}

/**
 * Generate a magnifying displacement map (uniform zoom toward center).
 */
export function generateMagnifyingMap(
  width: number,
  height: number,
  dpr: number = typeof window !== "undefined" ? window.devicePixelRatio ?? 1 : 1
): { data: Uint8ClampedArray; width: number; height: number } {
  const bw = width * dpr;
  const bh = height * dpr;
  const data = new Uint8ClampedArray(bw * bh * 4);
  const ratio = Math.max(bw / 2, bh / 2);

  for (let y1 = 0; y1 < bh; y1++) {
    for (let x1 = 0; x1 < bw; x1++) {
      const idx = (y1 * bw + x1) * 4;
      const rX = (x1 - bw / 2) / ratio;
      const rY = (y1 - bh / 2) / ratio;
      data[idx] = 128 - rX * 127;
      data[idx + 1] = 128 - rY * 127;
      data[idx + 2] = 0;
      data[idx + 3] = 255;
    }
  }

  return { data, width: bw, height: bh };
}
