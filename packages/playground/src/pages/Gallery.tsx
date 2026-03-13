import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { EffectCard } from "../components/EffectCard";
import type { GlassEffectName } from "solid-glass";
import { createLiquidGlass, type SurfaceType } from "solid-glass/engines/svg-refraction";

const BG_IMAGE = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80";

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

const LOUPE_IMAGE = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80";
const PANEL_IMAGE = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80";

function LoupeDemoCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<Element | null>(null);
  const [pos, setPos] = useState({ x: 140, y: 120 });
  const loupeSize = 120;

  const glass = useMemo(
    () =>
      createLiquidGlass({
        width: loupeSize,
        height: loupeSize,
        radius: loupeSize / 2,
        bezelWidth: 25,
        glassThickness: 200,
        blur: 0,
        refractiveIndex: 1.5,
        surface: "convexCircle" as SurfaceType,
        specularOpacity: 0.7,
        dpr: 1,
      }),
    []
  );

  useEffect(() => {
    const container = document.createElement("div");
    container.innerHTML = glass.svgFilter;
    const svg = container.firstElementChild;
    if (svg) {
      document.body.appendChild(svg);
      svgRef.current = svg;
    }
    return () => { svgRef.current?.remove(); };
  }, [glass.svgFilter]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: Math.max(loupeSize / 2, Math.min(rect.width - loupeSize / 2, e.clientX - rect.left)),
      y: Math.max(loupeSize / 2, Math.min(rect.height - loupeSize / 2, e.clientY - rect.top)),
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-lg font-semibold text-white">Loupe</h3>
          <span className="text-[10px] font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full px-2 py-0.5">
            Chrome only
          </span>
        </div>
        <p className="text-sm text-slate-400">Magnifying glass with real refraction. Move your mouse over the image.</p>
      </div>
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl h-64 cursor-none select-none"
        onMouseMove={handleMouseMove}
      >
        <img src={LOUPE_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div
          style={{
            position: "absolute",
            left: pos.x - loupeSize / 2,
            top: pos.y - loupeSize / 2,
            width: loupeSize,
            height: loupeSize,
            borderRadius: "50%",
            overflow: "hidden",
            backdropFilter: glass.filterRef,
            WebkitBackdropFilter: glass.filterRef,
            boxShadow: "0 0 0 2px rgba(255,255,255,0.3), 0 8px 32px rgba(0,0,0,0.3)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

function RefractionDemoCard() {
  const svgRef = useRef<Element | null>(null);
  const [surface, setSurface] = useState<SurfaceType>("convexSquircle");

  const glass = useMemo(
    () =>
      createLiquidGlass({
        width: 260,
        height: 160,
        radius: 20,
        bezelWidth: 40,
        glassThickness: 200,
        blur: 8,
        refractiveIndex: 1.5,
        surface,
        specularOpacity: 0.6,
        saturation: 1.2,
        dpr: 1,
      }),
    [surface]
  );

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
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-lg font-semibold text-white">LiquidGlassPanel</h3>
          <span className="text-[10px] font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full px-2 py-0.5">
            Chrome only
          </span>
        </div>
        <p className="text-sm text-slate-400">Physics-based panel with Snell-Descartes refraction.</p>
      </div>
      <div className="flex gap-2 mb-2">
        {(["convexCircle", "convexSquircle", "concave", "lip"] as SurfaceType[]).map((s) => (
          <button
            key={s}
            onClick={() => setSurface(s)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              surface === s ? "bg-white text-slate-900" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="relative overflow-hidden rounded-2xl h-64 flex items-center justify-center">
        <img src={PANEL_IMAGE} alt="" className="absolute inset-0 w-[115%] h-[115%] object-cover -top-[7%] -left-[7%]" />
        <div
          style={{
            width: 260,
            height: 160,
            borderRadius: 20,
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
            <p className="text-white/90 font-medium">Physics-based glass</p>
            <p className="text-white/50 text-xs mt-1">Surface: {surface}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Gallery() {
  const [filter, setFilter] = useState<GlassEffectName | "all">("all");
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [scrollOffset, setScrollOffset] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = filter === "all" ? ALL_EFFECTS : ALL_EFFECTS.filter((e) => e.effect === filter);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = gridRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseOffset({ x: nx * -20, y: ny * -20 });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!gridRef.current) return;
      const rect = gridRef.current.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Normalize: 0 when top enters viewport, 1 when bottom leaves
      const progress = (viewH - rect.top) / (viewH + rect.height);
      setScrollOffset(Math.max(0, Math.min(1, progress)) * -40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const imgX = mouseOffset.x;
  const imgY = mouseOffset.y + scrollOffset;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-lime-200 to-yellow-200 bg-clip-text text-transparent">
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

      {/* Grid — shared image background */}
      <div
        ref={gridRef}
        className="relative overflow-hidden rounded-3xl p-6 md:p-8"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMouseOffset({ x: 0, y: 0 })}
      >
        {/* Shared background image */}
        <img
          src={BG_IMAGE}
          alt=""
          className="absolute w-[115%] h-[115%] object-cover transition-transform duration-200 ease-out pointer-events-none"
          style={{
            top: "-7.5%",
            left: "-7.5%",
            transform: `translate(${imgX}px, ${imgY}px)`,
          }}
        />
        {/* Subtle overlay to soften the image slightly */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item, i) => (
            <EffectCard key={`${item.effect}-${i}`} {...item} />
          ))}
        </div>
      </div>

      {/* SVG Engine Showcase */}
      <div className="mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-lime-200 to-yellow-200 bg-clip-text text-transparent">
            SVG Refraction Engine
          </h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            Physics-based glass using Snell-Descartes refraction. Move your mouse to see the effect in action.
          </p>
          <span className="inline-block mt-3 text-[11px] font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full px-3 py-1">
            Chrome only
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LoupeDemoCard />
          <RefractionDemoCard />
        </div>
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
