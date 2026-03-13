/** Convert hex color to "r, g, b" string */
export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "255, 255, 255";
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

/** Convert "r, g, b" string to hex */
export function rgbToHex(rgb: string): string {
  const parts = rgb.split(",").map((p) => parseInt(p.trim()));
  return "#" + parts.map((p) => p.toString(16).padStart(2, "0")).join("");
}

/** Generate a unique ID for SVG filters */
let counter = 0;
export function uniqueId(prefix = "sg"): string {
  return `${prefix}-${++counter}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Merge class names, filtering falsy values */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
