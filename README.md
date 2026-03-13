# Solid Glass

Glass effects for the web. 7 shader-based effects plus a physics-based SVG refraction engine.

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

- **frosted** — Classic Apple-style blur + tint
- **crystal** — SVG noise-based refraction
- **aurora** — Animated gradient overlay
- **smoke** — Animated turbulence
- **prism** — Spectral color splitting
- **holographic** — Iridescent shimmer
- **thin** — Minimal, barely-there glass

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
