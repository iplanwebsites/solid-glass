import { useState } from "react";
import { Sparkles, Gem, Box, Info, X } from "lucide-react";

/**
 * Render tier definitions — the single source of truth for how we label
 * and explain each rendering approach across the whole site.
 */
const TIER_META: Record<
  string,
  {
    label: string;
    shortLabel: string;
    icon: typeof Sparkles;
    color: string;       // text + border Tailwind classes
    bg: string;          // background Tailwind class
    css: string;         // the actual CSS technique
    compat: string;      // browser support one-liner
    explanation: string; // 1-2 sentence plain-language explanation
  }
> = {
  css: {
    label: "CSS",
    shortLabel: "CSS",
    icon: Sparkles,
    color: "text-violet-400 border-violet-500/20",
    bg: "bg-violet-500/10",
    css: "backdrop-filter: blur()",
    compat: "All modern browsers",
    explanation:
      "Pure CSS effects using backdrop-filter, box-shadow, gradients, and animations. " +
      "No SVG or JavaScript required at render time — just CSS custom properties.",
  },
  "svg-filter": {
    label: "CSS + SVG Filter",
    shortLabel: "SVG Filter",
    icon: Gem,
    color: "text-emerald-400 border-emerald-500/20",
    bg: "bg-emerald-500/10",
    css: "backdrop-filter: blur() + filter: url(#svg)",
    compat: "All modern browsers",
    explanation:
      "Backdrop blur via standard CSS backdrop-filter, with an SVG displacement filter " +
      "applied through the CSS filter property. Both are standard, broadly-supported features " +
      "that compose together — the SVG feTurbulence distortion runs on the already-blurred backdrop.",
  },
  "svg-backdrop": {
    label: "SVG Backdrop Filter",
    shortLabel: "SVG Backdrop",
    icon: Gem,
    color: "text-amber-400 border-amber-500/20",
    bg: "bg-amber-500/10",
    css: "backdrop-filter: url(#svg)",
    compat: "Chromium 113+ (Chrome, Edge, Opera)",
    explanation:
      "The entire SVG filter chain — including Snell-Descartes displacement maps and " +
      "specular highlights — is passed directly as the backdrop-filter value. " +
      "Only Chromium supports SVG filter references inside backdrop-filter; " +
      "Firefox and Safari will fall back to a simpler CSS effect.",
  },
  webgl: {
    label: "WebGL",
    shortLabel: "WebGL",
    icon: Box,
    color: "text-amber-400 border-amber-500/20",
    bg: "bg-amber-500/10",
    css: "WebGL shaders",
    compat: "GPU required",
    explanation:
      "GPU-accelerated rendering with custom shaders. Reserved for future effects.",
  },
};

/**
 * Compact badge — just the tier name and icon.
 * Use in tight spaces (table cells, card headers, dropdown items).
 */
export function RenderTierBadge({ tier }: { tier: string }) {
  const meta = TIER_META[tier] ?? TIER_META.css;
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
 * Full tag — badge + compat indicator + expandable explanation.
 * Use wherever there's room to educate (playground sidebar, component headers).
 */
export function RenderTierTag({ tier }: { tier: string }) {
  const [open, setOpen] = useState(false);
  const meta = TIER_META[tier] ?? TIER_META.css;
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
        {isRestricted && (
          <span className="text-[9px] opacity-70 ml-0.5">— {meta.compat}</span>
        )}
        <Info size={10} className="opacity-50 ml-0.5" />
      </button>

      {open && (
        <div className="mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl p-3.5 shadow-xl text-xs leading-relaxed">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className={`font-semibold ${meta.color.split(" ")[0]}`}>{meta.label}</h4>
            <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white">
              <X size={12} />
            </button>
          </div>

          {/* CSS technique */}
          <div className="mb-2">
            <span className="text-slate-500 text-[10px] uppercase tracking-wider">CSS technique</span>
            <div className="mt-0.5">
              <code className="text-[11px] text-blue-300 bg-blue-500/10 rounded px-1.5 py-0.5">
                {meta.css}
              </code>
            </div>
          </div>

          {/* Explanation */}
          <p className="text-slate-400 mb-2">{meta.explanation}</p>

          {/* Compat */}
          <div className={`inline-flex items-center gap-1.5 text-[10px] rounded-full px-2 py-0.5 ${
            isRestricted
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              : "bg-green-500/10 text-green-400 border border-green-500/20"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isRestricted ? "bg-amber-400" : "bg-green-400"}`} />
            {meta.compat}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Inline compat note — the amber banner shown above the preview
 * for Chromium-only effects.
 */
export function ChromiumNotice({ tier }: { tier: string }) {
  if (tier !== "svg-backdrop") return null;
  const meta = TIER_META[tier];
  return (
    <div className="text-center mb-4">
      <span className="inline-flex items-center gap-2 text-xs text-amber-400/80 bg-amber-400/5 border border-amber-400/20 rounded-full px-3 py-1">
        {meta.compat} — <code className="font-mono text-[11px]">{meta.css}</code> is not supported in Firefox or Safari
      </span>
    </div>
  );
}

/**
 * Short tier label for table cells and tight inline use.
 */
export function RenderTierInline({ tier }: { tier: string }) {
  const meta = TIER_META[tier] ?? TIER_META.css;
  return (
    <span className={meta.color.split(" ")[0]}>{meta.label}</span>
  );
}

/** Exported for docs/pages that need the raw data */
export { TIER_META };
