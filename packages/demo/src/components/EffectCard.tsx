import { Glass, type GlassEffectName } from "solid-glass";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface EffectCardProps {
  name: string;
  effect: GlassEffectName;
  options: Record<string, unknown>;
  description: string;
}

export function EffectCard({ name, effect, options, description }: EffectCardProps) {
  const [copied, setCopied] = useState(false);

  const codeSnippet = `<Glass effect="${effect}" options={${JSON.stringify(options, null, 2)}} />`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative">
      {/* Preview area with background image */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/40 via-violet-600/30 to-emerald-600/20 p-8 h-64 flex items-center justify-center">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 left-4 w-20 h-20 bg-white/20 rounded-xl" />
          <div className="absolute top-12 right-8 w-16 h-16 bg-pink-400/20 rounded-full" />
          <div className="absolute bottom-6 left-1/3 w-24 h-12 bg-yellow-400/20 rounded-lg" />
          <div className="absolute bottom-4 right-4 w-14 h-14 bg-green-400/20 rounded-xl rotate-12" />
          <div className="absolute top-1/2 left-8 w-12 h-24 bg-blue-400/20 rounded-lg -rotate-6" />
        </div>

        <Glass
          effect={effect}
          options={options as never}
          className="w-48 h-36 flex items-center justify-center"
        >
          <span className="text-white/80 text-sm font-medium">{name}</span>
        </Glass>
      </div>

      {/* Info */}
      <div className="mt-4 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-white">{name}</h3>
          <p className="text-sm text-slate-400 mt-1">{description}</p>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Copy code"
        >
          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
        </button>
      </div>

      {/* Effect + code tag */}
      <div className="mt-2 flex gap-2">
        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
          {effect}
        </span>
      </div>
    </div>
  );
}
