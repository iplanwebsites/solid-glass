import { NavLink } from "react-router-dom";
import { ArrowRight, Zap, Palette, Box, Sparkles } from "lucide-react";
import { CodeBlock } from "../components/CodeBlock";
import { EffectGrid } from "../components/EffectGrid";
import { GlassHero } from "../components/GlassHero";

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

export function Home() {
  return (
    <div>
      {/* Glass Hero with animated bubbles */}
      <GlassHero
        tagline="Customize your style, choose between 2 different engines for the best support"
      />

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
