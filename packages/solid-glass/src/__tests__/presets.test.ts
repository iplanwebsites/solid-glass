import { describe, it, expect } from "vitest";
import {
  templates,
  templatePresets,
  templateNames,
  templatePresetNames,
  resolveTemplate,
  templateRenderTiers,
} from "../templates";
import { renderGlass } from "../render-glass";

describe("templates", () => {
  it("exports 8 base templates", () => {
    expect(templateNames).toHaveLength(8);
    expect(templateNames).toEqual(
      expect.arrayContaining(["frosted", "crystal", "aurora", "smoke", "prism", "holographic", "thin", "refraction"])
    );
  });

  it("templateNames matches Object.keys(templates)", () => {
    expect(templateNames).toEqual(Object.keys(templates));
  });

  it("every template has valid options", () => {
    for (const name of templateNames) {
      const t = templates[name];
      expect(typeof t).toBe("object");
      expect(t).not.toBeNull();
    }
  });

  it("every base template can be rendered", () => {
    for (const name of templateNames) {
      if (name === "refraction") continue; // needs canvas
      const result = renderGlass(name);
      expect(result.className).toBeTruthy();
      expect(Object.keys(result.cssVars).length).toBeGreaterThan(0);
    }
  });
});

describe("templatePresets", () => {
  it("exports non-empty presets", () => {
    expect(templatePresetNames.length).toBeGreaterThan(0);
  });

  it("templatePresetNames matches Object.keys(templatePresets)", () => {
    expect(templatePresetNames).toEqual(Object.keys(templatePresets));
  });

  it("every preset has a valid base template", () => {
    for (const name of templatePresetNames) {
      const preset = templatePresets[name];
      expect(templateNames).toContain(preset.base);
    }
  });

  it("every preset has overrides object", () => {
    for (const name of templatePresetNames) {
      const preset = templatePresets[name];
      expect(typeof preset.overrides).toBe("object");
      expect(preset.overrides).not.toBeNull();
    }
  });

  it("every non-refraction preset can be rendered", () => {
    for (const name of templatePresetNames) {
      const preset = templatePresets[name];
      if (preset.base === "refraction") continue;
      const result = renderGlass(name);
      expect(result.className).toBeTruthy();
      expect(Object.keys(result.cssVars).length).toBeGreaterThan(0);
    }
  });

  it("contains at least one preset per base template (excluding refraction)", () => {
    const bases = new Set(templatePresetNames.map((n) => templatePresets[n].base));
    for (const name of templateNames) {
      if (name === "refraction") continue;
      expect(bases.has(name)).toBe(true);
    }
  });
});

describe("resolveTemplate", () => {
  it("resolves base templates", () => {
    const { base, options } = resolveTemplate("frosted");
    expect(base).toBe("frosted");
    expect(options.blur).toBe(12);
  });

  it("resolves preset names", () => {
    const { base, options } = resolveTemplate("frostedDark");
    expect(base).toBe("frosted");
    expect(options.tintColor).toBe("#000000");
    expect(options.blur).toBe(14);
  });

  it("merges preset overrides on top of base", () => {
    const { options } = resolveTemplate("auroraNorth");
    expect(options.colors).toEqual(["#a78bfa", "#818cf8", "#6ee7b7"]);
    expect(options.animationSpeed).toBe(10);
    // Should still have base blur
    expect(options.blur).toBe(16);
  });
});

describe("templateRenderTiers", () => {
  it("maps all 8 templates", () => {
    expect(Object.keys(templateRenderTiers)).toHaveLength(8);
  });

  it("CSS templates are correct", () => {
    expect(templateRenderTiers.frosted).toBe("css");
    expect(templateRenderTiers.aurora).toBe("css");
    expect(templateRenderTiers.prism).toBe("css");
    expect(templateRenderTiers.holographic).toBe("css");
    expect(templateRenderTiers.thin).toBe("css");
  });

  it("SVG filter templates are correct", () => {
    expect(templateRenderTiers.crystal).toBe("svg-filter");
    expect(templateRenderTiers.smoke).toBe("svg-filter");
    expect(templateRenderTiers.refraction).toBe("svg-filter");
  });
});
