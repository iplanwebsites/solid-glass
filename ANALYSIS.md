# Solid Glass — Critical UX & DX Analysis

## Executive Summary

Solid Glass is a well-architected glass effects library with 8 effects, multi-framework support, and zero runtime dependencies. This analysis identified key blockers and the library has been refactored with a **unified material model**: one flat `GlassOptions` type, templates instead of separate effect modes, auto-injected CSS, auto-fallback for unsupported browsers, and animation controls (bounciness, pause, easing).

---

## What Changed (Implemented)

### New Unified Architecture

The old API split effects into 8 separate types with 8 separate option interfaces. The new API treats glass as **one material with many controls**:

```tsx
// OLD — separate effects with nested options
<Glass effect="frosted" options={{ blur: 16, tintColor: "#3b82f6" }} />

// NEW — one flat interface, templates are starting points
<Glass template="frosted" blur={16} tintColor="#3b82f6" />

// Zero-config — works beautifully out of the box
<Glass>content</Glass>

// Named presets
<Glass template="frostedDark" blur={20} />

// Animation controls
<Glass template="aurora" paused bounciness={0.5} animationSpeed={4} />
```

### Key Files Changed

| File | What |
|------|------|
| `types.ts` | Unified `GlassOptions` with all controls flat. `TemplateName` + `TemplatePresetName` replace `GlassEffectName` |
| `templates.ts` | Replaces `presets.ts` — base templates + named presets + `resolveTemplate()` |
| `render-glass.ts` | Single rendering pipeline: template + overrides → CSS class + vars + SVG |
| `dom.ts` | Shared `injectSvgFilter()` + `ensureStyles()` (auto CSS injection) |
| `solid-glass.css` | Added animation control hooks (`--sg-animation-state`, `--sg-animation-easing`) |
| `react/Glass.tsx` | Flat props, `template` prop, auto CSS injection, ResizeObserver for refraction |
| `react/use-glass.ts` | Same: template + flat options, auto CSS, auto-measure |
| `vue/index.ts` | Full rewrite with flat props + shared DOM utils |
| `vanilla/index.ts` | Simplified: `applyGlass(el, "frosted", { blur: 16 })`, full cleanup |

### Problems Solved

1. **CSS import footgun** → Auto-injected on first mount via `ensureStyles()`
2. **Refraction throws without dimensions** → Graceful `--needs-measure` fallback + ResizeObserver auto-measure
3. **SVG effects silently fail** → Auto `detectRenderTier()` + fallback to CSS-equivalent template
4. **Nested options API** → All options are flat props on `<Glass>`
5. **Duplicate SVG injection** → Single `injectSvgFilter()` in `dom.ts`
6. **`removeGlass()` footgun** → Removed. `applyGlass()` returns full cleanup function
7. **Two preset systems** → Unified: `templates` (base) + `templatePresets` (named variations)
8. **No animation controls** → `paused`, `bounciness`, `animationEasing`, `animationSpeed`
9. **No dark mode** → `colorScheme: "light" | "dark" | "auto"` on any template

---

## Part 5: Website Improvements

### Current State

The website (solidglass.dev) has 6 pages: Home, Gallery, Playground (Showcase), Docs, Components, Kitchen. It's built with React 19 + Vike + Tailwind + Radix UI.

### 5.1 — Docs Need to Reflect "Templates" Not "Modes"

**Problem:** The docs page references the old API (`effect`, `options`, `presets`). It frames the 8 effects as separate "modes" with different option types, which contradicts the new mental model of **one material, many controls, templates as starting points**.

**Fix:**
- Restructure docs around the concept of **glass material properties** (blur, tint, distortion, color overlay, animation)
- Templates section should be front-and-center, not buried after API reference
- Show the progression: pick a template → customize individual properties → explore what each control does
- Remove per-effect option tables; replace with one unified property reference

### 5.2 — Showcase/Playground Should Lead with Templates

**Problem:** The Showcase page has a "Browse" mode showing 16 templates and a "Tweak" mode with sliders. Good structure, but it currently generates code using the old `effect`/`options` API.

**Fix:**
- Update code generation to produce flat-prop syntax: `<Glass template="frosted" blur={20} />`
- Add a "Start from scratch" mode with all sliders at neutral
- Group sliders by category: Core (blur, radius), Appearance (tint, border, shadow), Distortion, Color Overlay, Animation
- Show which controls are "active" for the current template vs available but unused
- Add a "Diff from template" view showing only what the user changed

### 5.3 — Gallery Should Be the Entry Point for Exploration

**Problem:** Gallery shows effects but doesn't let you easily jump to the Playground to customize what you see.

**Fix:**
- Each effect card should have an "Open in Playground" button that navigates to Showcase with that template pre-selected
- Add quick inline sliders (blur, opacity) directly on gallery cards for instant experimentation
- Replace "copy code" on hover with a "Customize" CTA — copying comes after customizing

### 5.4 — Home Page Hero Could Demo the Zero-Config Experience

**Problem:** The hero section shows animated bubbles (impressive but complex). It doesn't convey "this is easy to use."

**Fix:**
- Add a live "Try it" section near the top: a text input where you type a template name and see it applied in real-time
- Show the code updating live: `<Glass template="___">` as the user explores
- Keep the bubbles but add a "This is just `<Glass template="refraction">`" annotation

### 5.5 — Components Page Should Use Templates

**Problem:** The Components page shows 4 example components (GlassCard, GlassButton, Loupe, RefractionPanel) using the old API.

**Fix:**
- Update all examples to use `<Glass template="..." ...>` syntax
- Add more real-world examples: modals, tooltips, navigation bars, notification toasts
- Each example should show the minimal code needed — emphasize how little code glass effects require

### 5.6 — Docs Should Highlight the Material Customization Flow

Instead of a reference-style docs page, the docs should tell a story:

1. **Install** (30 seconds)
2. **Pick a template** — show all 8 templates with visual preview
3. **Customize** — show the 5 property categories with live examples
4. **Animate** — show animation controls (speed, bounciness, paused)
5. **Adapt to dark mode** — show `colorScheme="auto"`
6. **Framework reference** — React / Vue / Vanilla tabs
7. **Advanced: Physics refraction** — the engine for power users
8. **Browser support** — with auto-fallback explanation

### 5.7 — Add Search / Quick Reference

**Problem:** With 8 templates, 17+ presets, and 30+ options, finding the right thing is hard.

**Fix:**
- Add a search bar (or Cmd+K) that searches templates, presets, and properties
- Add a quick-reference cheat sheet page: one-page visual grid of all templates with their key properties

### 5.8 — Kitchen Page Rename

**Problem:** "Kitchen Sink" is developer jargon. Rename to "Experiments" or "Advanced" to better convey it's for exploring edge cases and combinations.

---

## Summary: Top Priorities

### Library (Done)
1. Unified flat API with templates ✅
2. Auto CSS injection ✅
3. Auto browser fallback ✅
4. Animation controls (bounciness, pause, easing) ✅
5. Auto-measure for refraction ✅
6. Dark mode support ✅

### Website (Next)
1. Update docs to reflect template-based API
2. Update Showcase code generation for new syntax
3. Add "Open in Playground" links from Gallery
4. Restructure docs as a guided flow (not just reference)
5. Add real-world component examples with new API
