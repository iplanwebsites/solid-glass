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

import type { RenderTier } from "./types";

/**
 * Detect the highest rendering tier supported by the current browser.
 *
 * - `"webgl"` — WebGL 2 or WebGPU available (future shader effects)
 * - `"svg-backdrop"` — SVG filters in `backdrop-filter: url()` are supported (Chromium 113+)
 * - `"svg-filter"` — SVG filters via CSS `filter: url()` (all modern browsers)
 * - `"css"` — Basic CSS `backdrop-filter` support (Safari, Firefox, Chrome)
 *
 * Returns `"css"` in non-browser environments (SSR).
 */
export function detectRenderTier(): RenderTier {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "css";
  }

  // Check WebGL / WebGPU availability
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (gl || "gpu" in navigator) {
      // WebGL is available, but we also check for SVG filter backdrop support
      // since that's the current highest-fidelity path we actually use
    }
  } catch {
    // WebGL not available
  }

  // Check SVG filter in backdrop-filter support (Chromium 113+)
  // by testing if backdrop-filter accepts a url() value
  try {
    const el = document.createElement("div");
    el.style.backdropFilter = "url(#test)";
    if (el.style.backdropFilter.includes("url")) {
      return "svg-backdrop";
    }
  } catch {
    // Not supported
  }

  // svg-filter tier (CSS filter: url()) is supported in all modern browsers,
  // but we return "css" here since we only use this function to gate
  // svg-backdrop features. The svg-filter tier doesn't need runtime detection.
  return "css";
}
