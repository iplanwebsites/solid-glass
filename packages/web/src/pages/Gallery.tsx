import { useState, useRef, useMemo, useEffect } from "react";
import { createLiquidGlass, type SurfaceType } from "solid-glass/engines/svg-refraction";
import { refractionPresets } from "solid-glass";
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
        ...refractionPresets.loupe,
        width: loupeSize,
        height: loupeSize,
        radius: loupeSize / 2,
        bezelWidth: 25,
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
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-white">Loupe</h3>
        <span className="text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5">SVG Filter</span>
        <span className="text-[10px] text-yellow-400/70">Chromium</span>
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

const GALLERY_PANEL_WIDTH = 260;
const GALLERY_PANEL_HEIGHT = 160;

function RefractionDemoCard() {
  const svgRef = useRef<Element | null>(null);
  const [surface, setSurface] = useState<SurfaceType>("convexSquircle");

  const glass = useMemo(
    () =>
      createLiquidGlass({
        ...refractionPresets.panel,
        width: GALLERY_PANEL_WIDTH,
        height: GALLERY_PANEL_HEIGHT,
        surface,
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
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-white">Refraction Panel</h3>
        <span className="text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5">SVG Filter</span>
        <span className="text-[10px] text-yellow-400/70">Chromium</span>
      </div>
      <div className="flex gap-1.5 mb-2">
        {(["convexCircle", "convexSquircle", "concave", "lip"] as SurfaceType[]).map((s) => (
          <button
            key={s}
            onClick={() => setSurface(s)}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
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
            width: GALLERY_PANEL_WIDTH,
            height: GALLERY_PANEL_HEIGHT,
            borderRadius: refractionPresets.panel.radius,
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
            <p className="text-white/90 font-medium text-sm">Physics-based glass</p>
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
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-lime-200 to-yellow-200 bg-clip-text text-transparent">
          Glass Effect Gallery
        </h1>
        <p className="text-slate-400 mt-4 text-lg max-w-2xl mx-auto">
          8 effects across CSS, SVG filters, and physics-based refraction. Hover to preview.
        </p>
      </div>

      {/* All CSS & SVG filter effects */}
      <EffectGrid showDescriptions showCopyButtons />

      {/* SVG refraction demos — same visual flow, no separate "engine" section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <LoupeDemoCard />
        <RefractionDemoCard />
      </div>
    </div>
  );
}
