import { useState, useRef, useMemo, useEffect } from "react";
import { createLiquidGlass, type SurfaceType } from "solid-glass/engines/svg-refraction";
import { EffectGrid } from "../components/EffectGrid";

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
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-lime-200 to-yellow-200 bg-clip-text text-transparent">
          Glass Effect Gallery
        </h1>
        <p className="text-slate-400 mt-4 text-lg max-w-2xl mx-auto">
          7 glass effects. Hover to see them in action. Click to copy code.
        </p>
      </div>

      {/* Effects Grid - same as home */}
      <EffectGrid showDescriptions showCopyButtons />

      {/* SVG Engine Showcase */}
      <div className="mt-16">
        <div className="text-center mb-10">
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
    </div>
  );
}
