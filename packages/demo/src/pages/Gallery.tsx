import { useState } from "react";
import { EffectCard } from "../components/EffectCard";
import type { GlassEffectName } from "solid-glass";

const ALL_EFFECTS: {
  name: string;
  effect: GlassEffectName;
  options: Record<string, unknown>;
  description: string;
}[] = [
  // Frosted
  {
    name: "Frosted Light",
    effect: "frosted",
    options: { blur: 12, tintColor: "#ffffff", tintOpacity: 0.1 },
    description: "Classic Apple-style light frosted glass with soft blur.",
  },
  {
    name: "Frosted Dark",
    effect: "frosted",
    options: { blur: 14, tintColor: "#000000", tintOpacity: 0.2, shadowColor: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.08)" },
    description: "Dark frosted variant ideal for dark-mode UIs.",
  },
  {
    name: "Frosted Blue",
    effect: "frosted",
    options: { blur: 16, tintColor: "#3b82f6", tintOpacity: 0.12, borderRadius: 20 },
    description: "Tinted blue frosted glass with pronounced blur.",
  },

  // Crystal
  {
    name: "Crystal Clear",
    effect: "crystal",
    options: { blur: 6, noiseFrequency: 0.006, distortionStrength: 40 },
    description: "Subtle SVG noise-based refraction for a crystal look.",
  },
  {
    name: "Crystal Amber",
    effect: "crystal",
    options: { blur: 8, tintColor: "#f59e0b", tintOpacity: 0.08, distortionStrength: 70 },
    description: "Warm amber tint with strong crystalline distortion.",
  },

  // Aurora
  {
    name: "Aurora North",
    effect: "aurora",
    options: { colors: ["#a78bfa", "#818cf8", "#6ee7b7"], animationSpeed: 10 },
    description: "Animated gradient overlay evoking the Northern Lights.",
  },
  {
    name: "Aurora Sunset",
    effect: "aurora",
    options: { colors: ["#f97316", "#ef4444", "#ec4899", "#8b5cf6"], animationSpeed: 12 },
    description: "Warm sunset palette with flowing animation.",
  },

  // Smoke
  {
    name: "Smoke Noir",
    effect: "smoke",
    options: { blur: 24, density: 0.4, smokeColor: "#000000" },
    description: "Deep dark smoke effect with heavy blur.",
  },
  {
    name: "Smoke Mist",
    effect: "smoke",
    options: { blur: 18, density: 0.15, smokeColor: "#ffffff", turbulence: 0.02 },
    description: "Light misty smoke with animated turbulence.",
  },

  // Prism
  {
    name: "Prism Rainbow",
    effect: "prism",
    options: { blur: 8, saturation: 1.4, brightness: 1.1 },
    description: "Spectral color splitting with boosted saturation.",
  },
  {
    name: "Prism Warm",
    effect: "prism",
    options: { blur: 6, hueRotate: -20, saturation: 1.3, contrast: 1.15 },
    description: "Warm-shifted prism with enhanced contrast.",
  },

  // Holographic
  {
    name: "Holo Card",
    effect: "holographic",
    options: { blur: 8, iridescence: 0.5, animationSpeed: 4 },
    description: "Animated iridescent overlay like a holographic card.",
  },
  {
    name: "Holo Subtle",
    effect: "holographic",
    options: { blur: 12, iridescence: 0.2, animationSpeed: 10 },
    description: "Gentle holographic shimmer for understated UI.",
  },

  // Thin
  {
    name: "Thin Light",
    effect: "thin",
    options: { blur: 4, backgroundOpacity: 0.03 },
    description: "Barely-there glass for minimal, modern interfaces.",
  },
  {
    name: "Thin Dark",
    effect: "thin",
    options: { blur: 4, dark: true, backgroundOpacity: 0.05 },
    description: "Dark minimal glass with subtle border.",
  },
];

const EFFECT_TYPES: GlassEffectName[] = [
  "frosted", "crystal", "aurora", "smoke", "prism", "holographic", "thin",
];

export function Gallery() {
  const [filter, setFilter] = useState<GlassEffectName | "all">("all");

  const filtered = filter === "all" ? ALL_EFFECTS : ALL_EFFECTS.filter((e) => e.effect === filter);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-200 to-violet-200 bg-clip-text text-transparent">
          Glass Effect Gallery
        </h1>
        <p className="text-slate-400 mt-4 text-lg max-w-2xl mx-auto">
          Compare {ALL_EFFECTS.length} glass effects across {EFFECT_TYPES.length} approaches.
          Click any card to copy the code snippet.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-white text-slate-900"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          All ({ALL_EFFECTS.length})
        </button>
        {EFFECT_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
              filter === type
                ? "bg-white text-slate-900"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item, i) => (
          <EffectCard key={`${item.effect}-${i}`} {...item} />
        ))}
      </div>

      {/* Install snippet */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold mb-6">Get Started</h2>
        <div className="inline-block bg-slate-800/80 border border-slate-700 rounded-xl px-6 py-4">
          <code className="font-mono text-sm text-slate-200">npm install solid-glass</code>
        </div>
        <div className="mt-6 bg-slate-800/60 border border-slate-700 rounded-xl p-6 max-w-xl mx-auto text-left">
          <pre className="code-block text-slate-300 overflow-x-auto">{`import { Glass } from "solid-glass";
import "solid-glass/css";

function App() {
  return (
    <Glass effect="frosted" options={{ blur: 16 }}>
      <p>Hello from behind the glass</p>
    </Glass>
  );
}`}</pre>
        </div>
      </div>
    </div>
  );
}
