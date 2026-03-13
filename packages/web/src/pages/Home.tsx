import { createLiquidGlass, type SurfaceType } from "solid-glass/engines/svg-refraction";
import { NavLink } from "react-router-dom";
import { ArrowRight, Zap, Palette, Code2, TreePine, Box, Sparkles } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { CodeBlock } from "../components/CodeBlock";
import { CopyCommand } from "../components/CopyCommand";
import { EffectGrid } from "../components/EffectGrid";

const FEATURES = [
  { icon: Palette, title: "7 Distinct Effects", desc: "Frosted, Crystal, Aurora, Smoke, Prism, Holographic, and Thin — each with its own visual character." },
  { icon: Code2, title: "TypeScript-First", desc: "Full type definitions, IntelliSense support, and type-safe options for every effect." },
  { icon: TreePine, title: "Tree-Shakeable", desc: "Import only what you use. Each effect is independently importable for minimal bundle size." },
  { icon: Zap, title: "Zero Config", desc: "Sensible defaults for every effect. Drop in a <Glass> component and it just works." },
  { icon: Box, title: "React, Vue & Vanilla", desc: "First-class support for React, Vue 3, and vanilla JS. Same effects everywhere." },
  { icon: Sparkles, title: "16 Built-in Presets", desc: "Ready-made configurations for common patterns. From frostedDark to holoCard." },
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

  const glass = useMemo(
    () =>
      createLiquidGlass({
        width: 220,
        height: 120,
        radius: 16,
        bezelWidth: 35,
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
            width: 220,
            height: 120,
            borderRadius: 16,
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
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-full px-4 py-1.5 text-sm text-slate-300 mb-8">
          <Sparkles size={14} className="text-accent" />
          Multiple engines, 7+ effects, React / Vue / Vanilla JS
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
          <span className="bg-gradient-to-r from-white via-lime-100 to-white bg-clip-text text-transparent">Glass effects</span>
          <br />
          <span className="bg-gradient-to-r from-lime-300 via-yellow-300 to-lime-300 bg-clip-text text-transparent">for the web</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
          A comprehensive toolkit of glassmorphism effects for React, Vue, and vanilla JS.
          Frosted, Crystal, Aurora, Smoke, Prism, Holographic, and Thin — all with a simple, type-safe API.
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

      {/* Effect showcase grid */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <EffectGrid compact showDescriptions />
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

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-4">Why solid-glass?</h2>
        <p className="text-slate-400 text-center max-w-xl mx-auto mb-14">
          Everything you need to add beautiful glass effects to your app, nothing you don't.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Selective imports */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="bg-gradient-to-r from-slate-800/60 to-slate-800/40 border border-slate-700/50 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-3">Import what you need</h2>
          <p className="text-slate-400 mb-6">
            solid-glass is designed for tree-shaking. Use the main import for everything,
            or import specific sub-paths for leaner bundles.
          </p>
          <div className="space-y-3">
            {[
              { path: 'solid-glass/react', desc: 'React — Glass component + useGlass hook' },
              { path: 'solid-glass/vue', desc: 'Vue 3 — Glass component + useGlass composable' },
              { path: 'solid-glass/vanilla', desc: 'Vanilla JS — applyGlass() for any DOM element' },
              { path: 'solid-glass/effects', desc: 'Just the style generators (frosted, crystal, ...)' },
              { path: 'solid-glass/engines/svg-refraction', desc: 'Physics-based liquid glass via SVG displacement maps' },
              { path: 'solid-glass/presets', desc: 'Pre-configured effect combos' },
              { path: 'solid-glass/css', desc: 'The CSS file — required for visual effects' },
            ].map((imp) => (
              <div key={imp.path} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <code className="font-mono text-sm text-lime-300 shrink-0">import "{imp.path}"</code>
                <span className="text-sm text-slate-500">{imp.desc}</span>
              </div>
            ))}
          </div>
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
