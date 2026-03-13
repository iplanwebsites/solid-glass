import { useState } from "react";
import { CodeBlock } from "../components/CodeBlock";

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
          Try it in the <a href="#/showcase" className="text-blue-400 hover:text-blue-300 underline">Playground</a>.
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
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">GlassCard</td><td>Frosted glass card with title/subtitle slots</td><td><span className="text-violet-400">Shaders</span></td></tr>
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">GlassButton</td><td>Interactive glass button with hover states</td><td><span className="text-violet-400">Shaders</span></td></tr>
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">Loupe</td><td>Magnifying glass overlay</td><td><span className="text-emerald-400">SVG Refraction</span></td></tr>
              <tr><td className="py-3 text-white font-mono">LiquidGlassPanel</td><td>Physics-based glass panel wrapper</td><td><span className="text-emerald-400">SVG Refraction</span></td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-slate-400 mt-4 text-sm">
          See live demos on the <a href="#/components" className="text-blue-400 hover:text-blue-300 underline">Components page</a>.
        </p>
      </>
    ),
  },
  {
    id: "browser-support",
    title: "Browser Support",
    content: (
      <>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 text-slate-300 font-semibold">Browser</th>
                <th className="text-left py-3 text-slate-300 font-semibold">Support</th>
              </tr>
            </thead>
            <tbody className="text-slate-400">
              <tr className="border-b border-slate-800"><td className="py-3">Chrome / Edge</td><td>Full support</td></tr>
              <tr className="border-b border-slate-800"><td className="py-3">Safari</td><td>Blur works; SVG distortion limited</td></tr>
              <tr className="border-b border-slate-800"><td className="py-3">Firefox</td><td>Basic fallback (no distortion)</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-slate-400 mt-4 text-sm">
          All effects use progressive enhancement — if backdrop-filter isn't supported,
          the tint/border still renders gracefully.
        </p>
      </>
    ),
  },
];

export function Docs() {
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
