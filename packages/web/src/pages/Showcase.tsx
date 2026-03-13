import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Glass, type GlassEffectName, presets, type PresetName, presetNames } from "solid-glass";
import { Copy, Check, RotateCcw, Image, SlidersHorizontal, Layers } from "lucide-react";

/* ─── Gallery Data ─── */
const ALL_EFFECTS: {
  name: string;
  effect: GlassEffectName;
  options: Record<string, unknown>;
  description: string;
}[] = [
  { name: "Frosted Light", effect: "frosted", options: { blur: 12, tintColor: "#ffffff", tintOpacity: 0.1 }, description: "Classic light frosted glass." },
  { name: "Frosted Dark", effect: "frosted", options: { blur: 14, tintColor: "#000000", tintOpacity: 0.2, shadowColor: "rgba(0,0,0,0.3)" }, description: "Dark mode frosted variant." },
  { name: "Frosted Blue", effect: "frosted", options: { blur: 16, tintColor: "#3b82f6", tintOpacity: 0.12 }, description: "Blue-tinted frosted glass." },
  { name: "Crystal Clear", effect: "crystal", options: { blur: 6, noiseFrequency: 0.006, distortionStrength: 40 }, description: "Subtle refraction." },
  { name: "Crystal Amber", effect: "crystal", options: { blur: 8, tintColor: "#f59e0b", tintOpacity: 0.08, distortionStrength: 70 }, description: "Warm crystal distortion." },
  { name: "Aurora North", effect: "aurora", options: { colors: ["#a78bfa", "#818cf8", "#6ee7b7"] }, description: "Northern Lights gradient." },
  { name: "Aurora Sunset", effect: "aurora", options: { colors: ["#f97316", "#ef4444", "#ec4899", "#8b5cf6"] }, description: "Warm sunset palette." },
  { name: "Smoke Noir", effect: "smoke", options: { blur: 24, density: 0.4, smokeColor: "#000000" }, description: "Deep dark smoke." },
  { name: "Smoke Mist", effect: "smoke", options: { blur: 18, density: 0.15, smokeColor: "#ffffff" }, description: "Light misty smoke." },
  { name: "Prism Rainbow", effect: "prism", options: { blur: 8, saturation: 1.4, brightness: 1.1 }, description: "Spectral splitting." },
  { name: "Holo Card", effect: "holographic", options: { blur: 8, iridescence: 0.5, animationSpeed: 4 }, description: "Iridescent shimmer." },
  { name: "Thin Light", effect: "thin", options: { blur: 4, backgroundOpacity: 0.03 }, description: "Barely-there glass." },
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
  const [tab, setTab] = useState<"gallery" | "playground">("gallery");

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-200 to-violet-200 bg-clip-text text-transparent">
          Showcase
        </h1>
        <p className="text-slate-400 mt-3 text-lg">
          Browse the gallery or build your own in the playground.
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
      </div>

      {tab === "gallery" ? <GalleryView /> : <PlaygroundView />}
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
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "all" ? "bg-white text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>
          All ({ALL_EFFECTS.length})
        </button>
        {EFFECT_TYPES.map((t) => (
          <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${filter === t ? "bg-white text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>
            {t}
          </button>
        ))}
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {filtered.map((item, i) => {
          const snippet = `<Glass effect="${item.effect}" options={${JSON.stringify(item.options, null, 2)}} />`;
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

  const activeSliders = SLIDERS.filter((s) => s.effects.includes(effect));
  const getValue = (key: string, def: number) => values[key] ?? def;

  const options = useMemo(() => {
    const o: Record<string, unknown> = {};
    activeSliders.forEach((s) => { o[s.key] = getValue(s.key, s.defaultValue); });
    if (["frosted", "crystal"].includes(effect)) o.tintColor = tintColor;
    return o;
  }, [effect, values, tintColor, activeSliders]);

  const codeSnippet = useMemo(() => `<Glass effect="${effect}" options={${JSON.stringify(options, null, 2)}}>\n  {children}\n</Glass>`, [effect, options]);

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
