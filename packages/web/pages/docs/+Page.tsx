import { useState } from "react";
import { CodeBlock } from "../../src/components/CodeBlock";
import { RenderTierInline } from "../../src/components/RenderTierTag";

const sections = [
  {
    id: "installation",
    title: "Installation",
    content: (
      <>
        <p className="text-slate-400 mb-4">Install with your preferred package manager:</p>
        <CodeBlock code={`npm install solid-glass\n# or\npnpm add solid-glass\n# or\nyarn add solid-glass`} lang="bash" />
        <p className="text-slate-400 mt-4">
          <strong className="text-white">Peer dependencies:</strong> React 18+, Vue 3.3+, or neither (vanilla JS). All are optional.
        </p>
      </>
    ),
  },
  {
    id: "quick-start",
    title: "Quick Start",
    content: (
      <>
        <p className="text-slate-400 mb-4">
          Import the <code className="text-blue-300">Glass</code> component and the CSS file. That's it.
        </p>
        <CodeBlock code={`import { Glass } from "solid-glass";
import "solid-glass/css";

function App() {
  return (
    <Glass effect="frosted" options={{ blur: 16 }}>
      <p>Content behind frosted glass</p>
    </Glass>
  );
}`} />
      </>
    ),
  },
  {
    id: "effects",
    title: "Available Effects",
    content: (
      <>
        <p className="text-slate-400 mb-6">Each effect produces different visual characteristics:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 text-slate-300 font-semibold">Effect</th>
                <th className="text-left py-3 text-slate-300 font-semibold">Technique</th>
                <th className="text-left py-3 text-slate-300 font-semibold">Key Options</th>
              </tr>
            </thead>
            <tbody className="text-slate-400">
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">frosted</td><td>Backdrop blur + tint + inner shadow</td><td>blur, tintColor, tintOpacity, shadowBlur, borderColor</td></tr>
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">crystal</td><td>SVG feTurbulence + feDisplacementMap</td><td>noiseFrequency, distortionStrength, octaves, seed</td></tr>
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">aurora</td><td>Animated gradient overlay + blur</td><td>colors, animationSpeed, angle, colorOpacity</td></tr>
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">smoke</td><td>Animated turbulence + heavy blur</td><td>density, smokeColor, turbulence, animated</td></tr>
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">prism</td><td>Backdrop filter chain (hue, saturate, contrast)</td><td>hueRotate, saturation, brightness, contrast</td></tr>
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">holographic</td><td>Animated iridescent overlay</td><td>iridescence, animationSpeed, colors</td></tr>
              <tr><td className="py-3 text-white font-mono">thin</td><td>Minimal blur + subtle border</td><td>backgroundOpacity, borderOpacity, dark</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-slate-500 text-sm mt-4">All effects share: <code className="text-slate-300">borderRadius</code>, <code className="text-slate-300">opacity</code></p>
      </>
    ),
  },
  {
    id: "component-api",
    title: "Component API",
    content: (
      <>
        <p className="text-slate-400 mb-4">
          The <code className="text-blue-300">&lt;Glass&gt;</code> component is the primary way to use solid-glass.
        </p>
        <CodeBlock code={`<Glass
  effect="aurora"                           // Effect type
  options={{ colors: ["#a78bfa", "#6ee7b7"] }} // Effect-specific options
  radius={20}                                // Shorthand for borderRadius
  blur={16}                                  // Shorthand for blur
  as="section"                               // Render as any HTML tag
  className="my-class"                       // Extra class names
  style={{ padding: "2rem" }}                // Extra inline styles
>
  {children}
</Glass>`} />
        <p className="text-slate-400 mt-4">
          The component merges your CSS variables from the effect with any custom <code className="text-slate-300">style</code> you pass.
          It forwards refs and passes through all standard HTML attributes.
        </p>
      </>
    ),
  },
  {
    id: "hook-api",
    title: "Hook API",
    content: (
      <>
        <p className="text-slate-400 mb-4">
          For maximum control, use the <code className="text-blue-300">useGlass()</code> hook:
        </p>
        <CodeBlock code={`import { useGlass } from "solid-glass";

function MyComponent() {
  const glass = useGlass("crystal", {
    blur: 10,
    distortionStrength: 50,
  });

  return (
    <div
      ref={glass.ref}
      className={glass.className}
      style={{ ...glass.style, padding: "2rem" }}
    >
      Full control over rendering
    </div>
  );
}`} />
        <p className="text-slate-400 mt-4">
          The hook returns <code className="text-slate-300">ref</code>, <code className="text-slate-300">className</code>, and <code className="text-slate-300">style</code>.
          Apply them to any element. SVG filters (for crystal/smoke) are automatically injected and cleaned up.
        </p>
      </>
    ),
  },
  {
    id: "presets",
    title: "Presets",
    content: (
      <>
        <p className="text-slate-400 mb-4">
          16 built-in presets for quick prototyping:
        </p>
        <CodeBlock code={`import { Glass, presets } from "solid-glass";

// Use a preset
<Glass
  effect={presets.frostedDark.effect}
  options={presets.frostedDark.options}
/>

// Available presets:
// frostedLight, frostedDark, frostedBlue
// crystalClear, crystalAmber
// auroraNorth, auroraSunset
// smokeNoir, smokeMist
// prismRainbow, prismWarm
// holoCard, holoSubtle
// thinLight, thinDark`} />
      </>
    ),
  },
  {
    id: "selective-imports",
    title: "Selective Imports",
    content: (
      <>
        <p className="text-slate-400 mb-4">
          For smaller bundles, import only what you need:
        </p>
        <CodeBlock code={`// Full package
import { Glass, useGlass, frosted, presets } from "solid-glass";

// Just effect generators (no React dependency)
import { frosted, crystal } from "solid-glass/effects";

// Just presets
import { presets, presetNames } from "solid-glass/presets";

// CSS (required — import once at app root)
import "solid-glass/css";

// SVG refraction engine (no framework dependency)
import { createLiquidGlass } from "solid-glass/engines/svg-refraction";`} />
      </>
    ),
  },
  {
    id: "vue-api",
    title: "Vue API",
    content: (
      <>
        <p className="text-slate-400 mb-4">
          Use the <code className="text-blue-300">&lt;Glass&gt;</code> component or <code className="text-blue-300">useGlass</code> composable in Vue 3:
        </p>
        <CodeBlock code={`<template>
  <Glass effect="frosted" :options="{ blur: 16 }">
    <p>Frosted glass in Vue</p>
  </Glass>
</template>

<script setup>
import { Glass } from "solid-glass/vue";
import "solid-glass/css";
</script>`} />
        <p className="text-slate-400 mt-4 mb-4">
          Or use the composable for full control:
        </p>
        <CodeBlock code={`<script setup>
import { useGlass } from "solid-glass/vue";

const { glassRef, className, style } = useGlass("crystal", {
  blur: 10, distortionStrength: 50,
});
</script>

<template>
  <div :ref="glassRef" :class="className" :style="style">
    Content
  </div>
</template>`} />
      </>
    ),
  },
  {
    id: "vanilla-api",
    title: "Vanilla JS API",
    content: (
      <>
        <p className="text-slate-400 mb-4">
          No framework? Use <code className="text-blue-300">applyGlass</code> directly on any DOM element:
        </p>
        <CodeBlock code={`import { applyGlass } from "solid-glass/vanilla";
import "solid-glass/css";

const el = document.querySelector("#my-card");
const cleanup = applyGlass(el, "frosted", {
  blur: 16,
  tintColor: "#ffffff",
  tintOpacity: 0.1,
});

// Remove the effect later:
cleanup();`} />
        <p className="text-slate-400 mt-4">
          Returns a cleanup function that removes all styles and injected SVG filters.
        </p>
      </>
    ),
  },
  {
    id: "svg-refraction-engine",
    title: "SVG Refraction Engine",
    content: (
      <>
        <p className="text-slate-400 mb-4">
          A separate physics-based engine that uses Snell-Descartes law and canvas-generated displacement maps
          for realistic glass refraction. <strong className="text-white">Chromium-only.</strong>
        </p>
        <CodeBlock code={`import { createLiquidGlass } from "solid-glass/engines/svg-refraction";

const glass = createLiquidGlass({
  width: 300,
  height: 200,
  radius: 20,
  bezelWidth: 50,
  glassThickness: 200,
  blur: 8,
  refractiveIndex: 1.5,
  surface: "convexSquircle",  // convexCircle | convexSquircle | concave | lip
  specularOpacity: 0.6,
});

// Inject SVG filter into DOM
document.body.insertAdjacentHTML("beforeend", glass.svgFilter);

// Apply as backdrop-filter
element.style.backdropFilter = glass.filterRef;`} />
        <p className="text-slate-400 mt-4 text-sm">
          Physics approach based on <a href="https://kube.io/blog/liquid-glass-css-svg" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Chris Feijoo's blog post</a>.
          Try it in the <a href="/playground" className="text-blue-400 hover:text-blue-300 underline">Playground</a>.
        </p>
      </>
    ),
  },
  {
    id: "example-components",
    title: "Example Components",
    content: (
      <>
        <p className="text-slate-400 mb-4">
          Ready-to-use React components in <code className="text-blue-300">components/react/</code>. Copy into your project and customize:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 text-slate-300 font-semibold">Component</th>
                <th className="text-left py-3 text-slate-300 font-semibold">Description</th>
                <th className="text-left py-3 text-slate-300 font-semibold">Engine</th>
              </tr>
            </thead>
            <tbody className="text-slate-400">
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">GlassCard</td><td>Frosted glass card with title/subtitle slots</td><td><RenderTierInline tier="css" /></td></tr>
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">GlassButton</td><td>Interactive glass button with hover states</td><td><RenderTierInline tier="css" /></td></tr>
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">Loupe</td><td>Magnifying glass overlay</td><td><RenderTierInline tier="svg-backdrop" /></td></tr>
              <tr><td className="py-3 text-white font-mono">RefractionPanel</td><td>Physics-based glass panel wrapper</td><td><RenderTierInline tier="svg-backdrop" /></td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-slate-400 mt-4 text-sm">
          See live demos on the <a href="/components" className="text-blue-400 hover:text-blue-300 underline">Components page</a>.
        </p>
      </>
    ),
  },
  {
    id: "rendering-tiers",
    title: "Rendering Tiers",
    content: (
      <>
        <p className="text-slate-400 mb-4">
          Solid-glass uses three rendering approaches. Each template is built on one of them, and browser support depends on which approach it uses — not on the template name.
        </p>

        {/* Tier 1: CSS */}
        <div className="mb-6 bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            <h4 className="text-white font-semibold text-sm">CSS</h4>
            <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5">All browsers</span>
          </div>
          <p className="text-slate-400 text-sm mb-2">
            Pure CSS effects using <code className="text-blue-300">backdrop-filter: blur()</code>, box-shadow, gradients, and keyframe animations.
            No SVG or JavaScript at render time.
          </p>
          <p className="text-slate-500 text-xs">
            <strong className="text-slate-400">Templates:</strong> frosted, aurora, prism, holographic, thin
          </p>
        </div>

        {/* Tier 2: SVG Filter */}
        <div className="mb-6 bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <h4 className="text-white font-semibold text-sm">CSS + SVG Filter</h4>
            <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5">All browsers</span>
          </div>
          <p className="text-slate-400 text-sm mb-2">
            Standard <code className="text-blue-300">backdrop-filter: blur()</code> for the blur, plus an SVG displacement filter
            applied via the CSS <code className="text-blue-300">filter: url(#id)</code> property.
            Both are long-established, broadly supported CSS features that compose together — the SVG{" "}
            <code className="text-blue-300">feTurbulence</code> distortion runs on the already-blurred backdrop.
          </p>
          <p className="text-slate-500 text-xs">
            <strong className="text-slate-400">Templates:</strong> crystal, smoke
          </p>
        </div>

        {/* Tier 3: SVG Backdrop */}
        <div className="mb-6 bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <h4 className="text-white font-semibold text-sm">SVG Backdrop Filter</h4>
            <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">Chromium 113+</span>
          </div>
          <p className="text-slate-400 text-sm mb-2">
            The entire SVG filter chain — Snell-Descartes displacement maps, specular highlights, saturation adjustments — is passed
            directly as the <code className="text-blue-300">backdrop-filter</code> value:{" "}
            <code className="text-blue-300">backdrop-filter: url(#svg-filter)</code>.
            Only Chromium browsers support SVG filter references inside <code className="text-blue-300">backdrop-filter</code>;
            Firefox and Safari will fall back to a simpler CSS effect automatically.
          </p>
          <p className="text-slate-500 text-xs">
            <strong className="text-slate-400">Templates:</strong> refraction
          </p>
        </div>

        {/* Key distinction callout */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-6">
          <p className="text-blue-300 text-sm font-medium mb-1">Why the distinction?</p>
          <p className="text-slate-400 text-sm">
            Crystal and smoke both generate <code className="text-slate-300">&lt;svg&gt;&lt;filter&gt;</code> elements, just like refraction.
            The difference is <em>how</em> that SVG filter is applied in CSS.
            Crystal/smoke use the standard CSS <code className="text-slate-300">filter</code> property to apply the SVG displacement on top of a regular <code className="text-slate-300">backdrop-filter: blur()</code> — two
            broadly-supported features composed together.
            Refraction puts the SVG filter <em>inside</em> <code className="text-slate-300">backdrop-filter</code> itself, which is a Chromium-only capability.
          </p>
        </div>

        {/* Browser compat table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 text-slate-300 font-semibold">Browser</th>
                <th className="text-left py-3 text-slate-300 font-semibold"><span className="text-violet-400">CSS</span></th>
                <th className="text-left py-3 text-slate-300 font-semibold"><span className="text-emerald-400">CSS + SVG Filter</span></th>
                <th className="text-left py-3 text-slate-300 font-semibold"><span className="text-amber-400">SVG Backdrop</span></th>
              </tr>
            </thead>
            <tbody className="text-slate-400">
              <tr className="border-b border-slate-800"><td className="py-3">Chrome / Edge 113+</td><td className="text-green-400">Full</td><td className="text-green-400">Full</td><td className="text-green-400">Full</td></tr>
              <tr className="border-b border-slate-800"><td className="py-3">Safari 15.4+</td><td className="text-green-400">Full</td><td className="text-green-400">Full</td><td className="text-amber-400">Falls back to CSS</td></tr>
              <tr className="border-b border-slate-800"><td className="py-3">Firefox 103+</td><td className="text-green-400">Full</td><td className="text-green-400">Full</td><td className="text-amber-400">Falls back to CSS</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-slate-500 text-sm mt-4">
          All effects use progressive enhancement — unsupported tiers automatically fall back to a simpler rendering. The tint, border, and shadow always render.
        </p>
      </>
    ),
  },
];

export default function Page() {
  const [active, setActive] = useState("installation");

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-blue-200 to-violet-200 bg-clip-text text-transparent">
        Documentation
      </h1>
      <p className="text-slate-400 mb-12">Everything you need to use solid-glass in your project.</p>

      <div className="grid lg:grid-cols-[220px_1fr] gap-10">
        {/* Sidebar nav */}
        <nav className="hidden lg:block sticky top-24 self-start">
          <ul className="space-y-1 border-l border-slate-800">
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => {
                    setActive(s.id);
                    document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`block pl-4 py-1.5 text-sm border-l-2 -ml-px transition-colors text-left w-full ${
                    active === s.id
                      ? "border-blue-400 text-white"
                      : "border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {s.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="min-w-0 space-y-16">
          {sections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2 className="text-2xl font-bold text-white mb-6 scroll-mt-24">{s.title}</h2>
              {s.content}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
