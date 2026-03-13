import { describe, it, expect } from "vitest";
import { presets, presetNames } from "../presets";
import { effects } from "../effects";

describe("presets", () => {
  it("exports a non-empty set of presets", () => {
    expect(presetNames.length).toBeGreaterThan(0);
  });

  it("presetNames matches Object.keys(presets)", () => {
    expect(presetNames).toEqual(Object.keys(presets));
  });

  it("every preset has a valid effect name", () => {
    const validEffects = Object.keys(effects);
    for (const name of presetNames) {
      expect(validEffects).toContain(presets[name].effect);
    }
  });

  it("every preset has an options object", () => {
    for (const name of presetNames) {
      const preset = presets[name];
      expect(typeof preset.options).toBe("object");
      expect(preset.options).not.toBeNull();
    }
  });

  it("every preset can be applied through its effect generator", () => {
    for (const name of presetNames) {
      const preset = presets[name];
      const gen = effects[preset.effect];
      const result = gen(preset.options);
      expect(result.className).toBeTruthy();
      expect(Object.keys(result.cssVars).length).toBeGreaterThan(0);
    }
  });

  it("contains at least one preset per effect type", () => {
    const effectsCovered = new Set(presetNames.map((n) => presets[n].effect));
    for (const effectName of Object.keys(effects)) {
      expect(effectsCovered.has(effectName as never)).toBe(true);
    }
  });
});
