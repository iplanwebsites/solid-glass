import { useState, useEffect, useMemo, useRef } from "react";
import { Glass } from "solid-glass";
import { createLiquidGlass, type SurfaceType } from "solid-glass/engines/svg-refraction";
import { Sparkles, Gem, Box, Menu, Search, Bell, X, Info, CheckCircle, AlertTriangle, User, Lock, Mail } from "lucide-react";
import { CodeBlock } from "../components/CodeBlock";

/* ─── Render Tier Badge ─── */
function TierBadge({ tier }: { tier: string }) {
  if (tier === "svg-filter") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5">
        <Gem size={10} /> SVG Filter
      </span>
    );
  }
  if (tier === "webgl") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-2 py-0.5">
        <Box size={10} /> WebGL
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full px-2 py-0.5">
      <Sparkles size={10} /> CSS
    </span>
  );
}

const BG_IMAGE = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";

/* ─── GlassCard Demo ─── */
function GlassCardDemo() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-white">GlassCard</h3>
          <TierBadge tier="css" />
        </div>
        <p className="text-slate-400 text-sm">A ready-to-use frosted glass card with title, subtitle, and content slots.</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl h-80 flex items-center justify-center">
        <img src={BG_IMAGE} alt="" className="absolute inset-0 w-[120%] h-[120%] object-cover -top-[10%] -left-[10%]" />
        <div className="relative z-10 flex gap-4 flex-wrap justify-center px-4">
          <Glass template="frosted" blur={16} tintColor="#ffffff" tintOpacity={0.1} borderRadius={20} className="p-6 w-64">
            <h3 className="text-lg font-semibold text-white mb-1">Notification</h3>
            <p className="text-sm text-white/60 mb-3">3 new messages</p>
            <p className="text-sm text-white/80">Preview of the latest message content goes here...</p>
          </Glass>
          <Glass template="crystal" blur={8} tintColor="#8b5cf6" tintOpacity={0.08} borderRadius={20} className="p-6 w-64">
            <h3 className="text-lg font-semibold text-white mb-1">Analytics</h3>
            <p className="text-sm text-white/60 mb-3">Weekly report</p>
            <p className="text-sm text-white/80">Up 24% from last week</p>
          </Glass>
        </div>
      </div>

      <CodeBlock code={`import { GlassCard } from "solid-glass/components/react";

<GlassCard title="Notification" subtitle="3 new messages">
  <p>Preview of the latest message...</p>
</GlassCard>

// Or with crystal effect:
<GlassCard title="Analytics" effect="crystal" blur={8}>
  <p>Up 24% from last week</p>
</GlassCard>`} />
    </div>
  );
}

/* ─── GlassButton Demo ─── */
function GlassButtonDemo() {
  const [clicked, setClicked] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-white">GlassButton</h3>
          <TierBadge tier="css" />
        </div>
        <p className="text-slate-400 text-sm">Interactive glass-styled buttons with hover and active states.</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl h-48 flex items-center justify-center bg-gradient-to-br from-blue-600 via-violet-600 to-fuchsia-600">
        <div className="flex gap-4 flex-wrap justify-center px-4">
          {(["frosted", "crystal", "thin", "aurora"] as const).map((tmpl) => (
            <Glass
              key={tmpl}
              as="button"
              template={tmpl}
              blur={12}
              tintColor="#ffffff"
              tintOpacity={0.08}
              borderRadius={12}
              className={`px-5 py-2.5 text-sm font-medium text-white cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${clicked === tmpl ? "ring-2 ring-white/50" : ""}`}
              onClick={() => { setClicked(tmpl); setTimeout(() => setClicked(null), 1000); }}
            >
              {tmpl.charAt(0).toUpperCase() + tmpl.slice(1)}
            </Glass>
          ))}
        </div>
      </div>

      {clicked && (
        <p className="text-sm text-green-400 text-center">Clicked: {clicked}!</p>
      )}

      <CodeBlock code={`import { GlassButton } from "solid-glass/components/react";

<GlassButton onClick={() => alert("Clicked!")}>
  Get Started
</GlassButton>

<GlassButton effect="crystal" disabled>
  Disabled
</GlassButton>`} />
    </div>
  );
}

/* ─── Loupe Demo ─── */
function LoupeDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<Element | null>(null);
  const [pos, setPos] = useState({ x: 150, y: 120 });
  const loupeSize = 140;

  const glass = useMemo(
    () =>
      createLiquidGlass({
        width: loupeSize,
        height: loupeSize,
        radius: loupeSize / 2,
        bezelWidth: 30,
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
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-white">Loupe</h3>
          <TierBadge tier="svg-filter" />
        </div>
        <p className="text-slate-400 text-sm">
          A magnifying glass component using the SVG refraction engine. Move your mouse over the image.
          <span className="text-yellow-400/80 ml-1">(Chromium only)</span>
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl h-80 cursor-none select-none"
        onMouseMove={handleMouseMove}
      >
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
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

      <CodeBlock code={`import { Loupe } from "solid-glass/components/react";

<div style={{ position: "relative" }}>
  <img src="photo.jpg" />
  <Loupe x={150} y={150} size={120} />
</div>`} />
    </div>
  );
}

/* ─── RefractionPanel Demo ─── */
function RefractionPanelDemo() {
  const svgRef = useRef<Element | null>(null);
  const [surface, setSurface] = useState<SurfaceType>("convexSquircle");

  const glass = useMemo(
    () =>
      createLiquidGlass({
        width: 300,
        height: 200,
        radius: 20,
        bezelWidth: 50,
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
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-white">RefractionPanel</h3>
          <TierBadge tier="svg-filter" />
        </div>
        <p className="text-slate-400 text-sm">
          A panel using the SVG refraction engine with Snell-Descartes law.
          <span className="text-yellow-400/80 ml-1">(Chromium only)</span>
        </p>
      </div>

      <div className="flex gap-2 justify-center mb-4">
        {(["convexCircle", "convexSquircle", "concave", "lip"] as SurfaceType[]).map((s) => (
          <button
            key={s}
            onClick={() => setSurface(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${surface === s ? "bg-white text-slate-900" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
          >
            {s.replace("convex", "Convex ").replace("concave", "Concave").replace("lip", "Lip")}
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-2xl h-80 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80"
          alt=""
          className="absolute inset-0 w-[115%] h-[115%] object-cover -top-[7%] -left-[7%]"
        />
        <div
          style={{
            width: 300,
            height: 200,
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

      <CodeBlock code={`import { RefractionPanel } from "solid-glass/components/react";

<RefractionPanel
  width={320}
  height={200}
  bezelWidth={40}
  surface="${surface}"
>
  <h2>Physics-based glass</h2>
</RefractionPanel>`} />
    </div>
  );
}

/* ─── Main Page ─── */
const COMPONENTS = [
  { id: "glass-card", label: "GlassCard", tier: "css" as const, Component: GlassCardDemo },
  { id: "glass-button", label: "GlassButton", tier: "css" as const, Component: GlassButtonDemo },
  { id: "loupe", label: "Loupe", tier: "svg-filter" as const, Component: LoupeDemo },
  { id: "liquid-glass-panel", label: "RefractionPanel", tier: "svg-filter" as const, Component: RefractionPanelDemo },
];

export function Components() {
  const [active, setActive] = useState("glass-card");

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-blue-200 to-violet-200 bg-clip-text text-transparent">
        Components
      </h1>
      <p className="text-slate-400 mb-4">
        Ready-to-use example components built with solid-glass. Copy into your project and customize.
      </p>
      <p className="text-sm text-slate-500 mb-12">
        Source code: <a href="https://github.com/iplanwebsites/solid-glass/tree/main/components/react" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">components/react/</a> on GitHub
      </p>

      <div className="grid lg:grid-cols-[200px_1fr] gap-10">
        {/* Sidebar */}
        <nav className="hidden lg:block sticky top-24 self-start">
          <ul className="space-y-1 border-l border-slate-800">
            {COMPONENTS.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => {
                    setActive(c.id);
                    document.getElementById(c.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`block pl-4 py-1.5 text-sm border-l-2 -ml-px transition-colors text-left w-full ${
                    active === c.id
                      ? "border-blue-400 text-white"
                      : "border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <span className="font-mono">{c.label}</span>
                  <span className={`ml-2 text-[9px] ${c.tier === "svg-filter" ? "text-emerald-500" : "text-violet-400"}`}>
                    {c.tier === "svg-filter" ? "SVG Filter" : "CSS"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="min-w-0 space-y-20">
          {COMPONENTS.map((c) => (
            <section key={c.id} id={c.id} className="scroll-mt-24">
              <c.Component />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
