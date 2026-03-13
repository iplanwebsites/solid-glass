/**
 * Tests that all documented exports are available and work correctly.
 * This ensures the package.json exports map matches the actual code.
 */
import { describe, it, expect } from "vitest";

describe("main entry (solid-glass)", () => {
  it("exports Glass component", async () => {
    const mod = await import("../index");
    expect(mod.Glass).toBeDefined();
    // React components are objects (forwardRef)
    expect(typeof mod.Glass).toMatch(/function|object/);
  });

  it("exports useGlass hook", async () => {
    const mod = await import("../index");
    expect(mod.useGlass).toBeDefined();
    expect(typeof mod.useGlass).toBe("function");
  });

  it("exports all 8 effect generators", async () => {
    const mod = await import("../index");
    const effects = ["frosted", "crystal", "aurora", "smoke", "prism", "holographic", "thin", "liquid"];
    for (const effect of effects) {
      expect(mod[effect as keyof typeof mod]).toBeDefined();
      expect(typeof mod[effect as keyof typeof mod]).toBe("function");
    }
  });

  it("exports effects registry, getEffect, and effectRenderTiers", async () => {
    const mod = await import("../index");
    expect(mod.effects).toBeDefined();
    expect(mod.getEffect).toBeDefined();
    expect(typeof mod.getEffect).toBe("function");
    expect(mod.effectRenderTiers).toBeDefined();
    expect(typeof mod.effectRenderTiers).toBe("object");
  });

  it("exports detectRenderTier utility", async () => {
    const mod = await import("../index");
    expect(mod.detectRenderTier).toBeDefined();
    expect(typeof mod.detectRenderTier).toBe("function");
  });

  it("exports presets and presetNames", async () => {
    const mod = await import("../index");
    expect(mod.presets).toBeDefined();
    expect(mod.presetNames).toBeDefined();
    expect(Array.isArray(mod.presetNames)).toBe(true);
    expect(mod.presetNames.length).toBeGreaterThan(0);
  });

  it("exports utility functions", async () => {
    const mod = await import("../index");
    expect(mod.hexToRgb).toBeDefined();
    expect(mod.rgbToHex).toBeDefined();
    expect(mod.cn).toBeDefined();
  });
});

describe("solid-glass/effects", () => {
  it("exports all effect generators including liquid", async () => {
    const mod = await import("../effects");
    const effects = ["frosted", "crystal", "aurora", "smoke", "prism", "holographic", "thin", "liquid"];
    for (const effect of effects) {
      expect(mod[effect as keyof typeof mod]).toBeDefined();
      expect(typeof mod[effect as keyof typeof mod]).toBe("function");
    }
  });

  it("exports effects registry with 8 effects", async () => {
    const mod = await import("../effects");
    expect(mod.effects).toBeDefined();
    expect(Object.keys(mod.effects)).toHaveLength(8);
  });

  it("exports effectRenderTiers map", async () => {
    const mod = await import("../effects");
    expect(mod.effectRenderTiers).toBeDefined();
    expect(Object.keys(mod.effectRenderTiers)).toHaveLength(8);
  });
});

describe("solid-glass/presets", () => {
  it("exports presets object", async () => {
    const mod = await import("../presets");
    expect(mod.presets).toBeDefined();
    expect(typeof mod.presets).toBe("object");
  });

  it("exports presetNames array", async () => {
    const mod = await import("../presets");
    expect(mod.presetNames).toBeDefined();
    expect(Array.isArray(mod.presetNames)).toBe(true);
  });

  it("has expected preset names", async () => {
    const mod = await import("../presets");
    const expectedPresets = [
      "frostedLight", "frostedDark", "frostedBlue",
      "crystalClear", "crystalAmber",
      "auroraNorth", "auroraSunset",
      "smokeNoir", "smokeMist",
      "prismRainbow", "prismWarm",
      "holoCard", "holoSubtle",
      "thinLight", "thinDark",
    ];
    for (const name of expectedPresets) {
      expect(mod.presets[name as keyof typeof mod.presets]).toBeDefined();
      expect(mod.presetNames).toContain(name);
    }
  });

  it("each preset has effect and options", async () => {
    const mod = await import("../presets");
    for (const name of mod.presetNames) {
      const preset = mod.presets[name];
      expect(preset).toHaveProperty("effect");
      expect(preset).toHaveProperty("options");
      expect(typeof preset.effect).toBe("string");
      expect(typeof preset.options).toBe("object");
    }
  });
});

describe("solid-glass/react", () => {
  it("exports Glass component", async () => {
    const mod = await import("../react");
    expect(mod.Glass).toBeDefined();
    // React components are objects (forwardRef)
    expect(typeof mod.Glass).toMatch(/function|object/);
  });

  it("exports useGlass hook", async () => {
    const mod = await import("../react");
    expect(mod.useGlass).toBeDefined();
    expect(typeof mod.useGlass).toBe("function");
  });
});

describe("solid-glass/vanilla", () => {
  it("exports applyGlass function", async () => {
    const mod = await import("../vanilla");
    expect(mod.applyGlass).toBeDefined();
    expect(typeof mod.applyGlass).toBe("function");
  });
});

describe("solid-glass/engines/svg-refraction", () => {
  it("exports createLiquidGlass", async () => {
    const mod = await import("../engines/svg-refraction");
    expect(mod.createLiquidGlass).toBeDefined();
    expect(typeof mod.createLiquidGlass).toBe("function");
  });

  it("exports SURFACE_EQUATIONS", async () => {
    const mod = await import("../engines/svg-refraction");
    expect(mod.SURFACE_EQUATIONS).toBeDefined();
    expect(typeof mod.SURFACE_EQUATIONS).toBe("object");
  });

  // Note: createLiquidGlass uses canvas which isn't available in jsdom
  // These tests verify the function exists and has the right signature
  // Full integration tests require a real browser environment
  it("createLiquidGlass is callable (canvas not available in jsdom)", async () => {
    const mod = await import("../engines/svg-refraction");
    expect(typeof mod.createLiquidGlass).toBe("function");
    // Calling it would throw due to canvas, but the export is correct
  });

  it("exports SurfaceType and SURFACE_EQUATIONS", async () => {
    const mod = await import("../engines/svg-refraction");
    expect(mod.SURFACE_EQUATIONS).toBeDefined();
    const surfaces = ["convexCircle", "convexSquircle", "concave", "lip"];
    for (const s of surfaces) {
      expect(mod.SURFACE_EQUATIONS[s as keyof typeof mod.SURFACE_EQUATIONS]).toBeDefined();
    }
  });
});
