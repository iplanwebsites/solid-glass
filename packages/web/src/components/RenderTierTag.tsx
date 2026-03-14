import { useState } from "react";
import { Sparkles, Gem, Box, Info, X, Globe, Monitor } from "lucide-react";

/**
 * Effect engine definitions — single source of truth for how we label
 * and explain each rendering approach to users across the site.
 *
 * Internal tier keys map to user-facing language:
 *   "css"          → "Works everywhere"
 *   "svg-filter"   → "Works everywhere" (just with SVG under the hood)
 *   "svg-backdrop" → "Chrome & Edge only"
 *   "webgl"        → "GPU required"
 */
const ENGINE_META: Record<
  string,
  {
    label: string;         // user-facing name
    shortLabel: string;    // for tight spaces
    icon: typeof Sparkles;
    color: string;         // text + border Tailwind classes
    bg: string;            // background Tailwind class
    compat: string;        // browser support — user language
    howItWorks: string;    // plain-language explanation
    underTheHood: string;  // the CSS technique, for the curious
    templates: string;     // which templates use this
  }
> = {
  css: {
    label: "Works everywhere",
    shortLabel: "CSS",
    icon: Globe,
    color: "text-violet-400 border-violet-500/20",
    bg: "bg-violet-500/10",
    compat: "All modern browsers",
    howItWorks:
      "These effects use standard CSS — blur, gradients, shadows, and animations. " +
      "Nothing exotic, nothing to fall back from.",
    underTheHood: "backdrop-filter: blur() + CSS gradients & box-shadow",
    templates: "frosted, aurora, prism, holographic, thin",
  },
  "svg-filter": {
    label: "Works everywhere",
    shortLabel: "SVG",
    icon: Globe,
    color: "text-emerald-400 border-emerald-500/20",
    bg: "bg-emerald-500/10",
    compat: "All modern browsers",
    howItWorks:
      "These effects add an SVG distortion on top of the standard CSS blur. " +
      "The blur and the SVG filter are two separate, well-supported features " +
      "that layer together — no browser restrictions.",
    underTheHood: "backdrop-filter: blur() + filter: url(#svg)",
    templates: "crystal, smoke",
  },
  "svg-backdrop": {
    label: "Chrome & Edge only",
    shortLabel: "Chrome only",
    icon: Monitor,
    color: "text-amber-400 border-amber-500/20",
    bg: "bg-amber-500/10",
    compat: "Chrome & Edge 113+",
    howItWorks:
      "The refraction engine bakes a physics simulation into an SVG filter and feeds it " +
      "directly into backdrop-filter — a technique only Chromium browsers support today. " +
      "In Firefox and Safari, it automatically falls back to a simpler glass effect.",
    underTheHood: "backdrop-filter: url(#svg-displacement-map)",
    templates: "refraction",
  },
  webgl: {
    label: "GPU required",
    shortLabel: "WebGL",
    icon: Box,
    color: "text-amber-400 border-amber-500/20",
    bg: "bg-amber-500/10",
    compat: "WebGL-capable browsers",
    howItWorks:
      "GPU-accelerated rendering with custom shaders. Reserved for future effects.",
    underTheHood: "WebGL shaders",
    templates: "",
  },
};

/**
 * Compact badge — compat-focused label.
 * Use in tight spaces (table cells, card headers, dropdown items).
 */
export function RenderTierBadge({ tier }: { tier: string }) {
  const meta = ENGINE_META[tier] ?? ENGINE_META.css;
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-medium ${meta.bg} ${meta.color} border rounded-full px-2 py-0.5`}
    >
      <Icon size={10} /> {meta.shortLabel}
    </span>
  );
}

/**
 * Full tag — badge + expandable explanation.
 * Use wherever there's room to educate (playground sidebar, component headers).
 */
export function RenderTierTag({ tier }: { tier: string }) {
  const [open, setOpen] = useState(false);
  const meta = ENGINE_META[tier] ?? ENGINE_META.css;
  const Icon = meta.icon;
  const isRestricted = tier === "svg-backdrop" || tier === "webgl";

  return (
    <div className="inline-flex flex-col items-start">
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${meta.bg} ${meta.color} border rounded-full pl-2 pr-2.5 py-0.5 transition-colors hover:brightness-125`}
      >
        <Icon size={11} />
        <span>{meta.label}</span>
        <Info size={10} className="opacity-50 ml-0.5" />
      </button>

      {open && (
        <div className="mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl p-3.5 shadow-xl text-xs leading-relaxed">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className={`font-semibold ${meta.color.split(" ")[0]}`}>{meta.compat}</h4>
            <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white">
              <X size={12} />
            </button>
          </div>

          {/* Explanation */}
          <p className="text-slate-400 mb-2.5">{meta.howItWorks}</p>

          {/* Under the hood */}
          <details className="group">
            <summary className="text-slate-500 text-[10px] uppercase tracking-wider cursor-pointer hover:text-slate-300 select-none">
              Under the hood
            </summary>
            <code className="block mt-1 text-[11px] text-blue-300 bg-blue-500/10 rounded px-1.5 py-1">
              {meta.underTheHood}
            </code>
          </details>
        </div>
      )}
    </div>
  );
}

/**
 * Inline compat note — the amber banner shown above the preview
 * for Chrome-only effects.
 */
export function ChromiumNotice({ tier }: { tier: string }) {
  if (tier !== "svg-backdrop") return null;
  return (
    <div className="text-center mb-4">
      <span className="inline-flex items-center gap-2 text-xs text-amber-400/80 bg-amber-400/5 border border-amber-400/20 rounded-full px-3 py-1">
        <Monitor size={12} />
        Chrome & Edge only — other browsers get an automatic CSS fallback
      </span>
    </div>
  );
}

/**
 * Short compat label for table cells and tight inline use.
 */
export function RenderTierInline({ tier }: { tier: string }) {
  const meta = ENGINE_META[tier] ?? ENGINE_META.css;
  return (
    <span className={meta.color.split(" ")[0]}>{meta.compat}</span>
  );
}

/** Exported for docs/pages that need the raw data */
export { ENGINE_META };
