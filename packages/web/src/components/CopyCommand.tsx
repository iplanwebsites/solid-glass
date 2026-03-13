import { useState, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import { Copy, Check } from "lucide-react";
import { clsx } from "clsx";

interface CopyCommandProps {
  command: string;
  className?: string;
}

export function CopyCommand({ command, className }: CopyCommandProps) {
  const [copied, setCopied] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const fireConfetti = useCallback(() => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    const defaults = { origin: { x, y }, disableForReducedMotion: true };

    // Yellow-lime themed confetti to match the site's accent color
    const colors = ["#d9f99d", "#bef264", "#a3e635", "#84cc16", "#65a30d", "#facc15", "#fde047"];

    confetti({
      ...defaults,
      particleCount: 30,
      spread: 60,
      startVelocity: 35,
      angle: 90,
      colors,
    });
    confetti({
      ...defaults,
      particleCount: 15,
      spread: 80,
      startVelocity: 45,
      angle: 60,
      colors,
    });
    confetti({
      ...defaults,
      particleCount: 15,
      spread: 80,
      startVelocity: 45,
      angle: 120,
      colors,
    });
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      fireConfetti();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }, [command, fireConfetti]);

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-3 bg-slate-800/80 border border-slate-700 px-5 py-3 rounded-xl",
        className
      )}
    >
      <code className="font-mono text-sm text-slate-200">{command}</code>
      <button
        ref={buttonRef}
        onClick={handleCopy}
        aria-label="Copy command to clipboard"
        className={clsx(
          "p-1.5 rounded-md transition-colors cursor-pointer",
          copied
            ? "bg-lime-500/20 text-lime-400"
            : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
        )}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}
