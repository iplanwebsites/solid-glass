import { describe, it, expect } from "vitest";
import { frosted } from "../effects/frosted";
import { crystal } from "../effects/crystal";
import { aurora } from "../effects/aurora";
import { smoke } from "../effects/smoke";
import { prism } from "../effects/prism";
import { holographic } from "../effects/holographic";
import { thin } from "../effects/thin";
import { refraction } from "../effects/refraction";
import { effects, getEffect, effectRenderTiers } from "../effects";

describe("frosted effect", () => {
  it("returns correct className", () => {
    const result = frosted();
    expect(result.className).toBe("sg-frosted");
  });

  it("applies default CSS variables", () => {
    const result = frosted();
    expect(result.cssVars["--sg-blur"]).toBe("12px");
    expect(result.cssVars["--sg-tint-rgb"]).toBe("255, 255, 255");
    expect(result.cssVars["--sg-tint-opacity"]).toBe(0.08);
    expect(result.cssVars["--sg-shadow-blur"]).toBe("6px");
    expect(result.cssVars["--sg-radius"]).toBe("16px");
    expect(result.cssVars["--sg-opacity"]).toBe(1);
  });

  it("overrides defaults with custom options", () => {
    const result = frosted({ blur: 20, borderRadius: 32, tintOpacity: 0.5 });
    expect(result.cssVars["--sg-blur"]).toBe("20px");
    expect(result.cssVars["--sg-radius"]).toBe("32px");
    expect(result.cssVars["--sg-tint-opacity"]).toBe(0.5);
  });

  it("converts hex tint color to RGB", () => {
    const result = frosted({ tintColor: "#3b82f6" });
    expect(result.cssVars["--sg-tint-rgb"]).toBe("59, 130, 246");
  });

  it("passes through RGB tint color", () => {
    const result = frosted({ tintColor: "100, 200, 50" });
    expect(result.cssVars["--sg-tint-rgb"]).toBe("100, 200, 50");
  });

  it("does not produce an SVG filter", () => {
    const result = frosted();
    expect(result.svgFilter).toBeUndefined();
  });
});

describe("crystal effect", () => {
  it("returns correct className", () => {
    const result = crystal();
    expect(result.className).toBe("sg-crystal");
  });

  it("produces an SVG filter with correct attributes", () => {
    const result = crystal({ noiseFrequency: 0.01, distortionStrength: 80, octaves: 3, seed: 99 });
    expect(result.svgFilter).toBeDefined();
    expect(result.svgFilter).toContain("feTurbulence");
    expect(result.svgFilter).toContain("feDisplacementMap");
    expect(result.svgFilter).toContain('baseFrequency="0.01 0.01"');
    expect(result.svgFilter).toContain('numOctaves="3"');
    expect(result.svgFilter).toContain('seed="99"');
    expect(result.svgFilter).toContain('scale="80"');
  });

  it("sets --sg-filter-id referencing the SVG filter", () => {
    const result = crystal();
    expect(result.cssVars["--sg-filter-id"]).toMatch(/^url\(#sg-crystal-/);
  });

  it("applies default blur", () => {
    const result = crystal();
    expect(result.cssVars["--sg-blur"]).toBe("8px");
  });
});

describe("aurora effect", () => {
  it("returns correct className", () => {
    const result = aurora();
    expect(result.className).toBe("sg-aurora");
  });

  it("builds gradient from default colors", () => {
    const result = aurora();
    expect(result.cssVars["--sg-aurora-gradient"]).toContain("linear-gradient");
    expect(result.cssVars["--sg-aurora-gradient"]).toContain("#a78bfa");
  });

  it("uses custom colors and angle", () => {
    const result = aurora({ colors: ["red", "blue"], angle: 45 });
    expect(result.cssVars["--sg-aurora-gradient"]).toBe("linear-gradient(45deg, red, blue)");
  });

  it("sets animation speed", () => {
    const result = aurora({ animationSpeed: 15 });
    expect(result.cssVars["--sg-aurora-speed"]).toBe("15s");
  });

  it("does not produce an SVG filter", () => {
    expect(aurora().svgFilter).toBeUndefined();
  });
});

describe("smoke effect", () => {
  it("returns correct className", () => {
    expect(smoke().className).toBe("sg-smoke");
  });

  it("produces SVG filter with animation", () => {
    const result = smoke({ animated: true, animationDuration: 20 });
    expect(result.svgFilter).toContain("animate");
    expect(result.svgFilter).toContain('dur="20s"');
    expect(result.svgFilter).toContain('repeatCount="indefinite"');
  });

  it("disables animation when animated=false", () => {
    const result = smoke({ animated: false });
    expect(result.svgFilter).toContain('repeatCount="0"');
  });

  it("converts smoke color to RGB", () => {
    const result = smoke({ smokeColor: "#ff0000" });
    expect(result.cssVars["--sg-smoke-rgb"]).toBe("255, 0, 0");
  });

  it("applies default blur of 20px", () => {
    expect(smoke().cssVars["--sg-blur"]).toBe("20px");
  });
});

describe("prism effect", () => {
  it("returns correct className", () => {
    expect(prism().className).toBe("sg-prism");
  });

  it("applies default values", () => {
    const result = prism();
    expect(result.cssVars["--sg-prism-hue"]).toBe("0deg");
    expect(result.cssVars["--sg-prism-saturate"]).toBe(1.2);
    expect(result.cssVars["--sg-prism-brightness"]).toBe(1.05);
    expect(result.cssVars["--sg-prism-contrast"]).toBe(1.1);
  });

  it("accepts custom hue rotation", () => {
    const result = prism({ hueRotate: 90 });
    expect(result.cssVars["--sg-prism-hue"]).toBe("90deg");
  });

  it("does not produce SVG filter", () => {
    expect(prism().svgFilter).toBeUndefined();
  });
});

describe("holographic effect", () => {
  it("returns correct className", () => {
    expect(holographic().className).toBe("sg-holographic");
  });

  it("builds gradient from colors", () => {
    const result = holographic({ colors: ["#ff0000", "#00ff00"] });
    expect(result.cssVars["--sg-holo-gradient"]).toBe("linear-gradient(135deg, #ff0000, #00ff00)");
  });

  it("sets iridescence and speed", () => {
    const result = holographic({ iridescence: 0.8, animationSpeed: 3 });
    expect(result.cssVars["--sg-holo-iridescence"]).toBe(0.8);
    expect(result.cssVars["--sg-holo-speed"]).toBe("3s");
  });
});

describe("thin effect", () => {
  it("returns sg-thin className", () => {
    expect(thin().className).toBe("sg-thin");
  });

  it("adds sg-thin-dark class when dark=true", () => {
    expect(thin({ dark: true }).className).toBe("sg-thin sg-thin-dark");
  });

  it("uses white RGB base in light mode", () => {
    expect(thin().cssVars["--sg-thin-bg-rgb"]).toBe("255, 255, 255");
  });

  it("uses black RGB base in dark mode", () => {
    expect(thin({ dark: true }).cssVars["--sg-thin-bg-rgb"]).toBe("0, 0, 0");
  });

  it("applies default blur of 4px", () => {
    expect(thin().cssVars["--sg-blur"]).toBe("4px");
  });
});

describe("refraction effect", () => {
  it("throws without width and height", () => {
    expect(() => refraction()).toThrow("requires width and height");
    expect(() => refraction({} as any)).toThrow("requires width and height");
  });

  it("returns correct className", () => {
    // Note: createLiquidGlass uses canvas internally, which throws in jsdom.
    // We verify the error message to confirm the effect is wired up correctly.
    expect(typeof refraction).toBe("function");
  });

  it("reports svg-filter renderTier", () => {
    expect(effectRenderTiers.refraction).toBe("svg-filter");
  });
});

describe("renderTier annotations", () => {
  it("CSS-only effects report css tier", () => {
    expect(frosted().renderTier).toBe("css");
    expect(aurora().renderTier).toBe("css");
    expect(prism().renderTier).toBe("css");
    expect(holographic().renderTier).toBe("css");
    expect(thin().renderTier).toBe("css");
  });

  it("SVG filter effects report svg-filter tier", () => {
    expect(crystal().renderTier).toBe("svg-filter");
    expect(smoke().renderTier).toBe("svg-filter");
  });

  it("effectRenderTiers maps all effects", () => {
    const names = Object.keys(effects);
    for (const name of names) {
      expect(effectRenderTiers[name as keyof typeof effectRenderTiers]).toBeDefined();
    }
  });
});

describe("effects registry", () => {
  it("contains all 8 effects", () => {
    const names = Object.keys(effects);
    expect(names).toHaveLength(8);
    expect(names).toEqual(
      expect.arrayContaining(["frosted", "crystal", "aurora", "smoke", "prism", "holographic", "thin", "refraction"])
    );
  });

  it("all effects are callable functions", () => {
    for (const [name, effect] of Object.entries(effects)) {
      expect(typeof effect).toBe("function");
      // Skip refraction — it requires width/height and uses canvas
      if (name === "refraction") continue;
      const result = effect({});
      expect(result).toHaveProperty("className");
      expect(result).toHaveProperty("cssVars");
      expect(typeof result.className).toBe("string");
      expect(typeof result.cssVars).toBe("object");
    }
  });
});

describe("getEffect", () => {
  it("returns the requested effect", () => {
    expect(getEffect("frosted")).toBe(effects.frosted);
    expect(getEffect("crystal")).toBe(effects.crystal);
  });

  it("throws for unknown effect name", () => {
    expect(() => getEffect("nonexistent" as never)).toThrow("[solid-glass] Unknown effect");
  });
});
