import { Glass, type GlassEffectName } from "solid-glass";
import { NavLink } from "react-router-dom";
import { ArrowRight, Zap, Palette, Code2, TreePine, Box, Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";

const EFFECTS: { name: string; effect: GlassEffectName; desc: string; opts: Record<string, unknown> }[] = [
  { name: "Frosted", effect: "frosted", desc: "Classic Apple-style frosted glass", opts: { blur: 14, tintOpacity: 0.1 } },
  { name: "Crystal", effect: "crystal", desc: "Noise-based refraction distortion", opts: { blur: 8, distortionStrength: 50 } },
  { name: "Aurora", effect: "aurora", desc: "Animated gradient overlay", opts: { colors: ["#a78bfa", "#6ee7b7", "#fbbf24"] } },
  { name: "Smoke", effect: "smoke", desc: "Dark or light animated smoke", opts: { blur: 22, density: 0.35 } },
  { name: "Prism", effect: "prism", desc: "Spectral color splitting", opts: { saturation: 1.4, brightness: 1.1 } },
  { name: "Holographic", effect: "holographic", desc: "Iridescent card-like shimmer", opts: { iridescence: 0.45 } },
  { name: "Thin", effect: "thin", desc: "Barely-there minimal glass", opts: { blur: 4, backgroundOpacity: 0.03 } },
];

const FEATURES = [
  { icon: Palette, title: "7 Distinct Effects", desc: "Frosted, Crystal, Aurora, Smoke, Prism, Holographic, and Thin — each with its own visual character." },
  { icon: Code2, title: "TypeScript-First", desc: "Full type definitions, IntelliSense support, and type-safe options for every effect." },
  { icon: TreePine, title: "Tree-Shakeable", desc: "Import only what you use. Each effect is independently importable for minimal bundle size." },
  { icon: Zap, title: "Zero Config", desc: "Sensible defaults for every effect. Drop in a <Glass> component and it just works." },
  { icon: Box, title: "Component + Hook API", desc: "Use the <Glass> component for quick integration, or useGlass() hook for full control." },
  { icon: Sparkles, title: "16 Built-in Presets", desc: "Ready-made configurations for common patterns. From frostedDark to holoCard." },
];

const INSTALL_SNIPPET = `npm install solid-glass`;
const QUICK_SNIPPET = `import { Glass } from "solid-glass";
import "solid-glass/css";

function Card() {
  return (
    <Glass effect="frosted" options={{ blur: 16 }}>
      <h2>Behind the glass</h2>
    </Glass>
  );
}`;

const HOOK_SNIPPET = `import { useGlass } from "solid-glass";
import "solid-glass/css";

function Card() {
  const glass = useGlass("aurora", {
    colors: ["#a78bfa", "#6ee7b7"],
  });

  return (
    <div ref={glass.ref}
         className={glass.className}
         style={glass.style}>
      <p>Aurora vibes</p>
    </div>
  );
}`;

const PRESET_SNIPPET = `import { Glass, presets } from "solid-glass";

// Use a preset directly
<Glass
  effect={presets.frostedDark.effect}
  options={presets.frostedDark.options}
/>`;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="absolute top-3 right-3 p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
    >
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
    </button>
  );
}

export function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-full px-4 py-1.5 text-sm text-slate-300 mb-8">
          <Sparkles size={14} className="text-violet-400" />
          7 glass effects, 16 presets, 1 import
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
          <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">Glass effects</span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">for React</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
          A comprehensive toolkit of glassmorphism effects. Frosted, Crystal, Aurora, Smoke,
          Prism, Holographic, and Thin — all with a simple, type-safe API.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <NavLink
            to="/showcase"
            className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
          >
            View Showcase <ArrowRight size={18} />
          </NavLink>
          <div className="inline-flex items-center gap-3 bg-slate-800/80 border border-slate-700 px-6 py-3 rounded-xl">
            <code className="font-mono text-sm text-slate-200">{INSTALL_SNIPPET}</code>
            <CopyButton text={INSTALL_SNIPPET} />
          </div>
        </div>
      </section>

      {/* Effect showcase strip */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {EFFECTS.map((e) => (
            <div key={e.effect} className="group">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/30 via-violet-600/20 to-emerald-600/10 p-3 aspect-square flex items-center justify-center">
                <div className="absolute inset-0 opacity-40">
                  <div className="absolute top-2 left-2 w-8 h-8 bg-white/20 rounded-lg" />
                  <div className="absolute bottom-3 right-2 w-6 h-6 bg-pink-400/20 rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-yellow-400/15 rounded-lg rotate-12" />
                </div>
                <Glass
                  effect={e.effect}
                  options={e.opts as never}
                  className="w-full h-full flex items-center justify-center"
                  style={{ borderRadius: 14 }}
                >
                  <span className="text-white/70 text-xs font-medium text-center">{e.name}</span>
                </Glass>
              </div>
              <p className="text-[11px] text-slate-500 text-center mt-2">{e.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-4">Why solid-glass?</h2>
        <p className="text-slate-400 text-center max-w-xl mx-auto mb-14">
          Everything you need to add beautiful glass effects to your React app, nothing you don't.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center mb-4">
                <f.icon size={20} className="text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Code examples */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-4">Simple API, powerful results</h2>
        <p className="text-slate-400 text-center max-w-xl mx-auto mb-14">
          Three ways to use solid-glass — pick the approach that fits your codebase.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Component API", desc: "Drop-in component with props", code: QUICK_SNIPPET },
            { title: "Hook API", desc: "Full control with useGlass()", code: HOOK_SNIPPET },
            { title: "Presets", desc: "Ready-made configurations", code: PRESET_SNIPPET },
          ].map((ex) => (
            <div key={ex.title} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 relative">
              <h3 className="font-semibold text-white mb-1">{ex.title}</h3>
              <p className="text-xs text-slate-500 mb-4">{ex.desc}</p>
              <div className="bg-slate-900/80 rounded-xl p-4 relative">
                <CopyButton text={ex.code} />
                <pre className="code-block text-slate-300 overflow-x-auto text-[11px] leading-relaxed">{ex.code}</pre>
              </div>
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
              { path: 'solid-glass', desc: 'Everything — Glass, useGlass, all effects, presets, utils' },
              { path: 'solid-glass/effects', desc: 'Just the style generators (frosted, crystal, ...)' },
              { path: 'solid-glass/presets', desc: 'Pre-configured effect combos' },
              { path: 'solid-glass/css', desc: 'The CSS file — required for visual effects' },
            ].map((imp) => (
              <div key={imp.path} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <code className="font-mono text-sm text-blue-300 shrink-0">import "{imp.path}"</code>
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
          Explore the interactive showcase or dive into the docs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <NavLink
            to="/showcase"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Interactive Showcase <ArrowRight size={18} />
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
