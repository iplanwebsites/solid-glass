# Solid Glass

A lightweight, customizable glass effect library for modern web applications. Create Apple-like glass effects with dynamic distortion, customizable tints, and smooth animations.

**[Live Demo & Docs](https://solidglass.dev)** | [GitHub](https://github.com/iplanwebsites/solid-glass)

## Features

- **Fully Customizable**: Control every aspect of the glass effect
- **Lightweight**: Minimal dependencies, ~4KB gzipped core
- **Framework Agnostic**: Works with vanilla JS, React, and Vue
- **Two Rendering Tiers**: CSS & SVG filter effects + physics-based SVG refraction
- **TypeScript**: Full type definitions included

## Installation

```bash
npm i solid-glass
```

## Quick Start

### React

```jsx
import { Glass } from "solid-glass/react";
import "solid-glass/css";

function App() {
  return (
    <Glass effect="frosted" options={{ blur: 12, tintOpacity: 0.1 }}>
      <h1>Your Content Here</h1>
    </Glass>
  );
}
```

### Vue

```vue
<template>
  <Glass effect="crystal" :options="{ blur: 10 }">
    <h1>Your Content Here</h1>
  </Glass>
</template>

<script setup>
import { Glass } from "solid-glass/vue";
import "solid-glass/css";
</script>
```

### Vanilla JS

```js
import { applyGlass } from "solid-glass/vanilla";
import "solid-glass/css";

const element = document.getElementById("my-glass-element");
const cleanup = applyGlass(element, "frosted", {
  blur: 16,
  tintColor: "#ffffff",
  tintOpacity: 0.1,
});

// Later: cleanup();
```

### SVG Refraction Engine

Physics-based glass using Snell-Descartes light bending:

```js
import { createLiquidGlass } from "solid-glass/engines/svg-refraction";

const glass = createLiquidGlass({
  width: 300,
  height: 200,
  surface: "convexSquircle",
  refractiveIndex: 1.5,
  glassThickness: 120,
  bezelWidth: 40,
});

element.style.backdropFilter = glass.filterRef;
```

## API Reference

### Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| blur | number | 12 | Backdrop blur amount in pixels |
| tintColor | string | '#ffffff' | Glass tint color |
| tintOpacity | number | 0.1 | Glass tint opacity (0-1) |
| noiseFrequency | number | 0.008 | Turbulence noise frequency |
| distortionStrength | number | 50 | Distortion effect strength |

### SVG Engine Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| width/height | number | required | Dimensions in pixels |
| surface | string | 'convexCircle' | Surface type (convexCircle, convexSquircle, etc.) |
| refractiveIndex | number | 1.5 | Glass refractive index |
| glassThickness | number | 120 | Virtual glass thickness |
| bezelWidth | number | 40 | Edge bevel width |
| specularOpacity | number | 0.25 | Highlight intensity |

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome/Edge | Full |
| Safari | Blur works, SVG distortion limited |
| Firefox | Basic fallback |

## Inspirations

- Apple's iOS 26 Liquid Glass design
- [chakachuk's CodePen](https://codepen.io) for the original glass-distortion filter
- [@archisvaze's liquid-glass experiment](https://github.com/archisvaze/liquid-glass)

## License

Apache-2.0

---

*Note: This package is NOT affiliated with Apple.*
