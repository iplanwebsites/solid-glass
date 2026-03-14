import { describe, it, expect } from "vitest";
import { renderGlass } from "../render-glass";
import { templateRenderTiers } from "../templates";

describe("renderGlass — frosted", () => {
  it("returns correct className", () => {
    const result = renderGlass("frosted");
    expect(result.className).toBe("sg-frosted");
  });

  it("applies default CSS variables", () => {
    const result = renderGlass("frosted");
    expect(result.cssVars["--sg-blur"]).toBe("12px");
    expect(result.cssVars["--sg-tint-rgb"]).toBe("255, 255, 255");
    expect(result.cssVars["--sg-tint-opacity"]).toBe(0.08);
    expect(result.cssVars["--sg-shadow-blur"]).toBe("6px");
    expect(result.cssVars["--sg-radius"]).toBe("16px");
    expect(result.cssVars["--sg-opacity"]).toBe(1);
  });

  it("overrides defaults with custom options", () => {
    const result = renderGlass("frosted", { blur: 20, borderRadius: 32, tintOpacity: 0.5 });
    expect(result.cssVars["--sg-blur"]).toBe("20px");
    expect(result.cssVars["--sg-radius"]).toBe("32px");
    expect(result.cssVars["--sg-tint-opacity"]).toBe(0.5);
  });

  it("converts hex tint color to RGB", () => {
    const result = renderGlass("frosted", { tintColor: "#3b82f6" });
    expect(result.cssVars["--sg-tint-rgb"]).toBe("59, 130, 246");
  });

  it("does not produce an SVG filter", () => {
    const result = renderGlass("frosted");
    expect(result.svgFilter).toBeUndefined();
  });

  it("reports css renderTier", () => {
    expect(renderGlass("frosted").renderTier).toBe("css");
  });
});

describe("renderGlass — crystal", () => {
  it("returns correct className", () => {
    expect(renderGlass("crystal").className).toBe("sg-crystal");
  });

  it("produces SVG filter with correct attributes", () => {
    const result = renderGlass("crystal", { noiseFrequency: 0.01, distortion: 80, noiseOctaves: 3, noiseSeed: 99 });
    expect(result.svgFilter).toBeDefined();
    expect(result.svgFilter).toContain("feTurbulence");
    expect(result.svgFilter).toContain("feDisplacementMap");
    expect(result.svgFilter).toContain('baseFrequency="0.01 0.01"');
    expect(result.svgFilter).toContain('numOctaves="3"');
    expect(result.svgFilter).toContain('seed="99"');
    expect(result.svgFilter).toContain('scale="80"');
  });

  it("sets --sg-filter-id referencing the SVG filter", () => {
    const result = renderGlass("crystal");
    expect(result.cssVars["--sg-filter-id"]).toMatch(/^url\(#sg-crystal-/);
  });

  it("applies default blur", () => {
    expect(renderGlass("crystal").cssVars["--sg-blur"]).toBe("8px");
  });
});

describe("renderGlass — aurora", () => {
  it("returns correct className", () => {
    expect(renderGlass("aurora").className).toBe("sg-aurora");
  });

  it("builds gradient from default colors", () => {
    const result = renderGlass("aurora");
    expect(result.cssVars["--sg-aurora-gradient"]).toContain("linear-gradient");
    expect(result.cssVars["--sg-aurora-gradient"]).toContain("#a78bfa");
  });

  it("uses custom colors and angle", () => {
    const result = renderGlass("aurora", { colors: ["red", "blue"], gradientAngle: 45 });
    expect(result.cssVars["--sg-aurora-gradient"]).toBe("linear-gradient(45deg, red, blue)");
  });

  it("sets animation speed", () => {
    const result = renderGlass("aurora", { animationSpeed: 15 });
    expect(result.cssVars["--sg-aurora-speed"]).toBe("15s");
  });

  it("does not produce an SVG filter", () => {
    expect(renderGlass("aurora").svgFilter).toBeUndefined();
  });
});

describe("renderGlass — smoke", () => {
  it("returns correct className", () => {
    expect(renderGlass("smoke").className).toBe("sg-smoke");
  });

  it("produces SVG filter with animation", () => {
    const result = renderGlass("smoke", { animated: true, animationSpeed: 20 });
    expect(result.svgFilter).toContain("animate");
    expect(result.svgFilter).toContain('dur="20s"');
    expect(result.svgFilter).toContain('repeatCount="indefinite"');
  });

  it("disables animation when animated=false", () => {
    const result = renderGlass("smoke", { animated: false });
    expect(result.svgFilter).toContain('repeatCount="0"');
  });

  it("applies default blur of 20px", () => {
    expect(renderGlass("smoke").cssVars["--sg-blur"]).toBe("20px");
  });
});

describe("renderGlass — prism", () => {
  it("returns correct className", () => {
    expect(renderGlass("prism").className).toBe("sg-prism");
  });

  it("applies default values", () => {
    const result = renderGlass("prism");
    expect(result.cssVars["--sg-prism-hue"]).toBe("0deg");
    expect(result.cssVars["--sg-prism-saturate"]).toBe(1.2);
    expect(result.cssVars["--sg-prism-brightness"]).toBe(1.05);
    expect(result.cssVars["--sg-prism-contrast"]).toBe(1.1);
  });

  it("accepts custom hue rotation", () => {
    const result = renderGlass("prism", { hueRotate: 90 });
    expect(result.cssVars["--sg-prism-hue"]).toBe("90deg");
  });

  it("does not produce SVG filter", () => {
    expect(renderGlass("prism").svgFilter).toBeUndefined();
  });
});

describe("renderGlass — holographic", () => {
  it("returns correct className", () => {
    expect(renderGlass("holographic").className).toBe("sg-holographic");
  });

  it("builds gradient from colors", () => {
    const result = renderGlass("holographic", { colors: ["#ff0000", "#00ff00"] });
    expect(result.cssVars["--sg-holo-gradient"]).toBe("linear-gradient(135deg, #ff0000, #00ff00)");
  });

  it("sets iridescence and speed", () => {
    const result = renderGlass("holographic", { colorOpacity: 0.8, animationSpeed: 3 });
    expect(result.cssVars["--sg-holo-iridescence"]).toBe(0.8);
    expect(result.cssVars["--sg-holo-speed"]).toBe("3s");
  });
});

describe("renderGlass — thin", () => {
  it("returns sg-thin className", () => {
    expect(renderGlass("thin").className).toBe("sg-thin");
  });

  it("adds sg-thin-dark class when colorScheme=dark", () => {
    expect(renderGlass("thin", { colorScheme: "dark" }).className).toContain("sg-thin-dark");
  });

  it("uses white RGB base by default", () => {
    expect(renderGlass("thin").cssVars["--sg-thin-bg-rgb"]).toBe("255, 255, 255");
  });

  it("uses black RGB base in dark mode", () => {
    expect(renderGlass("thin", { colorScheme: "dark" }).cssVars["--sg-thin-bg-rgb"]).toBe("0, 0, 0");
  });

  it("applies default blur of 4px", () => {
    expect(renderGlass("thin").cssVars["--sg-blur"]).toBe("4px");
  });
});

describe("renderGlass — refraction", () => {
  it("returns needs-measure class when no dimensions", () => {
    const result = renderGlass("refraction");
    expect(result.className).toContain("sg-refraction--needs-measure");
  });

  it("reports svg-backdrop renderTier", () => {
    expect(templateRenderTiers.refraction).toBe("svg-backdrop");
  });
});

describe("renderTier annotations", () => {
  it("CSS-only templates report css tier", () => {
    expect(renderGlass("frosted").renderTier).toBe("css");
    expect(renderGlass("aurora").renderTier).toBe("css");
    expect(renderGlass("prism").renderTier).toBe("css");
    expect(renderGlass("holographic").renderTier).toBe("css");
    expect(renderGlass("thin").renderTier).toBe("css");
  });

  it("SVG filter templates report svg-filter tier", () => {
    expect(renderGlass("crystal").renderTier).toBe("svg-filter");
    expect(renderGlass("smoke").renderTier).toBe("svg-filter");
  });

  it("templateRenderTiers maps all templates", () => {
    const names = Object.keys(templateRenderTiers);
    expect(names).toHaveLength(8);
    expect(names).toEqual(
      expect.arrayContaining(["frosted", "crystal", "aurora", "smoke", "prism", "holographic", "thin", "refraction"])
    );
  });
});

describe("animation controls", () => {
  it("sets paused state", () => {
    const result = renderGlass("aurora", { paused: true });
    expect(result.cssVars["--sg-animation-state"]).toBe("paused");
  });

  it("generates bouncy easing", () => {
    const result = renderGlass("aurora", { bounciness: 0.5 });
    expect(result.cssVars["--sg-animation-easing"]).toContain("cubic-bezier");
  });

  it("applies custom easing", () => {
    const result = renderGlass("aurora", { animationEasing: "linear" });
    expect(result.cssVars["--sg-animation-easing"]).toBe("linear");
  });

  it("does not set easing for default ease", () => {
    const result = renderGlass("aurora", { animationEasing: "ease" });
    expect(result.cssVars["--sg-animation-easing"]).toBeUndefined();
  });
});

describe("template presets", () => {
  it("resolves frostedDark preset", () => {
    const result = renderGlass("frostedDark");
    expect(result.className).toBe("sg-frosted");
    expect(result.cssVars["--sg-blur"]).toBe("14px");
  });

  it("resolves auroraNorth preset", () => {
    const result = renderGlass("auroraNorth");
    expect(result.className).toBe("sg-aurora");
    expect(result.cssVars["--sg-aurora-speed"]).toBe("10s");
  });

  it("allows overrides on top of presets", () => {
    const result = renderGlass("frostedDark", { blur: 30 });
    expect(result.cssVars["--sg-blur"]).toBe("30px");
  });
});

describe("default template", () => {
  it("uses frosted when no template specified", () => {
    const result = renderGlass();
    expect(result.className).toBe("sg-frosted");
  });
});
