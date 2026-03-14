/**
 * Tests that all documented exports are available and work correctly.
 */
import { describe, it, expect } from "vitest";

describe("main entry (solid-glass)", () => {
  it("exports Glass component", async () => {
    const mod = await import("../index");
    expect(mod.Glass).toBeDefined();
    expect(typeof mod.Glass).toMatch(/function|object/);
  });

  it("exports useGlass hook", async () => {
    const mod = await import("../index");
    expect(mod.useGlass).toBeDefined();
    expect(typeof mod.useGlass).toBe("function");
  });

  it("exports renderGlass", async () => {
    const mod = await import("../index");
    expect(mod.renderGlass).toBeDefined();
    expect(typeof mod.renderGlass).toBe("function");
  });

  it("exports templates and templateNames", async () => {
    const mod = await import("../index");
    expect(mod.templates).toBeDefined();
    expect(mod.templateNames).toBeDefined();
    expect(Array.isArray(mod.templateNames)).toBe(true);
    expect(mod.templateNames.length).toBe(8);
  });

  it("exports templatePresets and templatePresetNames", async () => {
    const mod = await import("../index");
    expect(mod.templatePresets).toBeDefined();
    expect(mod.templatePresetNames).toBeDefined();
    expect(Array.isArray(mod.templatePresetNames)).toBe(true);
    expect(mod.templatePresetNames.length).toBeGreaterThan(0);
  });

  it("exports resolveTemplate", async () => {
    const mod = await import("../index");
    expect(mod.resolveTemplate).toBeDefined();
    expect(typeof mod.resolveTemplate).toBe("function");
  });

  it("exports DOM utilities", async () => {
    const mod = await import("../index");
    expect(mod.injectSvgFilter).toBeDefined();
    expect(mod.ensureStyles).toBeDefined();
  });

  it("exports detectRenderTier utility", async () => {
    const mod = await import("../index");
    expect(mod.detectRenderTier).toBeDefined();
    expect(typeof mod.detectRenderTier).toBe("function");
  });

  it("exports color utilities", async () => {
    const mod = await import("../index");
    expect(mod.hexToRgb).toBeDefined();
    expect(mod.rgbToHex).toBeDefined();
  });
});

describe("solid-glass/templates", () => {
  it("exports templates object with 8 base templates", async () => {
    const mod = await import("../templates");
    expect(mod.templates).toBeDefined();
    expect(Object.keys(mod.templates)).toHaveLength(8);
  });

  it("exports templatePresets", async () => {
    const mod = await import("../templates");
    expect(mod.templatePresets).toBeDefined();
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
      expect(mod.templatePresets[name as keyof typeof mod.templatePresets]).toBeDefined();
    }
  });

  it("exports resolveTemplate function", async () => {
    const mod = await import("../templates");
    expect(typeof mod.resolveTemplate).toBe("function");
  });
});

describe("solid-glass/react", () => {
  it("exports Glass component", async () => {
    const mod = await import("../react");
    expect(mod.Glass).toBeDefined();
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
    const surfaces = ["convexCircle", "convexSquircle", "concave", "lip"];
    for (const s of surfaces) {
      expect(mod.SURFACE_EQUATIONS[s as keyof typeof mod.SURFACE_EQUATIONS]).toBeDefined();
    }
  });
});
