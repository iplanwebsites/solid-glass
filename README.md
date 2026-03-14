# Solid Glass

Glass effects for the web. 8 effects across CSS, SVG filters, and physics-based refraction.

**[Live Demo & Docs](https://solidglass.dev)** | [npm](https://www.npmjs.com/package/solid-glass)

## Install

```bash
npm install solid-glass
```

## Quick Start

```jsx
import { Glass } from "solid-glass/react";
import "solid-glass/css";

<Glass effect="frosted" options={{ blur: 16 }}>
  Content behind glass
</Glass>
```

## Effects

- **frosted** — Classic Apple-style blur + tint *(CSS)*
- **crystal** — SVG noise-based refraction *(SVG filter)*
- **aurora** — Animated gradient overlay *(CSS)*
- **smoke** — Animated turbulence *(SVG filter)*
- **prism** — Spectral color splitting *(CSS)*
- **holographic** — Iridescent shimmer *(CSS)*
- **thin** — Minimal, barely-there glass *(CSS)*
- **refraction** — Physics-based Snell-Descartes refraction *(SVG filter)*

## SVG Refraction Engine

Physics-based glass using Snell-Descartes law (Chrome only):

```js
import { createLiquidGlass } from "solid-glass/engines/svg-refraction";

const glass = createLiquidGlass({
  width: 300, height: 200,
  surface: "convexSquircle",
  refractiveIndex: 1.5,
});

element.style.backdropFilter = glass.filterRef;
```

## Frameworks

- **React**: `import { Glass } from "solid-glass/react"`
- **Vue 3**: `import { Glass } from "solid-glass/vue"`
- **Vanilla**: `import { applyGlass } from "solid-glass/vanilla"`

## Development

```bash
pnpm install
pnpm dev        # Start dev server
pnpm build      # Build all packages
pnpm test       # Run tests
```

## Structure

```
packages/
  solid-glass/   # Core library (npm package)
  web/           # Documentation site (solidglass.dev)
```

## License

Apache 2.0 — [solidglass.dev](https://solidglass.dev)
