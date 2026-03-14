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
          Import the <code className="text-blue-300">Glass</code> component and start using it immediately.
          No CSS import needed — styles are auto-injected.
        </p>
        <CodeBlock code={`import { Glass } from "solid-glass";

function App() {
  return (
    <Glass template="frosted" blur={14} tintOpacity={0.1}>
      <p>Content behind frosted glass</p>
    </Glass>
  );
}`} />
        <div className="mt-6 p-4 rounded-lg border border-slate-700 bg-slate-800/50">
          <p className="text-sm text-slate-300 font-semibold mb-2">What happens automatically:</p>
          <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
            <li><strong className="text-slate-300">Auto CSS injection</strong> — no manual CSS import needed</li>
            <li><strong className="text-slate-300">Auto browser fallback</strong> — SVG filter templates fall back to CSS-only on unsupported browsers</li>
            <li><strong className="text-slate-300">Auto-measure for refraction</strong> — uses ResizeObserver, no manual width/height needed</li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: "templates",
    title: "Templates & Presets",
    content: (
      <>
        <p className="text-slate-400 mb-4">
          The <code className="text-blue-300">template</code> prop selects a base glass effect.
          Named presets are pre-configured combinations of a template with specific prop values.
        </p>
        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Base Templates</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 text-slate-300 font-semibold">Template</th>
                <th className="text-left py-3 text-slate-300 font-semibold">Technique</th>
                <th className="text-left py-3 text-slate-300 font-semibold">Key Props</th>
              </tr>
            </thead>
            <tbody className="text-slate-400">
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">frosted</td><td>Backdrop blur + tint + inner shadow</td><td>blur, tintColor, tintOpacity, shadowBlur, borderColor</td></tr>
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">crystal</td><td>SVG feTurbulence + feDisplacementMap</td><td>noiseFrequency, distortion, octaves, seed</td></tr>
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">aurora</td><td>Animated gradient overlay + blur</td><td>colors, animationSpeed, angle, colorOpacity</td></tr>
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">smoke</td><td>Animated turbulence + heavy blur</td><td>density, smokeColor, turbulence, animated</td></tr>
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">prism</td><td>Backdrop filter chain (hue, saturate, contrast)</td><td>hueRotate, saturation, brightness, contrast</td></tr>
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">holographic</td><td>Animated iridescent overlay</td><td>iridescence, animationSpeed, colors</td></tr>
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">thin</td><td>Minimal blur + subtle border</td><td>backgroundOpacity, borderOpacity, tintColor</td></tr>
              <tr><td className="py-3 text-white font-mono">refraction</td><td>Snell-Descartes refraction via feDisplacementMap</td><td>surface, refractiveIndex, glassThickness</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-slate-500 text-sm mt-4">All templates share: <code className="text-slate-300">borderRadius</code>, <code className="text-slate-300">opacity</code></p>

        <h3 className="text-lg font-semibold text-white mt-8 mb-3">Named Presets</h3>
        <p className="text-slate-400 mb-4">
          Use a named preset directly as the <code className="text-blue-300">template</code> value — no extra props required:
        </p>
        <CodeBlock code={`// Named presets work just like templates
<Glass template="frostedDark" />
<Glass template="auroraSunset" />
<Glass template="holoCard" />

// Available named presets:
// frostedLight, frostedDark, frostedBlue
// crystalClear, crystalAmber
// auroraNorth, auroraSunset
// smokeNoir, smokeMist
// prismRainbow, prismWarm
// holoCard, holoSubtle
// thinLight, thinDark
// refractionPanel, refractionLoupe`} />
      </>
    ),
  },
  {
    id: "component-api",
    title: "Component API",
    content: (
      <>
        <p className="text-slate-400 mb-4">
          The <code className="text-blue-300">&lt;Glass&gt;</code> component accepts flat props — no nested options object needed.
        </p>
        <CodeBlock code={`import { Glass } from "solid-glass";

<Glass
  template="aurora"              // Base template or named preset
  blur={16}                      // Override any template default
  colors={["#a78bfa", "#6ee7b7"]}
  borderRadius={20}
  as="section"                   // Render as any HTML tag
  className="my-class"           // Extra class names
  style={{ padding: "2rem" }}    // Extra inline styles
>
  {children}
</Glass>`} />
        <p className="text-slate-400 mt-4">
          The component merges CSS variables from the template with any custom <code className="text-slate-300">style</code> you pass.
          It forwards refs and passes through all standard HTML attributes.
        </p>
      </>
    ),
  },
  {
    id: "animation",
    title: "Animation Controls",
    content: (
      <>
        <p className="text-slate-400 mb-4">
          Templates that support animation (aurora, smoke, holographic) accept animation props directly:
        </p>
        <CodeBlock code={`<Glass
  template="aurora"
  animated                    // Enable animation (default: true for animated templates)
  paused={false}              // Pause / resume
  bounciness={0.3}            // Spring tension (0-1)
  animationEasing="bouncy"    // Easing curve
/>

// Pause animation on hover, etc.
const [paused, setPaused] = useState(false);
<Glass template="holographic" paused={paused} />`} />
      </>
    ),
  },
  {
    id: "hook-api",
    title: "Hook API",
    content: (
      <>
        <p className="text-slate-400 mb-4">
          For custom integration, use the <code className="text-blue-300">useGlass()</code> hook:
        </p>
        <CodeBlock code={`import { useGlass } from "solid-glass";

function MyComponent() {
  const { className, cssVars, svgFilter } = useGlass("crystal", {
    distortion: 50,
  });

  return (
    <>
      {svgFilter}
      <div className={className} style={{ ...cssVars, padding: "2rem" }}>
        Full control over rendering
      </div>
    </>
  );
}`} />
        <p className="text-slate-400 mt-4">
          The hook returns <code className="text-slate-300">className</code>, <code className="text-slate-300">cssVars</code>, and <code className="text-slate-300">svgFilter</code>.
          SVG filters are provided as a React element to render into the DOM.
        </p>
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
          CSS is auto-injected — no manual import needed.
        </p>
      </>
    ),
  },
  {
    id: "vue-api",
    title: "Vue API",
    content: (
      <>
        <p className="text-slate-400 mb-4">
          Use the <code className="text-blue-300">&lt;SGlass&gt;</code> component in Vue 3 with the same flat-prop API:
        </p>
        <CodeBlock code={`<template>
  <SGlass template="frosted" :blur="14" :tintOpacity="0.1">
    <p>Frosted glass in Vue</p>
  </SGlass>
</template>

<script setup>
import { SGlass } from "solid-glass/vue";
</script>`} />
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
              </tr>
            </thead>
            <tbody className="text-slate-400">
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">GlassCard</td><td>Frosted glass card with title/subtitle slots</td></tr>
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">GlassButton</td><td>Interactive glass button with hover states</td></tr>
              <tr className="border-b border-slate-800"><td className="py-3 text-white font-mono">Loupe</td><td>Magnifying glass overlay</td></tr>
              <tr><td className="py-3 text-white font-mono">RefractionPanel</td><td>Physics-based glass panel wrapper</td></tr>
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
          SVG filter templates automatically fall back to CSS-only rendering on unsupported browsers.
          All effects use progressive enhancement — tint and border still render gracefully.
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
