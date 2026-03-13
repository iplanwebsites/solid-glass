import { useState, useRef, useCallback } from "react";
import { Glass, type GlassEffectName } from "solid-glass";
import { Copy, Check } from "lucide-react";

const BG_IMAGE = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80";

export const EFFECTS: {
  name: string;
  effect: GlassEffectName;
  options: Record<string, unknown>;
  description: string;
}[] = [
  { name: "Frosted", effect: "frosted", options: { blur: 14, tintOpacity: 0.1 }, description: "Classic Apple-style frosted glass" },
  { name: "Crystal", effect: "crystal", options: { blur: 8, distortionStrength: 50 }, description: "Noise-based refraction distortion" },
  { name: "Aurora", effect: "aurora", options: { colors: ["#a78bfa", "#6ee7b7", "#fbbf24"] }, description: "Animated gradient overlay" },
  { name: "Smoke", effect: "smoke", options: { blur: 22, density: 0.35 }, description: "Dark or light animated smoke" },
  { name: "Prism", effect: "prism", options: { saturation: 1.4, brightness: 1.1 }, description: "Spectral color splitting" },
  { name: "Holographic", effect: "holographic", options: { iridescence: 0.45 }, description: "Iridescent card-like shimmer" },
  { name: "Thin", effect: "thin", options: { blur: 4, backgroundOpacity: 0.03 }, description: "Barely-there minimal glass" },
];

interface EffectGridProps {
  showDescriptions?: boolean;
  showCopyButtons?: boolean;
  compact?: boolean;
}

export function EffectGrid({ showDescriptions = false, showCopyButtons = false, compact = false }: EffectGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseOffset({ x: nx * -15, y: ny * -15 });
  }, []);

  const handleCopy = (idx: number, effect: typeof EFFECTS[number]) => {
    const snippet = `<Glass effect="${effect.effect}" options={${JSON.stringify(effect.options)}} />`;
    navigator.clipboard.writeText(snippet);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouseOffset({ x: 0, y: 0 })}
    >
      {/* Shared background image */}
      <img
        src={BG_IMAGE}
        alt=""
        className="absolute w-[115%] h-[115%] object-cover transition-transform duration-200 ease-out pointer-events-none"
        style={{
          top: "-7.5%",
          left: "-7.5%",
          transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
        }}
      />
      <div className="absolute inset-0 bg-black/5 pointer-events-none" />

      {/* Effects grid */}
      <div className={`relative z-10 grid grid-cols-4 lg:grid-cols-7 ${compact ? 'gap-1 p-3' : 'gap-2 p-4'}`}>
        {EFFECTS.map((e, idx) => (
          <div key={e.effect} className="group relative">
            <Glass
              effect={e.effect}
              options={e.options as never}
              className={`flex flex-col items-center justify-center rounded-xl ${compact ? 'aspect-square p-1.5' : 'aspect-square p-2'}`}
            >
              <span className={`text-white/90 font-semibold text-center drop-shadow-sm ${compact ? 'text-[10px]' : 'text-xs'}`}>
                {e.name}
              </span>
            </Glass>
            {showCopyButtons && (
              <button
                onClick={() => handleCopy(idx, e)}
                className="absolute top-1 right-1 p-1 rounded bg-black/30 text-white/70 hover:text-white hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100"
                title="Copy code"
              >
                {copiedIdx === idx ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
              </button>
            )}
            {showDescriptions && (
              <p className="text-[9px] text-slate-500 text-center mt-1 px-0.5 leading-tight">{e.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
