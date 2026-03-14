# Solid Glass — Critical UX & DX Analysis

## Executive Summary

Solid Glass is a well-architected glass effects library with 8 effects, multi-framework support, and zero runtime dependencies. The core effect system is clean. However, several friction points make it harder than necessary for developers to get started, explore effects, and ship production-ready glass UIs. This analysis identifies **blockers, complexity traps, and simplification opportunities**, then proposes a prioritized plan.

---

## Part 1: Blockers & Friction Points

### 1.1 — Mandatory CSS Import Is Easy to Forget

**Problem:** Every usage requires a separate `import "solid-glass/css"` statement. If forgotten, the component renders but looks completely broken — no blur, no borders, no pseudo-elements. There's no warning, no error, just invisible failure.

**Impact:** HIGH — This is the #1 "it doesn't work" moment for new users.

**Fix:**
- Auto-inject the critical CSS via a `<style>` tag on first component mount (opt-out, not opt-in)
- Keep the static CSS import for SSR / bundler-optimized flows, but make it optional
- Add a dev-mode console warning if the `.sg-` styles aren't detected in the document

---

### 1.2 — Refraction Effect Requires Static Width/Height

**Problem:** The `refraction` effect throws a runtime error if `width` and `height` are missing. This is the only effect with required options. Developers expecting to just swap `effect="frosted"` → `effect="refraction"` hit a wall.

**Impact:** HIGH — Breaks the "just swap effects" mental model. Especially painful in responsive layouts where width/height aren't known upfront.

**Fix (phased):**
- **Phase 1:** Auto-measure using `ResizeObserver` when width/height aren't provided, regenerating the displacement map on resize
- **Phase 2:** Support a CSS-only fallback mode for refraction (degraded but working) when dimensions are unknown
- Document the limitation clearly in the `<Glass>` component JSDoc

---

### 1.3 — SVG Filter Effects Silently Fail on Firefox/Safari

**Problem:** `crystal`, `smoke`, and `refraction` use SVG filters inside `backdrop-filter`, which is **Chromium 113+ only**. On Firefox and Safari, these effects render as invisible/broken with zero feedback.

**Impact:** HIGH — Developers test in Chrome, ship, then get bug reports from Safari/Firefox users.

**Fix:**
- `detectRenderTier()` already exists but is never called automatically
- Auto-detect on mount and either:
  - Fall back to the nearest CSS-tier equivalent (e.g., crystal → frosted with higher blur)
  - Emit a dev-mode console warning: `"[solid-glass] 'crystal' uses SVG filters which aren't supported in this browser. Falling back to 'frosted'."`
- Add a `fallback` prop: `<Glass effect="crystal" fallback="frosted">`

---

### 1.4 — No Preset Shorthand on the Component

**Problem:** There are 16 presets defined, but the `<Glass>` component doesn't accept a `preset` prop. Using presets requires manual destructuring:

```tsx
// Current — verbose
import { presets } from "solid-glass";
<Glass effect={presets.frostedDark.effect} options={presets.frostedDark.options} />

// Desired — simple
<Glass preset="frostedDark" />
```

**Impact:** MEDIUM — Presets are the fastest path to great results but are buried behind an extra import and manual wiring.

**Fix:**
- Add a `preset` prop to `<Glass>` that looks up and applies the preset config
- `preset` takes precedence over `effect`/`options` but can be overridden: `<Glass preset="frostedDark" blur={20} />`

---

### 1.5 — Options Object Indirection

**Problem:** The API has a split personality. `blur` and `radius` are top-level shorthands, but everything else must go through `options={{ ... }}`:

```tsx
// Inconsistent: blur is top-level, tintColor is nested
<Glass effect="frosted" blur={16} options={{ tintColor: "#3b82f6" }} />
```

This forces developers to check: "Is this prop top-level or does it go in options?"

**Impact:** MEDIUM — API friction on every customization.

**Fix:**
- Spread all effect-specific options as top-level props (using TypeScript generics to scope them by effect)
- Keep `options` as an escape hatch for programmatic use
- Example: `<Glass effect="frosted" blur={16} tintColor="#3b82f6" />`

---

## Part 2: Complexity That Can Be Simplified

### 2.1 — Duplicated SVG Injection Logic (3x)

**Problem:** The SVG filter injection pattern (create container → innerHTML → appendChild → cleanup) is copy-pasted across:
- `react/Glass.tsx` (lines 40-52)
- `react/use-glass.ts` (lines 28-40)
- `vue/index.ts` (lines 62-77 and 138-152)
- `vanilla/index.ts` (lines 36-44)

Four copies of the same DOM manipulation code.

**Fix:** Extract into a shared `injectSvgFilter(svgMarkup: string): () => void` utility that all adapters call. Single place to fix bugs, add error handling, or optimize.

---

### 2.2 — Over-Exported Main Entry Point

**Problem:** The main `index.ts` exports 30+ symbols including internal utilities (`hexToRgb`, `rgbToHex`, `cn`, `uniqueId`). New developers see a wall of imports and don't know where to start.

**Impact:** LOW-MEDIUM — Cognitive overhead, not a blocker.

**Fix:**
- Keep the deep imports (`solid-glass/effects`, `solid-glass/engines/svg-refraction`) for power users
- The main entry should export only what 90% of users need: `Glass`, `useGlass`, `presets`, `presetNames`, effect names/types
- Move color utils and internal helpers to a `solid-glass/utils` sub-path export

---

### 2.3 — removeGlass() Is a Footgun

**Problem:** `removeGlass()` in the vanilla adapter only removes the CSS class — it does NOT clean up CSS variables or SVG filters. The JSDoc says "for full cleanup, use the function returned by `applyGlass`", but this is a trap for developers who find `removeGlass` in autocomplete and assume it's the correct cleanup method.

**Fix:** Either:
- Make `removeGlass()` do full cleanup (track applied state internally), or
- Remove it entirely — the cleanup function from `applyGlass` is the right pattern

---

### 2.4 — No "Zero Config" Happy Path

**Problem:** The simplest possible usage still requires understanding effects, options, and CSS imports:

```tsx
import { Glass } from "solid-glass/react";
import "solid-glass/css";
<Glass effect="frosted" options={{ blur: 16 }}>...</Glass>
```

For a glass effects library, the default should be beautiful with zero configuration.

**Fix:**
- Make `effect` default already work beautifully without any options (it already defaults to "frosted" but requires CSS import)
- Goal: `<Glass>content</Glass>` should look great out of the box with auto-injected styles
- No effect prop needed, no options needed, no CSS import needed

---

### 2.5 — Refraction Presets Are Disconnected

**Problem:** There are two separate preset systems:
1. `presets` — 16 presets for the `<Glass>` component
2. `refractionPresets` — 5 presets for the `createLiquidGlass()` engine

These live in the same file but serve different APIs. The refraction presets omit `width`/`height` (correctly), but this split is confusing: "Why are there two preset objects?"

**Fix:**
- Unify under a single `presets` object where refraction presets auto-detect dimensions
- Or clearly namespace: `presets.effects.*` vs `presets.engine.*` with clear docs on when to use which

---

## Part 3: Missing Features That Would Unlock Exploration

### 3.1 — No Interactive Playground / Live Tuning

**Problem:** Developers can't easily experiment with parameters. They have to edit code, rebuild, check — slow iteration loop.

**Fix:**
- Ship a `<GlassPlayground>` dev component that renders a glass panel with live sliders for all effect parameters
- Could be a separate `solid-glass/dev` export (tree-shaken out of prod builds)
- Alternatively, a CLI `npx solid-glass playground` that opens a local browser playground

---

### 3.2 — No Dark/Light Mode Awareness

**Problem:** Only `thin` has a `dark` prop. Other effects require manual color adjustments for dark mode. In 2026, dark mode support should be first-class.

**Fix:**
- Add a `colorScheme?: "light" | "dark" | "auto"` option to `GlassBaseOptions`
- `"auto"` uses `prefers-color-scheme` to swap defaults (tint color, border color, shadow color)
- Presets should have light/dark variants automatically

---

### 3.3 — No Animation Control API

**Problem:** `aurora`, `smoke`, and `holographic` have animations, but there's no way to pause, resume, or sync them to user interaction (scroll, hover). Animation parameters are static.

**Fix:**
- Return animation control handles: `{ pause(), resume(), setSpeed(n) }`
- Support CSS `animation-play-state` toggling via a prop: `<Glass effect="aurora" paused={!isVisible} />`

---

## Part 4: Prioritized Implementation Plan

### Phase 1 — Remove Friction (Quick Wins)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 1.1 | Auto-inject CSS on first mount + dev warning | HIGH | Small |
| 1.2 | Add `preset` prop to `<Glass>` component | MEDIUM | Small |
| 1.3 | Extract shared `injectSvgFilter()` utility | LOW | Small |
| 1.4 | Remove or fix `removeGlass()` | LOW | Tiny |

### Phase 2 — Safety & Compatibility

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 2.1 | Auto-detect render tier + graceful fallback for SVG effects | HIGH | Medium |
| 2.2 | Add `fallback` prop to `<Glass>` | MEDIUM | Small |
| 2.3 | Dev-mode browser compat warnings | MEDIUM | Small |

### Phase 3 — API Refinement

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 3.1 | Flatten effect options as top-level props | MEDIUM | Medium |
| 3.2 | Auto-measure refraction dimensions with ResizeObserver | HIGH | Medium |
| 3.3 | Trim main entry exports, move internals to sub-paths | LOW | Small |
| 3.4 | Unify preset systems | LOW | Small |

### Phase 4 — Exploration & Delight

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 4.1 | Dark/light mode awareness (`colorScheme` option) | MEDIUM | Medium |
| 4.2 | Animation control API (pause/resume/speed) | MEDIUM | Medium |
| 4.3 | `<GlassPlayground>` dev component for live tuning | HIGH | Large |

---

## Summary: The 3 Highest-Impact Changes

1. **Auto-inject CSS** — Eliminates the #1 "why doesn't it work?" moment
2. **Browser fallback for SVG effects** — Prevents silent failures in prod
3. **Preset prop on `<Glass>`** — Unlocks the fastest path from install to beautiful UI

These three changes would transform the library from "powerful but requires reading docs" to "works beautifully in 30 seconds."
