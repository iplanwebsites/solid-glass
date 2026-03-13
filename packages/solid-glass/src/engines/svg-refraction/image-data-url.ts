/**
 * Convert raw RGBA pixel data to a data URL for use in SVG feImage elements.
 */
export function pixelDataToUrl(
  data: Uint8ClampedArray,
  width: number,
  height: number
): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas 2d context");
  const imageData = new ImageData(data, width, height);
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}
