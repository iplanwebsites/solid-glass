import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Glass, type TemplateName, templatePresets, type TemplatePresetName, templatePresetNames, templateRenderTiers } from "solid-glass";
import { createLiquidGlass, type SurfaceType, SURFACE_EQUATIONS } from "solid-glass/engines/svg-refraction";
import { RotateCcw, Image, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { CodeBlock } from "../components/CodeBlock";
import { RenderTierBadge, RenderTierTag, ChromiumNotice } from "../components/RenderTierTag";

/* ─── Framework Code Generators ─── */
type Framework = "react" | "vue" | "vanilla";

function generateReactSnippet(template: string, options: Record<string, unknown>) {
  const propsStr = Object.entries(options).map(([k, v]) => typeof v === "string" ? `${k}="${v}"` : `${k}={${JSON.stringify(v)}}`).join("\n  ");
  return `import { Glass } from "solid-glass/react";
import "solid-glass/css";

<Glass template="${template}"
  ${propsStr}>
  {children}
</Glass>`;
}

function generateVueSnippet(template: string, options: Record<string, unknown>) {
  const propsStr = Object.entries(options).map(([k, v]) => typeof v === "string" ? `${k}="${v}"` : `:${k}="${JSON.stringify(v).replace(/"/g, "'")}"`).join("\n    ");
  return `<template>
  <Glass template="${template}"
    ${propsStr}>
    <slot />
  </Glass>
</template>

<script setup>
import { Glass } from "solid-glass/vue";
import "solid-glass/css";
</script>`;
}

function generateVanillaSnippet(template: string, options: Record<string, unknown>) {
  return `import { applyGlass } from "solid-glass/vanilla";
import "solid-glass/css";

const el = document.querySelector("#my-card");
const cleanup = applyGlass(el, "${template}", ${JSON.stringify(options, null, 2)});

// Later: cleanup();`;
}

function generateRefractionSnippet(refractionOpts: Record<string, unknown>) {
  return `import { createLiquidGlass } from "solid-glass/engines/svg-refraction";

const glass = createLiquidGlass(${JSON.stringify(refractionOpts, null, 2)});

// Inject SVG filter into DOM
document.body.insertAdjacentHTML("beforeend", glass.svgFilter);

// Apply as backdrop-filter (Chromium only)
element.style.backdropFilter = glass.filterRef;`;
}

function getSnippet(framework: Framework, template: string, options: Record<string, unknown>) {
  if (framework === "vue") return generateVueSnippet(template, options);
  if (framework === "vanilla") return generateVanillaSnippet(template, options);
  return generateReactSnippet(template, options);
}

/* ─── Framework Tab Bar ─── */
const FRAMEWORKS: { key: Framework; label: string }[] = [
  { key: "react", label: "React" },
  { key: "vue", label: "Vue" },
  { key: "vanilla", label: "Vanilla JS" },
];

function FrameworkTabs({ active, onChange }: { active: Framework; onChange: (f: Framework) => void }) {
  return (
    <div className="flex gap-1">
      {FRAMEWORKS.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${active === f.key ? "bg-slate-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Shared Data ─── */
const CSS_EFFECTS: TemplateName[] = ["frosted", "crystal", "aurora", "smoke", "prism", "holographic", "thin"];

const GRADIENT_BGS = [
  "from-blue-600 via-violet-600 to-fuchsia-600",
  "from-emerald-600 via-teal-600 to-cyan-600",
  "from-orange-600 via-red-600 to-pink-600",
  "from-slate-700 via-slate-800 to-slate-900",
];

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
];

/* ─── Templates ─── */
type Template = {
  name: string;
  template: TemplateName;
  overrides: Record<string, unknown>;
  surface?: SurfaceType;
  description: string;
};

const TEMPLATES: Template[] = [
  { name: "Frosted Light", template: "frosted", overrides: { blur: 12, tintColor: "#ffffff", tintOpacity: 0.1 }, description: "Classic light frosted glass." },
  { name: "Frosted Dark", template: "frosted", overrides: { blur: 14, tintColor: "#000000", tintOpacity: 0.2, shadowColor: "rgba(0,0,0,0.3)" }, description: "Dark-tinted frosted variant." },
  { name: "Crystal Clear", template: "crystal", overrides: { blur: 6, noiseFrequency: 0.006, distortion: 40 }, description: "Subtle refraction." },
  { name: "Crystal Cyan", template: "crystal", overrides: { blur: 7, borderRadius: 4, tintOpacity: 0.23, noiseFrequency: 0.032, distortion: 40, tintColor: "#0ad9f5" }, description: "Vivid cyan refraction." },
  { name: "Aurora North", template: "aurora", overrides: { colors: ["#a78bfa", "#818cf8", "#6ee7b7"] }, description: "Northern Lights gradient." },
  { name: "Smoke Noir", template: "smoke", overrides: { blur: 24, density: 0.4, smokeColor: "#000000" }, description: "Deep dark smoke." },
  { name: "Prism Rainbow", template: "prism", overrides: { blur: 8, saturation: 1.4, brightness: 1.1 }, description: "Spectral splitting." },
  { name: "Holo Card", template: "holographic", overrides: { blur: 8, iridescence: 0.5, animationSpeed: 4 }, description: "Iridescent shimmer." },
  { name: "Thin Light", template: "thin", overrides: { blur: 4, backgroundOpacity: 0.03 }, description: "Barely-there glass." },
  // Refraction templates
  { name: "Convex Lens", template: "refraction", surface: "convexCircle", overrides: { bezelWidth: 50, glassThickness: 200, blur: 8, refractiveIndex: 1.5, specularOpacity: 0.6 }, description: "Classic magnifying glass." },
  { name: "Squircle Panel", template: "refraction", surface: "convexSquircle", overrides: { bezelWidth: 50, glassThickness: 200, blur: 8, refractiveIndex: 1.5, specularOpacity: 0.6 }, description: "Rounded square glass." },
  { name: "Concave Dish", template: "refraction", surface: "concave", overrides: { bezelWidth: 40, glassThickness: 180, blur: 6, refractiveIndex: 1.4, specularOpacity: 0.5 }, description: "Inward-curving surface." },
  { name: "Sharp Refract", template: "refraction", surface: "convexSquircle", overrides: { bezelWidth: 30, glassThickness: 400, blur: 4, refractiveIndex: 2.0, specularOpacity: 0.8 }, description: "Dramatic light bending." },
  { name: "Soft Blur", template: "refraction", surface: "convexSquircle", overrides: { bezelWidth: 60, glassThickness: 150, blur: 14, refractiveIndex: 1.3, specularOpacity: 0.4 }, description: "Heavy blur, gentle refraction." },
  { name: "Lip Edge", template: "refraction", surface: "lip", overrides: { bezelWidth: 50, glassThickness: 200, blur: 6, refractiveIndex: 1.5, specularOpacity: 0.5 }, description: "Raised lip edge." },
];

/* ─── Sliders ─── */
type SliderConfig = { key: string; label: string; min: number; max: number; step: number; defaultValue: number; templates: TemplateName[] };
const SLIDERS: SliderConfig[] = [
  { key: "blur", label: "Blur", min: 0, max: 40, step: 1, defaultValue: 12, templates: CSS_EFFECTS },
  { key: "borderRadius", label: "Radius", min: 0, max: 50, step: 1, defaultValue: 20, templates: CSS_EFFECTS },
  { key: "tintOpacity", label: "Tint Opacity", min: 0, max: 0.5, step: 0.01, defaultValue: 0.08, templates: ["frosted", "crystal"] },
  { key: "shadowBlur", label: "Shadow Blur", min: 0, max: 30, step: 1, defaultValue: 6, templates: ["frosted"] },
  { key: "noiseFrequency", label: "Noise Freq", min: 0.001, max: 0.05, step: 0.001, defaultValue: 0.008, templates: ["crystal"] },
  { key: "distortion", label: "Distortion", min: 0, max: 150, step: 1, defaultValue: 60, templates: ["crystal"] },
  { key: "colorOpacity", label: "Color Opacity", min: 0, max: 0.5, step: 0.01, defaultValue: 0.15, templates: ["aurora"] },
  { key: "animationSpeed", label: "Anim Speed (s)", min: 1, max: 30, step: 1, defaultValue: 8, templates: ["aurora", "holographic", "smoke"] },
  { key: "density", label: "Density", min: 0, max: 0.8, step: 0.05, defaultValue: 0.3, templates: ["smoke"] },
  { key: "hueRotate", label: "Hue Rotate", min: -180, max: 180, step: 5, defaultValue: 0, templates: ["prism"] },
  { key: "saturation", label: "Saturation", min: 0.5, max: 2, step: 0.1, defaultValue: 1.2, templates: ["prism"] },
  { key: "iridescence", label: "Iridescence", min: 0, max: 1, step: 0.05, defaultValue: 0.4, templates: ["holographic"] },
  { key: "backgroundOpacity", label: "BG Opacity", min: 0, max: 0.2, step: 0.005, defaultValue: 0.02, templates: ["thin"] },
  // Refraction-specific
  { key: "bezelWidth", label: "Bezel Width", min: 10, max: 100, step: 1, defaultValue: 50, templates: ["refraction"] },
  { key: "glassThickness", label: "Glass Thickness", min: 20, max: 500, step: 10, defaultValue: 200, templates: ["refraction"] },
  { key: "blur", label: "Blur", min: 0, max: 20, step: 1, defaultValue: 8, templates: ["refraction"] },
  { key: "refractiveIndex", label: "Refractive Index", min: 1.0, max: 2.5, step: 0.05, defaultValue: 1.5, templates: ["refraction"] },
  { key: "specularOpacity", label: "Specular", min: 0, max: 1, step: 0.05, defaultValue: 0.6, templates: ["refraction"] },
  { key: "refractionSaturation", label: "Saturation", min: 0.5, max: 3, step: 0.1, defaultValue: 1.2, templates: ["refraction"] },
  { key: "radius", label: "Corner Radius", min: 4, max: 60, step: 1, defaultValue: 20, templates: ["refraction"] },
];

const SURFACE_TYPES: { key: SurfaceType; label: string }[] = [
  { key: "convexCircle", label: "Circle" },
  { key: "convexSquircle", label: "Squircle" },
  { key: "concave", label: "Concave" },
  { key: "lip", label: "Lip" },
];

type FilterTab = "all" | "css" | "svg-filter" | "svg-backdrop" | "webgl";

/* ═══════════════════════════════════════════════ */
/*  Browse Mode — template gallery                  */
/* ═══════════════════════════════════════════════ */
function BrowseView({ onSelect }: { onSelect: (index: number) => void }) {
  const [filter, setFilter] = useState<FilterTab>("all");

  const filtered = TEMPLATES.filter((t) => {
    if (filter === "all") return true;
    return templateRenderTiers[t.template] === filter;
  });

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: TEMPLATES.length },
    { key: "css", label: "CSS", count: TEMPLATES.filter((t) => templateRenderTiers[t.template] === "css").length },
    { key: "svg-filter", label: "SVG Filter", count: TEMPLATES.filter((t) => templateRenderTiers[t.template] === "svg-filter").length },
    { key: "svg-backdrop", label: "SVG Backdrop", count: TEMPLATES.filter((t) => templateRenderTiers[t.template] === "svg-backdrop").length },
    { key: "webgl", label: "WebGL", count: TEMPLATES.filter((t) => templateRenderTiers[t.template] === "webgl").length },
  ].filter((tab): tab is { key: FilterTab; label: string; count: number } => tab.key === "all" || tab.count > 0);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key
                ? "bg-white text-slate-900"
                : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-xs ${filter === tab.key ? "text-slate-500" : "text-slate-600"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => {
          const idx = TEMPLATES.indexOf(t);
          const tier = templateRenderTiers[t.template];
          return (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              className="group text-left bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-500 transition-all hover:scale-[1.02]"
            >
              {/* Mini preview */}
              <div className="relative h-32 bg-gradient-to-br from-blue-600 via-violet-600 to-fuchsia-600 flex items-center justify-center overflow-hidden">
                {t.template !== "refraction" ? (
                  <Glass template={t.template} {...(t.overrides as Record<string, unknown>)} className="w-[160px] h-[80px] flex items-center justify-center">
                    <span className="text-white/60 text-xs">Preview</span>
                  </Glass>
                ) : (
                  <div className="w-[160px] h-[80px] rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <span className="text-white/60 text-xs">Refraction</span>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-slate-200 group-hover:text-white">{t.name}</span>
                  <RenderTierBadge tier={tier} />
                </div>
                <p className="text-xs text-slate-500">{t.description}</p>
                <p className="text-[10px] text-slate-600 mt-1 capitalize">{t.template}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════ */
/*  Refraction Preview (tweak mode)                  */
/* ═══════════════════════════════════════════════ */
function RefractionPreview({
  surface,
  values,
  getValue,
  mouseOffset,
  bgIndex,
  gradientIndex,
  previewRef,
  onMouseMove,
}: {
  surface: SurfaceType;
  values: Record<string, number>;
  getValue: (key: string, def: number) => number;
  mouseOffset: { x: number; y: number };
  bgIndex: number;
  gradientIndex: number;
  previewRef: React.RefObject<HTMLDivElement | null>;
  onMouseMove: (e: React.MouseEvent) => void;
}) {
  const svgRef = useRef<Element | null>(null);
  const panelWidth = 280;
  const panelHeight = 200;

  const glass = useMemo(() => {
    return createLiquidGlass({
      width: panelWidth,
      height: panelHeight,
      radius: getValue("radius", 20),
      bezelWidth: getValue("bezelWidth", 50),
      glassThickness: getValue("glassThickness", 200),
      blur: getValue("blur", 8),
      refractiveIndex: getValue("refractiveIndex", 1.5),
      surface,
      specularOpacity: getValue("specularOpacity", 0.6),
      saturation: getValue("refractionSaturation", 1.2),
      dpr: 1,
    });
  }, [surface, values]);

  useEffect(() => {
    if (svgRef.current) svgRef.current.remove();
    const container = document.createElement("div");
    container.innerHTML = glass.svgFilter;
    const svg = container.firstElementChild;
    if (svg) {
      document.body.appendChild(svg);
      svgRef.current = svg;
    }
    return () => { svgRef.current?.remove(); };
  }, [glass.svgFilter]);

  return (
    <div
      ref={previewRef}
      className={`relative overflow-hidden rounded-2xl h-[460px] flex items-center justify-center ${bgIndex === -1 ? `bg-gradient-to-br ${GRADIENT_BGS[gradientIndex]}` : ""}`}
      onMouseMove={onMouseMove}
      onMouseLeave={() => {}}
    >
      {bgIndex >= 0 && (
        <img
          src={BG_IMAGES[bgIndex]}
          alt=""
          className="absolute w-[115%] h-[115%] object-cover transition-transform duration-150 ease-out pointer-events-none"
          style={{ top: "-7.5%", left: "-7.5%", transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)` }}
        />
      )}
      <div
        style={{
          width: panelWidth,
          height: panelHeight,
          borderRadius: getValue("radius", 20),
          overflow: "hidden",
          backdropFilter: glass.filterRef,
          WebkitBackdropFilter: glass.filterRef,
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "rgba(0,0,0,0.16) 0px 4px 9px, rgba(0,0,0,0.2) 0px 2px 24px inset, rgba(255,255,255,0.2) 0px -2px 24px inset",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div className="text-center px-4 relative z-10">
          <p className="text-white/90 text-sm font-medium">Refraction Glass</p>
          <p className="text-white/50 text-xs mt-1">{SURFACE_EQUATIONS[surface].name}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════ */
/*  Tweak Mode — edit a single template             */
/* ═══════════════════════════════════════════════ */
function TweakView({
  templateIndex,
  onBack,
  onSwitch,
}: {
  templateIndex: number;
  onBack: () => void;
  onSwitch: (index: number) => void;
}) {
  const template = TEMPLATES[templateIndex];
  const [values, setValues] = useState<Record<string, number>>(() => {
    const nv: Record<string, number> = {};
    for (const [k, v] of Object.entries(template.overrides)) {
      if (typeof v === "number") nv[k] = v;
    }
    return nv;
  });
  const [tintColor, setTintColor] = useState(() => {
    const tc = template.overrides.tintColor;
    return typeof tc === "string" ? tc : "#ffffff";
  });
  const [surface, setSurface] = useState<SurfaceType>(template.surface ?? "convexSquircle");
  const [bgIndex, setBgIndex] = useState(0);
  const [gradientIndex, setGradientIndex] = useState(0);
  const [framework, setFramework] = useState<Framework>("react");
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const tmplName = template.template;
  const isRefraction = tmplName === "refraction";
  const tier = templateRenderTiers[tmplName];

  // All templates for the same template type (for the dropdown)
  const sameEffectTemplates = TEMPLATES
    .map((t, i) => ({ ...t, index: i }))
    .filter((t) => t.template === tmplName);

  // When switching templates, reload values
  const switchTemplate = (idx: number) => {
    const t = TEMPLATES[idx];
    const nv: Record<string, number> = {};
    for (const [k, v] of Object.entries(t.overrides)) {
      if (typeof v === "number") nv[k] = v;
    }
    setValues(nv);
    const tc = t.overrides.tintColor;
    setTintColor(typeof tc === "string" ? tc : "#ffffff");
    if (t.surface) setSurface(t.surface);
    setDropdownOpen(false);
    onSwitch(idx);
  };

  // Keyboard navigation: left/right arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        switchTemplate((templateIndex - 1 + TEMPLATES.length) % TEMPLATES.length);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        switchTemplate((templateIndex + 1) % TEMPLATES.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [templateIndex]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseOffset({ x: nx * -20, y: ny * -20 });
  }, []);

  const activeSliders = SLIDERS.filter((s) => s.templates.includes(tmplName));
  const getValue = (key: string, def: number) => values[key] ?? def;

  const options = useMemo(() => {
    const o: Record<string, unknown> = {};
    activeSliders.forEach((s) => { o[s.key] = getValue(s.key, s.defaultValue); });
    if (["frosted", "crystal"].includes(tmplName)) o.tintColor = tintColor;
    if (isRefraction && o.refractionSaturation !== undefined) {
      o.saturation = o.refractionSaturation;
      delete o.refractionSaturation;
    }
    return o;
  }, [tmplName, values, tintColor, activeSliders, isRefraction]);

  const codeSnippet = useMemo(() => {
    if (isRefraction) {
      return generateRefractionSnippet({
        width: 280, height: 200,
        radius: getValue("radius", 20),
        bezelWidth: getValue("bezelWidth", 50),
        glassThickness: getValue("glassThickness", 200),
        blur: getValue("blur", 8),
        refractiveIndex: getValue("refractiveIndex", 1.5),
        surface,
        specularOpacity: getValue("specularOpacity", 0.6),
      });
    }
    return getSnippet(framework, tmplName, options);
  }, [framework, tmplName, options, isRefraction, surface, values]);

  const resetToTemplate = () => {
    const nv: Record<string, number> = {};
    for (const [k, v] of Object.entries(template.overrides)) {
      if (typeof v === "number") nv[k] = v;
    }
    setValues(nv);
    const tc = template.overrides.tintColor;
    setTintColor(typeof tc === "string" ? tc : "#ffffff");
    if (template.surface) setSurface(template.surface);
  };

  return (
    <div>
      {/* Header: back + prev/next + template switcher */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} /> Browse
        </button>
        <div className="h-4 w-px bg-slate-700" />
        {/* Prev / Next buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => switchTemplate((templateIndex - 1 + TEMPLATES.length) % TEMPLATES.length)}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
            aria-label="Previous template"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => switchTemplate((templateIndex + 1) % TEMPLATES.length)}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
            aria-label="Next template"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 hover:border-slate-500 transition-colors"
          >
            {template.name}
            <RenderTierBadge tier={tier} />
            <span className="text-[10px] text-slate-600 tabular-nums">{templateIndex + 1}/{TEMPLATES.length}</span>
            <ChevronDown size={14} className={`text-slate-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 py-1 max-h-72 overflow-y-auto">
              {TEMPLATES.map((t, i) => (
                <button
                  key={i}
                  onClick={() => switchTemplate(i)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${
                    i === templateIndex
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <div>
                    <span className="font-medium">{t.name}</span>
                    <span className="text-[10px] text-slate-500 ml-2 capitalize">{t.template}</span>
                  </div>
                  <RenderTierBadge tier={templateRenderTiers[t.template]} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ChromiumNotice tier={tier} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Preview + Code */}
        <div className="space-y-4">
          {/* Background picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">BG:</span>
            {GRADIENT_BGS.map((g, i) => (
              <button key={g} onClick={() => { setBgIndex(-1); setGradientIndex(i); }} className={`w-6 h-6 rounded-full bg-gradient-to-br ${g} border-2 transition-colors ${bgIndex === -1 && gradientIndex === i ? "border-white" : "border-transparent"}`} />
            ))}
            {BG_IMAGES.slice(0, 4).map((_, i) => (
              <button key={i} onClick={() => setBgIndex(i)} className={`w-6 h-6 rounded-full border-2 transition-colors flex items-center justify-center bg-slate-700 ${bgIndex === i ? "border-white" : "border-transparent"}`}>
                <Image size={10} className="text-slate-400" />
              </button>
            ))}
          </div>

          {/* Preview */}
          {isRefraction ? (
            <RefractionPreview
              surface={surface}
              values={values}
              getValue={getValue}
              mouseOffset={mouseOffset}
              bgIndex={bgIndex}
              gradientIndex={gradientIndex}
              previewRef={previewRef}
              onMouseMove={handleMouseMove}
            />
          ) : (
            <div
              ref={previewRef}
              className={`relative overflow-hidden rounded-2xl h-[460px] flex items-center justify-center ${bgIndex === -1 ? `bg-gradient-to-br ${GRADIENT_BGS[gradientIndex]}` : ""}`}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setMouseOffset({ x: 0, y: 0 })}
            >
              {bgIndex >= 0 && (
                <img
                  src={BG_IMAGES[bgIndex]}
                  alt=""
                  className="absolute w-[115%] h-[115%] object-cover transition-transform duration-150 ease-out pointer-events-none"
                  style={{ top: "-7.5%", left: "-7.5%", transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)` }}
                />
              )}
              <Glass template={tmplName} {...(options as Record<string, unknown>)} className="w-[280px] h-[200px] flex items-center justify-center transition-all duration-300">
                <div className="text-center px-4">
                  <p className="text-white/90 text-sm font-medium capitalize">{tmplName}</p>
                  <p className="text-white/50 text-xs mt-1">{template.name}</p>
                </div>
              </Glass>
            </div>
          )}

          {/* Code */}
          <div>
            <div className="flex justify-between items-center mb-2">
              {isRefraction ? (
                <span className="text-xs text-slate-500">createLiquidGlass API</span>
              ) : (
                <FrameworkTabs active={framework} onChange={setFramework} />
              )}
            </div>
            <CodeBlock code={codeSnippet} lang={isRefraction ? "ts" : framework === "vue" ? "vue" : "tsx"} />
          </div>
        </div>

        {/* Sidebar: sliders */}
        <div className="space-y-4">
          {/* Surface picker (liquid only) */}
          {isRefraction && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Surface</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {SURFACE_TYPES.map((s) => (
                  <button key={s.key} onClick={() => setSurface(s.key)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${surface === s.key ? "bg-white text-slate-900" : "bg-slate-700/60 text-slate-300 hover:bg-slate-600"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Parameters */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Parameters</h4>
              <button onClick={resetToTemplate} className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-white transition-colors">
                <RotateCcw size={10} /> Reset
              </button>
            </div>
            <div className="space-y-3">
              {!isRefraction && ["frosted", "crystal"].includes(tmplName) && (
                <label className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Tint Color</span>
                  <input type="color" value={tintColor} onChange={(e) => setTintColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer bg-transparent border-0" />
                </label>
              )}
              {activeSliders.map((s) => (
                <label key={s.key} className="block">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{s.label}</span>
                    <span className="text-slate-600 font-mono text-[11px] tabular-nums">{getValue(s.key, s.defaultValue)}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={getValue(s.key, s.defaultValue)} onChange={(e) => setValues((p) => ({ ...p, [s.key]: Number(e.target.value) }))} className="w-full accent-blue-500 h-1" />
                </label>
              ))}
            </div>
          </div>

          {/* Render tier — expandable explanation */}
          <div className="px-1">
            <RenderTierTag tier={tier} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════ */
/*  Main Playground — state machine                  */
/* ═══════════════════════════════════════════════ */
export function Playground() {
  const [activeTemplate, setActiveTemplate] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-200 to-violet-200 bg-clip-text text-transparent">
          Playground
        </h1>
        <p className="text-slate-400 mt-3 text-lg">
          {activeTemplate === null
            ? "Pick a template to start customizing."
            : "Tweak parameters, switch backgrounds, copy the code."
          }
        </p>
      </div>

      {activeTemplate === null ? (
        <BrowseView onSelect={setActiveTemplate} />
      ) : (
        <TweakView
          templateIndex={activeTemplate}
          onBack={() => setActiveTemplate(null)}
          onSwitch={setActiveTemplate}
        />
      )}
    </div>
  );
}
