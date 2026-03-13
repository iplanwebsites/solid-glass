import { useState, useMemo, useRef } from "react";
import { Glass, type GlassEffectName, presets, type PresetName, presetNames } from "solid-glass";
import { Copy, Check, RotateCcw, Image } from "lucide-react";

const EFFECTS: GlassEffectName[] = ["frosted", "crystal", "aurora", "smoke", "prism", "holographic", "thin"];

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
];

const GRADIENT_BGS = [
  "from-blue-600 via-violet-600 to-fuchsia-600",
  "from-emerald-600 via-teal-600 to-cyan-600",
  "from-orange-600 via-red-600 to-pink-600",
  "from-slate-700 via-slate-800 to-slate-900",
];

type SliderConfig = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  effects: GlassEffectName[];
};

const SLIDERS: SliderConfig[] = [
  { key: "blur", label: "Blur", min: 0, max: 40, step: 1, defaultValue: 12, effects: EFFECTS },
  { key: "borderRadius", label: "Radius", min: 0, max: 50, step: 1, defaultValue: 20, effects: EFFECTS },
  { key: "tintOpacity", label: "Tint Opacity", min: 0, max: 0.5, step: 0.01, defaultValue: 0.08, effects: ["frosted", "crystal"] },
  { key: "shadowBlur", label: "Shadow Blur", min: 0, max: 30, step: 1, defaultValue: 6, effects: ["frosted"] },
  { key: "shadowSpread", label: "Shadow Spread", min: 0, max: 20, step: 1, defaultValue: 0, effects: ["frosted"] },
  { key: "borderWidth", label: "Border Width", min: 0, max: 5, step: 0.5, defaultValue: 1, effects: ["frosted"] },
  { key: "noiseFrequency", label: "Noise Freq", min: 0.001, max: 0.05, step: 0.001, defaultValue: 0.008, effects: ["crystal"] },
  { key: "distortionStrength", label: "Distortion", min: 0, max: 150, step: 1, defaultValue: 60, effects: ["crystal"] },
  { key: "colorOpacity", label: "Color Opacity", min: 0, max: 0.5, step: 0.01, defaultValue: 0.15, effects: ["aurora"] },
  { key: "animationSpeed", label: "Anim Speed (s)", min: 1, max: 30, step: 1, defaultValue: 8, effects: ["aurora", "holographic", "smoke"] },
  { key: "density", label: "Density", min: 0, max: 0.8, step: 0.05, defaultValue: 0.3, effects: ["smoke"] },
  { key: "turbulence", label: "Turbulence", min: 0.001, max: 0.05, step: 0.001, defaultValue: 0.015, effects: ["smoke"] },
  { key: "hueRotate", label: "Hue Rotate", min: -180, max: 180, step: 5, defaultValue: 0, effects: ["prism"] },
  { key: "saturation", label: "Saturation", min: 0.5, max: 2, step: 0.1, defaultValue: 1.2, effects: ["prism"] },
  { key: "brightness", label: "Brightness", min: 0.5, max: 2, step: 0.05, defaultValue: 1.05, effects: ["prism"] },
  { key: "contrast", label: "Contrast", min: 0.5, max: 2, step: 0.05, defaultValue: 1.1, effects: ["prism"] },
  { key: "iridescence", label: "Iridescence", min: 0, max: 1, step: 0.05, defaultValue: 0.4, effects: ["holographic"] },
  { key: "backgroundOpacity", label: "BG Opacity", min: 0, max: 0.2, step: 0.005, defaultValue: 0.02, effects: ["thin"] },
  { key: "borderOpacity", label: "Border Opacity", min: 0, max: 0.3, step: 0.01, defaultValue: 0.1, effects: ["thin"] },
];

export function Playground() {
  const [effect, setEffect] = useState<GlassEffectName>("frosted");
  const [values, setValues] = useState<Record<string, number>>({});
  const [tintColor, setTintColor] = useState("#ffffff");
  const [bgIndex, setBgIndex] = useState(0); // default to first image
  const [gradientIndex, setGradientIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [panelWidth, setPanelWidth] = useState(280);
  const [panelHeight, setPanelHeight] = useState(200);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const previewRef = useRef<HTMLDivElement>(null);

  const activeSliders = SLIDERS.filter((s) => s.effects.includes(effect));

  const getValue = (key: string, defaultValue: number) => values[key] ?? defaultValue;

  const options = useMemo(() => {
    const o: Record<string, unknown> = {};
    activeSliders.forEach((s) => {
      o[s.key] = getValue(s.key, s.defaultValue);
    });
    if (["frosted", "crystal"].includes(effect)) {
      o.tintColor = tintColor;
    }
    return o;
  }, [effect, values, tintColor, activeSliders]);

  const codeSnippet = useMemo(() => {
    const optsStr = JSON.stringify(options, null, 2);
    return `<Glass effect="${effect}" options={${optsStr}}>\n  {children}\n</Glass>`;
  }, [effect, options]);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setValues({});
    setTintColor("#ffffff");
  };

  const handlePreviewMouseMove = (e: React.MouseEvent) => {
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Normalize to -1..1 from center
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    // Shift up to 30px in each direction
    setMouseOffset({ x: nx * -30, y: ny * -30 });
  };

  const handlePreset = (name: PresetName) => {
    const p = presets[name];
    setEffect(p.effect);
    const newValues: Record<string, number> = {};
    for (const [k, v] of Object.entries(p.options)) {
      if (typeof v === "number") newValues[k] = v;
      if (k === "tintColor" && typeof v === "string") setTintColor(v);
    }
    setValues(newValues);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-200 to-violet-200 bg-clip-text text-transparent">
          Interactive Playground
        </h1>
        <p className="text-slate-400 mt-3 text-lg">
          Tweak every parameter in real-time. Copy the code when you're happy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* Preview */}
        <div className="space-y-6">
          {/* Background switcher */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Background:</span>
            {GRADIENT_BGS.map((g, i) => (
              <button
                key={g}
                onClick={() => { setBgIndex(-1); setGradientIndex(i); }}
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${g} border-2 transition-colors ${
                  bgIndex === -1 && gradientIndex === i ? "border-white" : "border-transparent"
                }`}
              />
            ))}
            {BG_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setBgIndex(i)}
                className={`w-8 h-8 rounded-full border-2 transition-colors flex items-center justify-center bg-slate-700 ${
                  bgIndex === i ? "border-white" : "border-transparent"
                }`}
              >
                <Image size={14} className="text-slate-300" />
              </button>
            ))}
          </div>

          {/* Preview area */}
          <div
            ref={previewRef}
            onMouseMove={handlePreviewMouseMove}
            onMouseLeave={() => setMouseOffset({ x: 0, y: 0 })}
            className={`relative overflow-hidden rounded-2xl h-[500px] flex items-center justify-center ${
              bgIndex === -1 ? `bg-gradient-to-br ${GRADIENT_BGS[gradientIndex]}` : ""
            }`}
          >
            {bgIndex >= 0 && (
              <img
                src={BG_IMAGES[bgIndex]}
                alt="Background"
                className="absolute w-[115%] h-[115%] object-cover transition-transform duration-150 ease-out"
                style={{
                  top: "-7.5%",
                  left: "-7.5%",
                  transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
                }}
              />
            )}

            {/* Decorative shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-8 left-12 w-32 h-32 bg-white/10 rounded-2xl rotate-12" />
              <div className="absolute top-20 right-16 w-24 h-24 bg-pink-400/15 rounded-full" />
              <div className="absolute bottom-12 left-1/4 w-40 h-20 bg-yellow-400/10 rounded-xl" />
              <div className="absolute bottom-16 right-12 w-20 h-20 bg-green-400/15 rounded-xl rotate-45" />
            </div>

            <Glass
              effect={effect}
              options={options as never}
              className="flex items-center justify-center transition-all duration-300"
              style={{ width: panelWidth, height: panelHeight }}
            >
              <div className="text-center px-4">
                <p className="text-white/90 text-sm font-medium capitalize">{effect}</p>
                <p className="text-white/50 text-xs mt-1">Drag sliders to customize</p>
              </div>
            </Glass>
          </div>

          {/* Size controls */}
          <div className="flex gap-6">
            <label className="flex items-center gap-3 text-sm text-slate-400">
              Width
              <input
                type="range"
                min={120}
                max={500}
                value={panelWidth}
                onChange={(e) => setPanelWidth(Number(e.target.value))}
                className="accent-blue-500"
              />
              <span className="text-slate-300 w-10 text-right">{panelWidth}</span>
            </label>
            <label className="flex items-center gap-3 text-sm text-slate-400">
              Height
              <input
                type="range"
                min={80}
                max={400}
                value={panelHeight}
                onChange={(e) => setPanelHeight(Number(e.target.value))}
                className="accent-blue-500"
              />
              <span className="text-slate-300 w-10 text-right">{panelHeight}</span>
            </label>
          </div>

          {/* Code output */}
          <div className="relative bg-slate-800/80 border border-slate-700 rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-slate-400 font-medium">Generated Code</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="code-block text-slate-300 overflow-x-auto text-xs">{codeSnippet}</pre>
          </div>
        </div>

        {/* Controls panel */}
        <div className="space-y-6">
          {/* Effect selector */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Effect</h3>
            <div className="grid grid-cols-2 gap-2">
              {EFFECTS.map((e) => (
                <button
                  key={e}
                  onClick={() => { setEffect(e); setValues({}); }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    effect === e ? "bg-white text-slate-900" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Presets</h3>
            <div className="flex flex-wrap gap-2">
              {presetNames
                .filter((n) => presets[n].effect === effect)
                .map((name) => (
                  <button
                    key={name}
                    onClick={() => handlePreset(name)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                  >
                    {name}
                  </button>
                ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-200">Parameters</h3>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            </div>

            <div className="space-y-4">
              {/* Tint color picker */}
              {["frosted", "crystal"].includes(effect) && (
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Tint Color</span>
                  <input
                    type="color"
                    value={tintColor}
                    onChange={(e) => setTintColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                  />
                </label>
              )}

              {activeSliders.map((s) => (
                <label key={s.key} className="block">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{s.label}</span>
                    <span className="text-slate-500 font-mono text-xs">
                      {getValue(s.key, s.defaultValue)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={getValue(s.key, s.defaultValue)}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [s.key]: Number(e.target.value) }))
                    }
                    className="w-full accent-blue-500"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
