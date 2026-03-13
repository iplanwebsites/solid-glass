import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Glass, type GlassEffectName, presets, type PresetName, presetNames } from "solid-glass";
import { createLiquidGlass, type SurfaceType, SURFACE_EQUATIONS } from "solid-glass/engines/svg-refraction";
import { Copy, Check, RotateCcw, Image, SlidersHorizontal, Layers, Gem } from "lucide-react";

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

/* ─── Gallery Data ─── */
const ALL_EFFECTS: {
  name: string;
  effect: GlassEffectName;
  options: Record<string, unknown>;
  description: string;
}[] = [
  // Frosted variants
  { name: "Frosted Light", effect: "frosted", options: { blur: 12, tintColor: "#ffffff", tintOpacity: 0.1 }, description: "Classic light frosted glass." },
  { name: "Frosted Dark", effect: "frosted", options: { blur: 14, tintColor: "#000000", tintOpacity: 0.2, shadowColor: "rgba(0,0,0,0.3)" }, description: "Dark mode frosted variant." },
  { name: "Frosted Blue", effect: "frosted", options: { blur: 16, tintColor: "#3b82f6", tintOpacity: 0.12 }, description: "Blue-tinted frosted glass." },
  { name: "Frosted Rose", effect: "frosted", options: { blur: 18, tintColor: "#f43f5e", tintOpacity: 0.15, borderRadius: 32 }, description: "Soft rose-tinted frost." },
  // Crystal variants
  { name: "Crystal Clear", effect: "crystal", options: { blur: 6, noiseFrequency: 0.006, distortionStrength: 40 }, description: "Subtle refraction." },
  { name: "Crystal Amber", effect: "crystal", options: { blur: 8, tintColor: "#f59e0b", tintOpacity: 0.08, distortionStrength: 70 }, description: "Warm crystal distortion." },
  { name: "Crystal Cyan", effect: "crystal", options: { blur: 7, borderRadius: 4, tintOpacity: 0.23, noiseFrequency: 0.032, distortionStrength: 40, tintColor: "#0ad9f5" }, description: "Vivid cyan refraction with tight corners." },
  { name: "Crystal Heavy", effect: "crystal", options: { blur: 4, noiseFrequency: 0.045, distortionStrength: 120, tintColor: "#8b5cf6", tintOpacity: 0.12 }, description: "Extreme distortion for dramatic impact." },
  // Aurora variants
  { name: "Aurora North", effect: "aurora", options: { colors: ["#a78bfa", "#818cf8", "#6ee7b7"] }, description: "Northern Lights gradient." },
  { name: "Aurora Sunset", effect: "aurora", options: { colors: ["#f97316", "#ef4444", "#ec4899", "#8b5cf6"] }, description: "Warm sunset palette." },
  { name: "Aurora Neon", effect: "aurora", options: { colors: ["#00ff87", "#60efff", "#ff1cf7"], colorOpacity: 0.25, animationSpeed: 4, blur: 20 }, description: "High-energy neon aurora." },
  // Smoke variants
  { name: "Smoke Noir", effect: "smoke", options: { blur: 24, density: 0.4, smokeColor: "#000000" }, description: "Deep dark smoke." },
  { name: "Smoke Mist", effect: "smoke", options: { blur: 18, density: 0.15, smokeColor: "#ffffff" }, description: "Light misty smoke." },
  { name: "Smoke Ember", effect: "smoke", options: { blur: 20, density: 0.35, smokeColor: "#dc2626", turbulence: 0.025, animationDuration: 8 }, description: "Fiery red smoke with fast turbulence." },
  // Prism variants
  { name: "Prism Rainbow", effect: "prism", options: { blur: 8, saturation: 1.4, brightness: 1.1 }, description: "Spectral splitting." },
  { name: "Prism Warm", effect: "prism", options: { blur: 10, hueRotate: 30, saturation: 1.6, brightness: 1.15, contrast: 1.2 }, description: "Warm-shifted spectral effect." },
  // Holographic variants
  { name: "Holo Card", effect: "holographic", options: { blur: 8, iridescence: 0.5, animationSpeed: 4 }, description: "Iridescent shimmer." },
  { name: "Holo Intense", effect: "holographic", options: { blur: 6, iridescence: 0.85, animationSpeed: 2, noiseOpacity: 0.12 }, description: "Maximum iridescence, fast shift." },
  // Thin variants
  { name: "Thin Light", effect: "thin", options: { blur: 4, backgroundOpacity: 0.03 }, description: "Barely-there glass." },
  { name: "Thin Dark", effect: "thin", options: { blur: 6, backgroundOpacity: 0.05, dark: true, borderOpacity: 0.15 }, description: "Subtle dark panel." },
];

const EFFECT_TYPES: GlassEffectName[] = ["frosted", "crystal", "aurora", "smoke", "prism", "holographic", "thin"];

/* ─── Playground Sliders ─── */
type SliderConfig = { key: string; label: string; min: number; max: number; step: number; defaultValue: number; effects: GlassEffectName[] };
const SLIDERS: SliderConfig[] = [
  { key: "blur", label: "Blur", min: 0, max: 40, step: 1, defaultValue: 12, effects: EFFECT_TYPES },
  { key: "borderRadius", label: "Radius", min: 0, max: 50, step: 1, defaultValue: 20, effects: EFFECT_TYPES },
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
];

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

export function Showcase() {
  const [tab, setTab] = useState<"gallery" | "playground" | "liquid">("gallery");

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-200 to-violet-200 bg-clip-text text-transparent">
          Showcase
        </h1>
        <p className="text-slate-400 mt-3 text-lg">
          Browse the gallery, build your own, or explore physics-based liquid glass.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex justify-center gap-2 mb-10">
        <button onClick={() => setTab("gallery")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab === "gallery" ? "bg-white text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>
          <Layers size={16} /> Gallery
        </button>
        <button onClick={() => setTab("playground")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab === "playground" ? "bg-white text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>
          <SlidersHorizontal size={16} /> Playground
        </button>
        <button onClick={() => setTab("liquid")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab === "liquid" ? "bg-white text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>
          <Gem size={16} /> Liquid Glass
        </button>
      </div>

      {tab === "gallery" ? <GalleryView /> : tab === "playground" ? <PlaygroundView /> : <LiquidGlassView />}
    </div>
  );
}

/* ─── Gallery ─── */
function GalleryView() {
  const [filter, setFilter] = useState<GlassEffectName | "all">("all");
  const filtered = filter === "all" ? ALL_EFFECTS : ALL_EFFECTS.filter((e) => e.effect === filter);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [framework, setFramework] = useState<Framework>("react");

  useEffect(() => {
    const interval = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % BG_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseLeave = useCallback(() => setMousePos(null), []);

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "all" ? "bg-white text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>
          All ({ALL_EFFECTS.length})
        </button>
        {EFFECT_TYPES.map((t) => (
          <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${filter === t ? "bg-white text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex justify-center mb-10">
        <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-1.5">
          <span className="text-xs text-slate-500">Code:</span>
          <FrameworkTabs active={framework} onChange={setFramework} />
        </div>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {filtered.map((item, i) => {
          const snippet = getSnippet(framework, item.effect, item.options);
          const photo = BG_IMAGES[(photoIndex + i) % BG_IMAGES.length];
          return (
            <GalleryCard
              key={`${item.effect}-${i}`}
              item={item}
              index={i}
              photo={photo}
              snippet={snippet}
              copiedIdx={copiedIdx}
              setCopiedIdx={setCopiedIdx}
              mousePos={mousePos}
            />
          );
        })}
      </div>
    </>
  );
}

function GalleryCard({
  item,
  index,
  photo,
  snippet,
  copiedIdx,
  setCopiedIdx,
  mousePos,
}: {
  item: typeof ALL_EFFECTS[number];
  index: number;
  photo: string;
  snippet: string;
  copiedIdx: number | null;
  setCopiedIdx: (v: number | null) => void;
  mousePos: { x: number; y: number } | null;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const getGlassOffset = () => {
    if (!mousePos || !cardRef.current) return {};
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (mousePos.x - cx) / rect.width;
    const dy = (mousePos.y - cy) / rect.height;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxShift = 20;
    const falloff = Math.max(0, 1 - dist * 0.5);
    return {
      transform: `translate(${dx * maxShift * falloff}px, ${dy * maxShift * falloff}px)`,
      transition: "transform 0.12s ease-out",
    };
  };

  return (
    <div ref={cardRef} className="group">
      <div className="relative overflow-hidden rounded-2xl h-64 flex items-center justify-center">
        <img
          src={photo}
          alt=""
          className="absolute inset-0 w-[130%] h-[130%] object-cover -top-[15%] -left-[15%]"
          style={{ animation: `panBg${index % 3} 14s ease-in-out infinite alternate` }}
        />
        <div className="absolute inset-0 bg-slate-950/10" />
        <div style={getGlassOffset()}>
          <Glass effect={item.effect} options={item.options as never} className="w-48 h-36 flex items-center justify-center">
            <span className="text-white/90 text-sm font-medium drop-shadow-sm">{item.name}</span>
          </Glass>
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-white">{item.name}</h3>
          <p className="text-sm text-slate-400 mt-1">{item.description}</p>
        </div>
        <button
          onClick={() => { navigator.clipboard.writeText(snippet); setCopiedIdx(index); setTimeout(() => setCopiedIdx(null), 2000); }}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          {copiedIdx === index ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
        </button>
      </div>
      <span className="mt-2 inline-block text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">{item.effect}</span>
    </div>
  );
}

/* ─── Playground ─── */
function PlaygroundView() {
  const [effect, setEffect] = useState<GlassEffectName>("frosted");
  const [values, setValues] = useState<Record<string, number>>({});
  const [tintColor, setTintColor] = useState("#ffffff");
  const [bgIndex, setBgIndex] = useState(-1);
  const [gradientIndex, setGradientIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [framework, setFramework] = useState<Framework>("react");

  const activeSliders = SLIDERS.filter((s) => s.effects.includes(effect));
  const getValue = (key: string, def: number) => values[key] ?? def;

  const options = useMemo(() => {
    const o: Record<string, unknown> = {};
    activeSliders.forEach((s) => { o[s.key] = getValue(s.key, s.defaultValue); });
    if (["frosted", "crystal"].includes(effect)) o.tintColor = tintColor;
    return o;
  }, [effect, values, tintColor, activeSliders]);

  const codeSnippet = useMemo(() => getSnippet(framework, effect, options), [framework, effect, options]);

  const handlePreset = (name: PresetName) => {
    const p = presets[name];
    setEffect(p.effect);
    const nv: Record<string, number> = {};
    for (const [k, v] of Object.entries(p.options)) {
      if (typeof v === "number") nv[k] = v;
      if (k === "tintColor" && typeof v === "string") setTintColor(v);
    }
    setValues(nv);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
      {/* Preview */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">Background:</span>
          {GRADIENT_BGS.map((g, i) => (
            <button key={g} onClick={() => { setBgIndex(-1); setGradientIndex(i); }} className={`w-7 h-7 rounded-full bg-gradient-to-br ${g} border-2 transition-colors ${bgIndex === -1 && gradientIndex === i ? "border-white" : "border-transparent"}`} />
          ))}
          {BG_IMAGES.map((_, i) => (
            <button key={i} onClick={() => setBgIndex(i)} className={`w-7 h-7 rounded-full border-2 transition-colors flex items-center justify-center bg-slate-700 ${bgIndex === i ? "border-white" : "border-transparent"}`}>
              <Image size={12} className="text-slate-300" />
            </button>
          ))}
        </div>

        <div className={`relative overflow-hidden rounded-2xl h-[460px] flex items-center justify-center ${bgIndex === -1 ? `bg-gradient-to-br ${GRADIENT_BGS[gradientIndex]}` : ""}`}>
          {bgIndex >= 0 && (
            <img
              src={BG_IMAGES[bgIndex]}
              alt=""
              className="absolute inset-0 w-[115%] h-[115%] object-cover -top-[7%] -left-[7%]"
              style={{ animation: "panBg0 14s ease-in-out infinite alternate" }}
            />
          )}
          <Glass effect={effect} options={options as never} className="w-[280px] h-[200px] flex items-center justify-center transition-all duration-300">
            <div className="text-center px-4">
              <p className="text-white/90 text-sm font-medium capitalize">{effect}</p>
              <p className="text-white/50 text-xs mt-1">Customize with sliders</p>
            </div>
          </Glass>
        </div>

        <div className="relative bg-slate-800/80 border border-slate-700 rounded-xl p-5">
          <div className="flex justify-between items-center mb-3">
            <FrameworkTabs active={framework} onChange={setFramework} />
            <button onClick={() => { navigator.clipboard.writeText(codeSnippet); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="code-block text-slate-300 overflow-x-auto text-xs">{codeSnippet}</pre>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-5">
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Effect</h3>
          <div className="grid grid-cols-2 gap-2">
            {EFFECT_TYPES.map((e) => (
              <button key={e} onClick={() => { setEffect(e); setValues({}); }} className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${effect === e ? "bg-white text-slate-900" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}>
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Presets</h3>
          <div className="flex flex-wrap gap-2">
            {presetNames.filter((n) => presets[n].effect === effect).map((name) => (
              <button key={name} onClick={() => handlePreset(name)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors">{name}</button>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Parameters</h3>
            <button onClick={() => { setValues({}); setTintColor("#ffffff"); }} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"><RotateCcw size={12} /> Reset</button>
          </div>
          <div className="space-y-4">
            {["frosted", "crystal"].includes(effect) && (
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
      </div>
    </div>
  );
}

/* ─── Liquid Glass (SVG Refraction Engine) ─── */
const SURFACE_TYPES: { key: SurfaceType; label: string }[] = [
  { key: "convexCircle", label: "Circle" },
  { key: "convexSquircle", label: "Squircle" },
  { key: "concave", label: "Concave" },
  { key: "lip", label: "Lip" },
];

const LIQUID_SLIDERS = [
  { key: "bezelWidth", label: "Bezel Width", min: 10, max: 100, step: 1, defaultValue: 50 },
  { key: "glassThickness", label: "Glass Thickness", min: 20, max: 500, step: 10, defaultValue: 200 },
  { key: "blur", label: "Blur", min: 0, max: 20, step: 1, defaultValue: 8 },
  { key: "refractiveIndex", label: "Refractive Index", min: 1.0, max: 2.5, step: 0.05, defaultValue: 1.5 },
  { key: "specularOpacity", label: "Specular Opacity", min: 0, max: 1, step: 0.05, defaultValue: 0.6 },
  { key: "saturation", label: "Saturation", min: 0.5, max: 3, step: 0.1, defaultValue: 1.2 },
  { key: "radius", label: "Corner Radius", min: 4, max: 60, step: 1, defaultValue: 20 },
];

function LiquidGlassView() {
  const [surface, setSurface] = useState<SurfaceType>("convexSquircle");
  const [values, setValues] = useState<Record<string, number>>({});
  const [bgIndex, setBgIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<Element | null>(null);

  const getValue = (key: string, def: number) => values[key] ?? def;

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
      saturation: getValue("saturation", 1.2),
      dpr: 1,
    });
  }, [surface, values]);

  // Inject/cleanup SVG filter
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

  const codeSnippet = useMemo(() => {
    const opts: Record<string, unknown> = {
      width: panelWidth,
      height: panelHeight,
      radius: getValue("radius", 20),
      bezelWidth: getValue("bezelWidth", 50),
      glassThickness: getValue("glassThickness", 200),
      blur: getValue("blur", 8),
      refractiveIndex: getValue("refractiveIndex", 1.5),
      surface,
      specularOpacity: getValue("specularOpacity", 0.6),
    };
    return `import { createLiquidGlass } from "solid-glass/engines/svg-refraction";

const glass = createLiquidGlass(${JSON.stringify(opts, null, 2)});

// Inject SVG filter into DOM
document.body.insertAdjacentHTML("beforeend", glass.svgFilter);

// Apply as backdrop-filter (Chromium only)
element.style.backdropFilter = glass.filterRef;`;
  }, [surface, values]);

  return (
    <div>
      {/* Credit banner */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 mb-8 text-center">
        <p className="text-sm text-slate-400">
          SVG refraction engine inspired by{" "}
          <a href="https://kube.io/blog/liquid-glass-css-svg" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
            Kube (Chris Feijoo)
          </a>
          {" "}&mdash; physics-based glass refraction using Snell&rsquo;s law and SVG displacement maps.
          <span className="block text-xs text-slate-500 mt-1">Chromium-only: backdrop-filter with SVG filters requires a Chromium-based browser.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Preview */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Background:</span>
            {BG_IMAGES.map((_, i) => (
              <button key={i} onClick={() => setBgIndex(i)} className={`w-7 h-7 rounded-full border-2 transition-colors flex items-center justify-center bg-slate-700 ${bgIndex === i ? "border-white" : "border-transparent"}`}>
                <Image size={12} className="text-slate-300" />
              </button>
            ))}
          </div>

          <div ref={previewRef} className="relative overflow-hidden rounded-2xl h-[460px] flex items-center justify-center">
            <img
              src={BG_IMAGES[bgIndex]}
              alt=""
              className="absolute inset-0 w-[115%] h-[115%] object-cover -top-[7%] -left-[7%]"
              style={{ animation: "panBg0 14s ease-in-out infinite alternate" }}
            />
            <div
              style={{
                width: panelWidth,
                height: panelHeight,
                borderRadius: getValue("radius", 20),
                overflow: "hidden",
                backdropFilter: glass.filterRef,
                WebkitBackdropFilter: glass.filterRef,
                border: "1px solid rgba(255,255,255,0.15)",
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

          <div className="relative bg-slate-800/80 border border-slate-700 rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-slate-400 font-medium">Generated Code</span>
              <button onClick={() => { navigator.clipboard.writeText(codeSnippet); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="code-block text-slate-300 overflow-x-auto text-xs">{codeSnippet}</pre>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-5">
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

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-200">Parameters</h3>
              <button onClick={() => setValues({})} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"><RotateCcw size={12} /> Reset</button>
            </div>
            <div className="space-y-4">
              {LIQUID_SLIDERS.map((s) => (
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

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-200 mb-2">About this engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Uses Snell-Descartes law to calculate how light bends through a curved glass surface.
              The displacement map is generated per-pixel on a canvas, then fed into an SVG
              <code className="text-blue-300 mx-1">feDisplacementMap</code>
              filter with a specular highlight overlay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
