import { createLiquidGlass, type SurfaceType } from "solid-glass/engines/svg-refraction";
import { NavLink } from "react-router-dom";
import { ArrowRight, Zap, Palette, Box, Sparkles } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { CodeBlock } from "../components/CodeBlock";
import { CopyCommand } from "../components/CopyCommand";
import { EffectGrid } from "../components/EffectGrid";

const FEATURES = [
  { icon: Sparkles, title: "Physics-Based Refraction", desc: "Snell-Descartes light bending via SVG displacement maps. Not a blur filter — actual glass physics." },
  { icon: Palette, title: "7 Effect Types", desc: "Frosted, Crystal, Aurora, Smoke, Prism, Holographic, Thin — each with distinct visual character." },
  { icon: Box, title: "Any Framework", desc: "First-class React and Vue components, plus vanilla JS. Same API shape everywhere." },
  { icon: Zap, title: "Tiny & Tree-Shakeable", desc: "~4KB gzipped core. Import only the effects you use. No runtime dependencies." },
];

const REACT_SNIPPET = `import { Glass } from "solid-glass/react";
import "solid-glass/css";

function Card() {
  return (
    <Glass effect="crystal" options={{
      blur: 7,
      tintColor: "#0ad9f5",
      tintOpacity: 0.23,
      noiseFrequency: 0.032,
      distortionStrength: 40,
    }}>
      <h2>Behind the glass</h2>
    </Glass>
  );
}`;

const VUE_SNIPPET = `<template>
  <Glass effect="aurora" :options="{
    colors: ['#a78bfa', '#6ee7b7'],
    blur: 16,
  }">
    <p>Aurora vibes</p>
  </Glass>
</template>

<script setup>
import { Glass } from "solid-glass/vue";
import "solid-glass/css";
</script>`;

const VANILLA_SNIPPET = `import { applyGlass } from "solid-glass/vanilla";
import "solid-glass/css";

const card = document.querySelector("#card");
const cleanup = applyGlass(card, "frosted", {
  blur: 16,
  tintColor: "#3b82f6",
  tintOpacity: 0.12,
});

// Later: cleanup();`;

const LOUPE_IMAGE = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80";
const PANEL_IMAGE = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80";

// Approved liquid glass styles
const LIQUID_GLASS_STYLES = {
  defaultPanel: {
    width: 280,
    height: 200,
    radius: 54,
    bezelWidth: 22,
    glassThickness: 130,
    blur: 2,
    refractiveIndex: 2.05,
    surface: "convexSquircle" as SurfaceType,
    specularOpacity: 0.7,
  },
} as const;

function LoupeDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<Element | null>(null);
  const [pos, setPos] = useState({ x: 140, y: 100 });
  const loupeSize = 100;

  const glass = useMemo(
    () =>
      createLiquidGlass({
        width: loupeSize,
        height: loupeSize,
        radius: loupeSize / 2,
        bezelWidth: 20,
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
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl h-48 cursor-none select-none"
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
  );
}

function PanelDemo() {
  const svgRef = useRef<Element | null>(null);
  const [surface, setSurface] = useState<SurfaceType>("convexSquircle");
  const baseStyle = LIQUID_GLASS_STYLES.defaultPanel;

  const glass = useMemo(
    () =>
      createLiquidGlass({
        ...baseStyle,
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
      <div className="flex gap-1.5 flex-wrap">
        {(["convexCircle", "convexSquircle", "concave", "lip"] as SurfaceType[]).map((s) => (
          <button
            key={s}
            onClick={() => setSurface(s)}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
              surface === s ? "bg-white text-slate-900" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="relative overflow-hidden rounded-2xl h-48 flex items-center justify-center">
        <img src={PANEL_IMAGE} alt="" className="absolute inset-0 w-[115%] h-[115%] object-cover -top-[7%] -left-[7%]" />
        <div
          style={{
            width: baseStyle.width,
            height: baseStyle.height,
            borderRadius: baseStyle.radius,
            overflow: "hidden",
            backdropFilter: glass.filterRef,
            WebkitBackdropFilter: glass.filterRef,
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="text-center px-3 relative z-10">
            <p className="text-white/90 font-medium text-sm">Physics-based glass</p>
            <p className="text-white/50 text-[10px] mt-0.5">Surface: {surface}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-full px-4 py-1.5 text-sm text-slate-300 mb-8">
          <Sparkles size={14} className="text-accent" />
          Physics-based glass for React, Vue & Vanilla JS
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
          <span className="bg-gradient-to-r from-white via-lime-100 to-white bg-clip-text text-transparent">Real glass effects.</span>
          <br />
          <span className="bg-gradient-to-r from-lime-300 via-yellow-300 to-lime-300 bg-clip-text text-transparent">Drop in, done.</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
          CSS blur looks flat. solid-glass gives you physics-based refraction,
          7 distinct effects, and works everywhere — from React to vanilla JS.
          ~4KB gzipped. Zero dependencies.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <NavLink
            to="/gallery"
            className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
          >
            View Gallery <ArrowRight size={18} />
          </NavLink>
          <CopyCommand command="npm install solid-glass" />
        </div>
      </section>

      {/* Framework logos */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <p className="text-center text-sm text-slate-500 mb-6">Works with</p>
        <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
          {/* React */}
          <div className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
              <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 01-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9s-1.17 0-1.71.03c-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03s1.17 0 1.71-.03c.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26s-1.18-1.63-3.28-2.26c-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26s1.18 1.63 3.28 2.26c.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96a22.7 22.7 0 012.4-.36c.48-.67.99-1.31 1.51-1.9z"/>
            </svg>
            <span className="font-medium text-sm">React</span>
          </div>
          {/* Vue */}
          <div className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
              <path d="M2 3h3.5L12 15l6.5-12H22L12 21 2 3m4.5 0h3L12 7.58 14.5 3h3L12 13.08 6.5 3z"/>
            </svg>
            <span className="font-medium text-sm">Vue</span>
          </div>
          {/* shadcn/ui */}
          <div className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3L3 21h18L12 3z"/>
            </svg>
            <span className="font-medium text-sm">shadcn/ui</span>
          </div>
          {/* Vanilla JS */}
          <div className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
              <path d="M3 3h18v18H3V3m4.73 15.04c.4.85 1.19 1.55 2.54 1.55 1.5 0 2.53-.8 2.53-2.55v-5.78h-1.7V17c0 .86-.35 1.08-.9 1.08-.58 0-.82-.4-1.09-.87l-1.38.83m5.98-.18c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.83-1.15.83-.83 0-1.31-.43-1.67-1.03l-1.38.8z"/>
            </svg>
            <span className="font-medium text-sm">Vanilla JS</span>
          </div>
        </div>
      </section>

      {/* SVG Refraction Engine Hero */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-lime-200 to-yellow-200 bg-clip-text text-transparent">
            SVG Refraction Engine
          </h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            Physics-based glass using Snell-Descartes law. Real light refraction, not just blur.
          </p>
          <span className="inline-block mt-3 text-[10px] font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full px-3 py-1">
            Chrome only
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-1">Loupe</h3>
            <p className="text-xs text-slate-500 mb-4">Magnifying glass with real refraction. Move your mouse.</p>
            <LoupeDemo />
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-1">LiquidGlassPanel</h3>
            <p className="text-xs text-slate-500 mb-3">Physics-based panel with switchable surface types.</p>
            <PanelDemo />
          </div>
        </div>
      </section>

      {/* Effect showcase grid */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <EffectGrid compact showDescriptions />
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-4">Why solid-glass?</h2>
        <p className="text-slate-400 text-center max-w-xl mx-auto mb-14">
          Everything you need to add beautiful glass effects to your app, nothing you don't.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-500/20 to-yellow-500/20 flex items-center justify-center mb-4">
                <f.icon size={20} className="text-accent" />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Code examples */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-4">One library, every framework</h2>
        <p className="text-slate-400 text-center max-w-xl mx-auto mb-14">
          Use solid-glass with React, Vue, or vanilla JS — same effects, same API shape.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "React", desc: "Component & hook API", code: REACT_SNIPPET, lang: "tsx" },
            { title: "Vue", desc: "Composition API component", code: VUE_SNIPPET, lang: "vue" },
            { title: "Vanilla JS", desc: "Zero-framework, pure DOM", code: VANILLA_SNIPPET, lang: "ts" },
          ].map((ex) => (
            <div key={ex.title} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 relative">
              <h3 className="font-semibold text-white mb-1">{ex.title}</h3>
              <p className="text-xs text-slate-500 mb-4">{ex.desc}</p>
              <CodeBlock code={ex.code} lang={ex.lang} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to add some glass?</h2>
        <p className="text-slate-400 mb-8">
          Explore the gallery or dive into the docs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <NavLink
            to="/gallery"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-lime-500 to-yellow-500 text-slate-900 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            View Gallery <ArrowRight size={18} />
          </NavLink>
          <NavLink
            to="/docs"
            className="inline-flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-700 transition-colors"
          >
            Read the Docs
          </NavLink>
        </div>
      </section>
    </div>
  );
}
