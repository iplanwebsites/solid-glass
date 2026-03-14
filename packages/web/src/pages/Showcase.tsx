import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Glass, type GlassEffectName, presets, type PresetName, presetNames, effectRenderTiers } from "solid-glass";
import { createLiquidGlass, type SurfaceType, SURFACE_EQUATIONS } from "solid-glass/engines/svg-refraction";
import { Copy, Check, RotateCcw, Image, Sparkles, Gem } from "lucide-react";
import { CodeBlock } from "../components/CodeBlock";

/* ─── Framework Code Generators ─── */
type Framework = "react" | "vue" | "vanilla";

function generateReactSnippet(effect: string, options: Record<string, unknown>) {
  return `import { Glass } from "solid-glass/react";
import "solid-glass/css";

<Glass effect="${effect}" options={${JSON.stringify(options, null, 2)}}>
  {children}
</Glass>`;
}

function generateVueSnippet(effect: string, options: Record<string, unknown>) {
  const optStr = JSON.stringify(options, null, 2).replace(/"/g, "'");
  return `<template>
  <Glass effect="${effect}" :options="${optStr}">
    <slot />
  </Glass>
</template>

<script setup>
import { Glass } from "solid-glass/vue";
import "solid-glass/css";
</script>`;
}

function generateVanillaSnippet(effect: string, options: Record<string, unknown>) {
  return `import { applyGlass } from "solid-glass/vanilla";
import "solid-glass/css";

const el = document.querySelector("#my-card");
const cleanup = applyGlass(el, "${effect}", ${JSON.stringify(options, null, 2)});

// Later: cleanup();`;
}

function generateLiquidSnippet(liquidOpts: Record<string, unknown>) {
  return `import { createLiquidGlass } from "solid-glass/engines/svg-refraction";

const glass = createLiquidGlass(${JSON.stringify(liquidOpts, null, 2)});

// Inject SVG filter into DOM
document.body.insertAdjacentHTML("beforeend", glass.svgFilter);

// Apply as backdrop-filter (Chromium only)
element.style.backdropFilter = glass.filterRef;`;
}

function getSnippet(framework: Framework, effect: string, options: Record<string, unknown>) {
  if (framework === "vue") return generateVueSnippet(effect, options);
  if (framework === "vanilla") return generateVanillaSnippet(effect, options);
  return generateReactSnippet(effect, options);
}

/* ─── Framework Tab Bar ─── */
const FRAMEWORKS: { key: Framework; label: string }[] = [
  { key: "react", label: "React" },
  { key: "vue", label: "Vue" },
  { key: "vanilla", label: "Vanilla JS" },
];

function FrameworkTabs({ active, onChange }: { active: Framework; onChange: (f: Framework) => void }) {
  return (
    <div className="flex gap-1">
      {FRAMEWORKS.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${active === f.key ? "bg-slate-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Render Tier Badge ─── */
function TierBadge({ effect }: { effect: GlassEffectName }) {
  const tier = effectRenderTiers[effect];
  if (tier === "svg-filter") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5">
        <Gem size={10} /> SVG Filter
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full px-2 py-0.5">
      <Sparkles size={10} /> CSS
    </span>
  );
}

/* ─── Shared Data ─── */
const ALL_EFFECTS: GlassEffectName[] = ["frosted", "crystal", "aurora", "smoke", "prism", "holographic", "thin", "liquid"];
const CSS_EFFECTS: GlassEffectName[] = ["frosted", "crystal", "aurora", "smoke", "prism", "holographic", "thin"];

const GRADIENT_BGS = [
  "from-blue-600 via-violet-600 to-fuchsia-600",
  "from-emerald-600 via-teal-600 to-cyan-600",
  "from-orange-600 via-red-600 to-pink-600",
  "from-slate-700 via-slate-800 to-slate-900",
];

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
];

/* ─── Templates (all effects including liquid) ─── */
const TEMPLATES: {
  name: string;
  effect: GlassEffectName;
  options: Record<string, unknown>;
  surface?: SurfaceType;
  description: string;
}[] = [
  { name: "Frosted Light", effect: "frosted", options: { blur: 12, tintColor: "#ffffff", tintOpacity: 0.1 }, description: "Classic light frosted glass." },
  { name: "Frosted Dark", effect: "frosted", options: { blur: 14, tintColor: "#000000", tintOpacity: 0.2, shadowColor: "rgba(0,0,0,0.3)" }, description: "Dark mode frosted variant." },
  { name: "Crystal Clear", effect: "crystal", options: { blur: 6, noiseFrequency: 0.006, distortionStrength: 40 }, description: "Subtle refraction." },
  { name: "Crystal Cyan", effect: "crystal", options: { blur: 7, borderRadius: 4, tintOpacity: 0.23, noiseFrequency: 0.032, distortionStrength: 40, tintColor: "#0ad9f5" }, description: "Vivid cyan refraction." },
  { name: "Aurora North", effect: "aurora", options: { colors: ["#a78bfa", "#818cf8", "#6ee7b7"] }, description: "Northern Lights gradient." },
  { name: "Smoke Noir", effect: "smoke", options: { blur: 24, density: 0.4, smokeColor: "#000000" }, description: "Deep dark smoke." },
  { name: "Prism Rainbow", effect: "prism", options: { blur: 8, saturation: 1.4, brightness: 1.1 }, description: "Spectral splitting." },
  { name: "Holo Card", effect: "holographic", options: { blur: 8, iridescence: 0.5, animationSpeed: 4 }, description: "Iridescent shimmer." },
  { name: "Thin Light", effect: "thin", options: { blur: 4, backgroundOpacity: 0.03 }, description: "Barely-there glass." },
  // Liquid templates
  { name: "Convex Lens", effect: "liquid", surface: "convexCircle", options: { bezelWidth: 50, glassThickness: 200, blur: 8, refractiveIndex: 1.5, specularOpacity: 0.6 }, description: "Classic magnifying glass shape." },
  { name: "Squircle Panel", effect: "liquid", surface: "convexSquircle", options: { bezelWidth: 50, glassThickness: 200, blur: 8, refractiveIndex: 1.5, specularOpacity: 0.6 }, description: "Rounded square glass panel." },
  { name: "Concave Dish", effect: "liquid", surface: "concave", options: { bezelWidth: 40, glassThickness: 180, blur: 6, refractiveIndex: 1.4, specularOpacity: 0.5 }, description: "Inward-curving glass surface." },
  { name: "Sharp Refract", effect: "liquid", surface: "convexSquircle", options: { bezelWidth: 30, glassThickness: 400, blur: 4, refractiveIndex: 2.0, specularOpacity: 0.8 }, description: "High refractive index for dramatic bending." },
  { name: "Soft Blur", effect: "liquid", surface: "convexSquircle", options: { bezelWidth: 60, glassThickness: 150, blur: 14, refractiveIndex: 1.3, specularOpacity: 0.4 }, description: "Heavy blur with gentle refraction." },
  { name: "Lip Edge", effect: "liquid", surface: "lip", options: { bezelWidth: 50, glassThickness: 200, blur: 6, refractiveIndex: 1.5, specularOpacity: 0.5 }, description: "Raised lip edge surface." },
];

/* ─── Unified Sliders ─── */
type SliderConfig = { key: string; label: string; min: number; max: number; step: number; defaultValue: number; effects: GlassEffectName[] };
const SLIDERS: SliderConfig[] = [
  // CSS effect sliders
  { key: "blur", label: "Blur", min: 0, max: 40, step: 1, defaultValue: 12, effects: CSS_EFFECTS },
  { key: "borderRadius", label: "Radius", min: 0, max: 50, step: 1, defaultValue: 20, effects: CSS_EFFECTS },
  { key: "tintOpacity", label: "Tint Opacity", min: 0, max: 0.5, step: 0.01, defaultValue: 0.08, effects: ["frosted", "crystal"] },
  { key: "shadowBlur", label: "Shadow Blur", min: 0, max: 30, step: 1, defaultValue: 6, effects: ["frosted"] },
  { key: "noiseFrequency", label: "Noise Freq", min: 0.001, max: 0.05, step: 0.001, defaultValue: 0.008, effects: ["crystal"] },
  { key: "distortionStrength", label: "Distortion", min: 0, max: 150, step: 1, defaultValue: 60, effects: ["crystal"] },
  { key: "colorOpacity", label: "Color Opacity", min: 0, max: 0.5, step: 0.01, defaultValue: 0.15, effects: ["aurora"] },
  { key: "animationSpeed", label: "Anim Speed (s)", min: 1, max: 30, step: 1, defaultValue: 8, effects: ["aurora", "holographic", "smoke"] },
  { key: "density", label: "Density", min: 0, max: 0.8, step: 0.05, defaultValue: 0.3, effects: ["smoke"] },
  { key: "hueRotate", label: "Hue Rotate", min: -180, max: 180, step: 5, defaultValue: 0, effects: ["prism"] },
  { key: "saturation", label: "Saturation", min: 0.5, max: 2, step: 0.1, defaultValue: 1.2, effects: ["prism"] },
  { key: "iridescence", label: "Iridescence", min: 0, max: 1, step: 0.05, defaultValue: 0.4, effects: ["holographic"] },
  { key: "backgroundOpacity", label: "BG Opacity", min: 0, max: 0.2, step: 0.005, defaultValue: 0.02, effects: ["thin"] },
  // Liquid-specific sliders
  { key: "bezelWidth", label: "Bezel Width", min: 10, max: 100, step: 1, defaultValue: 50, effects: ["liquid"] },
  { key: "glassThickness", label: "Glass Thickness", min: 20, max: 500, step: 10, defaultValue: 200, effects: ["liquid"] },
  { key: "blur", label: "Blur", min: 0, max: 20, step: 1, defaultValue: 8, effects: ["liquid"] },
  { key: "refractiveIndex", label: "Refractive Index", min: 1.0, max: 2.5, step: 0.05, defaultValue: 1.5, effects: ["liquid"] },
  { key: "specularOpacity", label: "Specular", min: 0, max: 1, step: 0.05, defaultValue: 0.6, effects: ["liquid"] },
  { key: "liquidSaturation", label: "Saturation", min: 0.5, max: 3, step: 0.1, defaultValue: 1.2, effects: ["liquid"] },
  { key: "radius", label: "Corner Radius", min: 4, max: 60, step: 1, defaultValue: 20, effects: ["liquid"] },
];

const SURFACE_TYPES: { key: SurfaceType; label: string }[] = [
  { key: "convexCircle", label: "Circle" },
  { key: "convexSquircle", label: "Squircle" },
  { key: "concave", label: "Concave" },
  { key: "lip", label: "Lip" },
];

/* ─── Liquid Glass Preview ─── */
function LiquidPreview({
  surface,
  values,
  getValue,
  mouseOffset,
  bgIndex,
  gradientIndex,
  previewRef,
  onMouseMove,
}: {
  surface: SurfaceType;
  values: Record<string, number>;
  getValue: (key: string, def: number) => number;
  mouseOffset: { x: number; y: number };
  bgIndex: number;
  gradientIndex: number;
  previewRef: React.RefObject<HTMLDivElement | null>;
  onMouseMove: (e: React.MouseEvent) => void;
}) {
  const svgRef = useRef<Element | null>(null);
  const panelWidth = 280;
  const panelHeight = 200;

  const glass = useMemo(() => {
    return createLiquidGlass({
      width: panelWidth,
      height: panelHeight,
      radius: getValue("radius", 20),
      bezelWidth: getValue("bezelWidth", 50),
      glassThickness: getValue("glassThickness", 200),
      blur: getValue("blur", 8),
      refractiveIndex: getValue("refractiveIndex", 1.5),
      surface,
      specularOpacity: getValue("specularOpacity", 0.6),
      saturation: getValue("liquidSaturation", 1.2),
      dpr: 1,
    });
  }, [surface, values]);

  useEffect(() => {
    if (svgRef.current) svgRef.current.remove();
    const container = document.createElement("div");
    container.innerHTML = glass.svgFilter;
    const svg = container.firstElementChild;
    if (svg) {
      document.body.appendChild(svg);
      svgRef.current = svg;
    }
    return () => { svgRef.current?.remove(); };
  }, [glass.svgFilter]);

  return (
    <div
      ref={previewRef}
      className={`relative overflow-hidden rounded-2xl h-[460px] flex items-center justify-center ${bgIndex === -1 ? `bg-gradient-to-br ${GRADIENT_BGS[gradientIndex]}` : ""}`}
      onMouseMove={onMouseMove}
      onMouseLeave={() => {}}
    >
      {bgIndex >= 0 && (
        <img
          src={BG_IMAGES[bgIndex]}
          alt=""
          className="absolute w-[115%] h-[115%] object-cover transition-transform duration-150 ease-out pointer-events-none"
          style={{
            top: "-7.5%",
            left: "-7.5%",
            transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
          }}
        />
      )}
      <div
        style={{
          width: panelWidth,
          height: panelHeight,
          borderRadius: getValue("radius", 20),
          overflow: "hidden",
          backdropFilter: glass.filterRef,
          WebkitBackdropFilter: glass.filterRef,
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "rgba(0, 0, 0, 0.16) 0px 4px 9px, rgba(0, 0, 0, 0.2) 0px 2px 24px inset, rgba(255, 255, 255, 0.2) 0px -2px 24px inset",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="text-center px-4 relative z-10">
          <p className="text-white/90 text-sm font-medium">Liquid Glass</p>
          <p className="text-white/50 text-xs mt-1">{SURFACE_EQUATIONS[surface].name}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════ */
/*  Unified Playground                             */
/* ═══════════════════════════════════════════════ */
export function Showcase() {
  const [effect, setEffect] = useState<GlassEffectName>("frosted");
  const [values, setValues] = useState<Record<string, number>>({});
  const [tintColor, setTintColor] = useState("#ffffff");
  const [surface, setSurface] = useState<SurfaceType>("convexSquircle");
  const [bgIndex, setBgIndex] = useState(0);
  const [gradientIndex, setGradientIndex] = useState(0);
  const [framework, setFramework] = useState<Framework>("react");
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const previewRef = useRef<HTMLDivElement>(null);

  const isLiquid = effect === "liquid";

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseOffset({ x: nx * -20, y: ny * -20 });
  }, []);

  const activeSliders = SLIDERS.filter((s) => s.effects.includes(effect));
  const getValue = (key: string, def: number) => values[key] ?? def;

  const options = useMemo(() => {
    const o: Record<string, unknown> = {};
    activeSliders.forEach((s) => { o[s.key] = getValue(s.key, s.defaultValue); });
    if (["frosted", "crystal"].includes(effect)) o.tintColor = tintColor;
    // Remap liquidSaturation → saturation for the liquid engine
    if (isLiquid && o.liquidSaturation !== undefined) {
      o.saturation = o.liquidSaturation;
      delete o.liquidSaturation;
    }
    return o;
  }, [effect, values, tintColor, activeSliders, isLiquid]);

  const codeSnippet = useMemo(() => {
    if (isLiquid) {
      const liquidOpts: Record<string, unknown> = {
        width: 280,
        height: 200,
        radius: getValue("radius", 20),
        bezelWidth: getValue("bezelWidth", 50),
        glassThickness: getValue("glassThickness", 200),
        blur: getValue("blur", 8),
        refractiveIndex: getValue("refractiveIndex", 1.5),
        surface,
        specularOpacity: getValue("specularOpacity", 0.6),
      };
      return generateLiquidSnippet(liquidOpts);
    }
    return getSnippet(framework, effect, options);
  }, [framework, effect, options, isLiquid, surface, values]);

  const handlePreset = (name: PresetName) => {
    const p = presets[name];
    if (p.effect === "liquid") return; // liquid presets have fixed dimensions, skip for playground
    setEffect(p.effect);
    const nv: Record<string, number> = {};
    for (const [k, v] of Object.entries(p.options)) {
      if (typeof v === "number") nv[k] = v;
      if (k === "tintColor" && typeof v === "string") setTintColor(v);
    }
    setValues(nv);
  };

  const loadTemplate = (t: typeof TEMPLATES[number]) => {
    setEffect(t.effect);
    const nv: Record<string, number> = {};
    for (const [k, v] of Object.entries(t.options)) {
      if (typeof v === "number") nv[k] = v;
      if (k === "tintColor" && typeof v === "string") setTintColor(v);
    }
    setValues(nv);
    if (t.surface) setSurface(t.surface);
  };

  const effectTemplates = TEMPLATES.filter((t) => t.effect === effect);
  const effectPresets = presetNames.filter((n) => presets[n].effect === effect);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-200 to-violet-200 bg-clip-text text-transparent">
          Playground
        </h1>
        <p className="text-slate-400 mt-3 text-lg">
          Build custom glass effects. Pick an effect, tweak the parameters, copy the code.
        </p>
      </div>

      {/* Chromium notice — only for liquid */}
      {isLiquid && (
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 text-xs text-yellow-400/80 bg-yellow-400/5 border border-yellow-400/20 rounded-full px-3 py-1">
            Chromium only — backdrop-filter with SVG filters requires Chrome or Edge
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Preview */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Background:</span>
            {GRADIENT_BGS.map((g, i) => (
              <button key={g} onClick={() => { setBgIndex(-1); setGradientIndex(i); }} className={`w-7 h-7 rounded-full bg-gradient-to-br ${g} border-2 transition-colors ${bgIndex === -1 && gradientIndex === i ? "border-white" : "border-transparent"}`} />
            ))}
            {BG_IMAGES.slice(0, 4).map((_, i) => (
              <button key={i} onClick={() => setBgIndex(i)} className={`w-7 h-7 rounded-full border-2 transition-colors flex items-center justify-center bg-slate-700 ${bgIndex === i ? "border-white" : "border-transparent"}`}>
                <Image size={12} className="text-slate-300" />
              </button>
            ))}
          </div>

          {isLiquid ? (
            <LiquidPreview
              surface={surface}
              values={values}
              getValue={getValue}
              mouseOffset={mouseOffset}
              bgIndex={bgIndex}
              gradientIndex={gradientIndex}
              previewRef={previewRef}
              onMouseMove={handleMouseMove}
            />
          ) : (
            <div
              ref={previewRef}
              className={`relative overflow-hidden rounded-2xl h-[460px] flex items-center justify-center ${bgIndex === -1 ? `bg-gradient-to-br ${GRADIENT_BGS[gradientIndex]}` : ""}`}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setMouseOffset({ x: 0, y: 0 })}
            >
              {bgIndex >= 0 && (
                <img
                  src={BG_IMAGES[bgIndex]}
                  alt=""
                  className="absolute w-[115%] h-[115%] object-cover transition-transform duration-150 ease-out pointer-events-none"
                  style={{
                    top: "-7.5%",
                    left: "-7.5%",
                    transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
                  }}
                />
              )}
              <Glass effect={effect} options={options as never} className="w-[280px] h-[200px] flex items-center justify-center transition-all duration-300">
                <div className="text-center px-4">
                  <p className="text-white/90 text-sm font-medium capitalize">{effect}</p>
                  <p className="text-white/50 text-xs mt-1">Customize with sliders</p>
                </div>
              </Glass>
            </div>
          )}

          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              {isLiquid ? (
                <span className="text-xs text-slate-500">createLiquidGlass API</span>
              ) : (
                <FrameworkTabs active={framework} onChange={setFramework} />
              )}
            </div>
            <CodeBlock code={codeSnippet} lang={isLiquid ? "ts" : framework === "vue" ? "vue" : "tsx"} />
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-5">
          {/* Effect picker */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Effect</h3>
            <div className="grid grid-cols-2 gap-2">
              {ALL_EFFECTS.map((e) => (
                <button
                  key={e}
                  onClick={() => { setEffect(e); setValues({}); }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${effect === e ? "bg-white text-slate-900" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
                >
                  <span>{e}</span>
                  {effect !== e && (
                    <span className={`text-[9px] ${effectRenderTiers[e] === "svg-filter" ? "text-emerald-400" : "text-violet-400"}`}>
                      {effectRenderTiers[e] === "svg-filter" ? "SVG" : "CSS"}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Surface type picker (liquid only) */}
          {isLiquid && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-3">Surface Shape</h3>
              <div className="grid grid-cols-2 gap-2">
                {SURFACE_TYPES.map((s) => (
                  <button key={s.key} onClick={() => setSurface(s.key)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${surface === s.key ? "bg-white text-slate-900" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Templates & Presets */}
          {(effectTemplates.length > 0 || effectPresets.length > 0) && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-3">Templates</h3>
              <div className="flex flex-wrap gap-2">
                {effectTemplates.map((t) => (
                  <button key={t.name} onClick={() => loadTemplate(t)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors">{t.name}</button>
                ))}
              </div>
              {effectPresets.length > 0 && (
                <div className="mt-3 border-t border-slate-700 pt-3">
                  <h4 className="text-xs text-slate-500 mb-2">Presets</h4>
                  <div className="flex flex-wrap gap-2">
                    {effectPresets.map((name) => (
                      <button key={name} onClick={() => handlePreset(name)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-700/60 text-slate-400 hover:bg-slate-600 transition-colors">{name}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Parameters */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-200">Parameters</h3>
              <button onClick={() => { setValues({}); setTintColor("#ffffff"); }} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"><RotateCcw size={12} /> Reset</button>
            </div>
            <div className="space-y-4">
              {!isLiquid && ["frosted", "crystal"].includes(effect) && (
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Tint Color</span>
                  <input type="color" value={tintColor} onChange={(e) => setTintColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                </label>
              )}
              {activeSliders.map((s) => (
                <label key={s.key} className="block">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{s.label}</span>
                    <span className="text-slate-500 font-mono text-xs">{getValue(s.key, s.defaultValue)}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={getValue(s.key, s.defaultValue)} onChange={(e) => setValues((p) => ({ ...p, [s.key]: Number(e.target.value) }))} className="w-full accent-blue-500" />
                </label>
              ))}
            </div>
          </div>

          {/* Render tier info */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold text-slate-200">Render Tier</h3>
              <TierBadge effect={effect} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isLiquid ? (
                <>
                  Uses Snell-Descartes law to calculate how light bends through a curved glass surface.
                  The displacement map is generated per-pixel on a canvas, then fed into an SVG
                  <code className="text-blue-300 mx-1">feDisplacementMap</code>
                  filter with a specular highlight overlay.
                </>
              ) : effectRenderTiers[effect] === "svg-filter" ? (
                <>
                  This effect uses SVG filter primitives
                  (<code className="text-blue-300 mx-0.5">feTurbulence</code>,
                  <code className="text-blue-300 mx-0.5">feDisplacementMap</code>)
                  applied via <code className="text-blue-300 mx-0.5">backdrop-filter</code>.
                </>
              ) : (
                <>
                  This effect uses pure CSS — <code className="text-blue-300 mx-0.5">backdrop-filter</code>,
                  <code className="text-blue-300 mx-0.5">box-shadow</code>, and CSS animations.
                  Works across all modern browsers.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
