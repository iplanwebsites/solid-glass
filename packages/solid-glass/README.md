# solid-glass

Glass effects for the web. Frosted, Crystal, Aurora, Smoke, Prism, Holographic, Thin — plus a physics-based SVG refraction engine.

**[Documentation & Demos](https://solidglass.dev)** | [GitHub](https://github.com/iplanwebsites/solid-glass)

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

## Features

- **7 Effects**: frosted, crystal, aurora, smoke, prism, holographic, thin
- **SVG Refraction Engine**: Physics-based glass using Snell-Descartes law (Chrome)
- **Any Framework**: React, Vue 3, or vanilla JS
- **Tree-shakeable**: Import only what you use (~4KB gzipped core)
- **TypeScript**: Full type definitions

## Usage

### React
```jsx
import { Glass, useGlass } from "solid-glass/react";
```

### Vue
```vue
<script setup>
import { Glass } from "solid-glass/vue";
</script>
```

### Vanilla JS
```js
import { applyGlass } from "solid-glass/vanilla";
const cleanup = applyGlass(element, "frosted", { blur: 16 });
```

### SVG Refraction Engine
```js
import { createLiquidGlass } from "solid-glass/engines/svg-refraction";

const glass = createLiquidGlass({
  width: 300, height: 200,
  surface: "convexSquircle",
  refractiveIndex: 1.5,
  // ...
});

element.style.backdropFilter = glass.filterRef;
```

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome/Edge | Full |
| Safari | Blur works, SVG distortion limited |
| Firefox | Basic fallback |

## License

Apache 2.0 — [solidglass.dev](https://solidglass.dev)
