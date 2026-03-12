import { useMemo, useRef, useEffect } from "react";
import type { GlassEffectName, GlassEffectMap } from "../types";
import { getEffect } from "../effects";
import { cn } from "../utils";

/**
 * Hook that returns className, style, and ref for applying a glass effect.
 *
 * @example
 * ```tsx
 * const glass = useGlass("frosted", { blur: 16, tintColor: "#3b82f6" });
 * return <div ref={glass.ref} className={glass.className} style={glass.style}>...</div>;
 * ```
 */
export function useGlass<E extends GlassEffectName>(
  effect: E,
  options?: GlassEffectMap[E],
  extraClassName?: string
) {
  const ref = useRef<HTMLDivElement>(null);

  const generated = useMemo(() => {
    const gen = getEffect(effect);
    return gen(options ?? {});
  }, [effect, options]);

  // Inject SVG filter into DOM if needed
  useEffect(() => {
    if (!generated.svgFilter) return;

    const container = document.createElement("div");
    container.innerHTML = generated.svgFilter;
    const svg = container.firstElementChild;
    if (svg) {
      document.body.appendChild(svg);
      return () => {
        svg.remove();
      };
    }
  }, [generated.svgFilter]);

  const style = useMemo(() => {
    const vars: Record<string, string | number> = {};
    for (const [key, val] of Object.entries(generated.cssVars)) {
      vars[key] = val;
    }
    if (generated.inlineStyle) {
      Object.assign(vars, generated.inlineStyle);
    }
    return vars as React.CSSProperties;
  }, [generated.cssVars, generated.inlineStyle]);

  return {
    ref,
    className: cn(generated.className, extraClassName),
    style,
  };
}
