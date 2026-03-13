import { describe, it, expect } from "vitest";
import { hexToRgb, rgbToHex, uniqueId, cn, clamp } from "../utils";

describe("hexToRgb", () => {
  it("converts standard hex colors", () => {
    expect(hexToRgb("#ffffff")).toBe("255, 255, 255");
    expect(hexToRgb("#000000")).toBe("0, 0, 0");
    expect(hexToRgb("#ff0000")).toBe("255, 0, 0");
    expect(hexToRgb("#3b82f6")).toBe("59, 130, 246");
  });

  it("handles hex without hash prefix", () => {
    expect(hexToRgb("ff00ff")).toBe("255, 0, 255");
  });

  it("is case-insensitive", () => {
    expect(hexToRgb("#AABBCC")).toBe("170, 187, 204");
    expect(hexToRgb("#aAbBcC")).toBe("170, 187, 204");
  });

  it("returns white fallback for invalid input", () => {
    expect(hexToRgb("invalid")).toBe("255, 255, 255");
    expect(hexToRgb("")).toBe("255, 255, 255");
    expect(hexToRgb("#gg0000")).toBe("255, 255, 255");
  });

  it("handles 3-char hex (no match - returns fallback)", () => {
    // The regex only matches 6-char hex
    expect(hexToRgb("#fff")).toBe("255, 255, 255");
  });
});

describe("rgbToHex", () => {
  it("converts rgb string to hex", () => {
    expect(rgbToHex("255, 255, 255")).toBe("#ffffff");
    expect(rgbToHex("0, 0, 0")).toBe("#000000");
    expect(rgbToHex("255, 0, 0")).toBe("#ff0000");
  });

  it("handles values without spaces", () => {
    expect(rgbToHex("59,130,246")).toBe("#3b82f6");
  });

  it("pads single-digit hex values", () => {
    expect(rgbToHex("0, 0, 0")).toBe("#000000");
    expect(rgbToHex("1, 2, 3")).toBe("#010203");
  });
});

describe("uniqueId", () => {
  it("returns a string starting with the prefix", () => {
    const id = uniqueId("test");
    expect(id).toMatch(/^test-\d+-[a-z0-9]+$/);
  });

  it("uses default prefix 'sg'", () => {
    const id = uniqueId();
    expect(id).toMatch(/^sg-/);
  });

  it("generates unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, () => uniqueId()));
    expect(ids.size).toBe(100);
  });
});

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("returns empty string for no truthy values", () => {
    expect(cn(false, null, undefined)).toBe("");
  });

  it("handles single class", () => {
    expect(cn("solo")).toBe("solo");
  });
});

describe("clamp", () => {
  it("clamps value to range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("handles edge cases", () => {
    expect(clamp(0, 0, 0)).toBe(0);
    expect(clamp(0, 0, 1)).toBe(0);
    expect(clamp(1, 0, 1)).toBe(1);
  });
});
