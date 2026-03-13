/**
 * Specular highlight generation for glass surface rim lighting.
 *
 * Based on the approach by Kube (Chris Feijoo):
 * https://kube.io/blog/liquid-glass-css-svg
 * https://github.com/kube/kube.io
 *
 * Generates a specular highlight image based on the dot product of
 * the surface normal with a fixed light direction.
 */

export function generateSpecularMap(opts: {
  width: number;
  height: number;
  radius: number;
  bezelWidth: number;
  specularAngle?: number;
  dpr?: number;
}): { data: Uint8ClampedArray; width: number; height: number } {
  const {
    width,
    height,
    radius,
    bezelWidth,
    specularAngle = Math.PI / 3,
    dpr = typeof window !== "undefined" ? window.devicePixelRatio ?? 1 : 1,
  } = opts;

  const bw = width * dpr;
  const bh = height * dpr;
  const data = new Uint8ClampedArray(bw * bh * 4);

  const r = radius * dpr;
  const bz = bezelWidth * dpr;
  const specVec = [Math.cos(specularAngle), Math.sin(specularAngle)];

  // Fill transparent
  data.fill(0);

  const rSq = r ** 2;
  const rPlusSq = (r + dpr) ** 2;
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
        const sin = -y / dist;
        const dotProduct = Math.abs(cos * specVec[0] + sin * specVec[1]);
        const coefficient =
          dotProduct * Math.sqrt(1 - (1 - distFromSide / dpr) ** 2);

        const color = 255 * coefficient;
        const finalOpacity = color * coefficient * opacity;

        const idx = (y1 * bw + x1) * 4;
        data[idx] = color;
        data[idx + 1] = color;
        data[idx + 2] = color;
        data[idx + 3] = finalOpacity;
      }
    }
  }

  return { data, width: bw, height: bh };
}
