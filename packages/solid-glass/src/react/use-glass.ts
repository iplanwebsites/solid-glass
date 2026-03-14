import { useMemo, useRef, useEffect, useState } from "react";
import type { GlassOptions, TemplateName, TemplatePresetName } from "../types";
import { renderGlass } from "../render-glass";
import { injectSvgFilter, ensureStyles } from "../dom";

/**
 * Hook that returns className, style, and ref for applying a glass effect.
 *
 * @example
 * ```tsx
 * const glass = useGlass("frosted", { blur: 16, tintColor: "#3b82f6" });
 * return <div ref={glass.ref} className={glass.className} style={glass.style}>...</div>;
 *
 * // Or with a named preset
 * const glass = useGlass("auroraNorth", { animated: false });
 * ```
 */
export function useGlass(
  template: TemplateName | TemplatePresetName = "frosted",
  options?: GlassOptions
) {
  const ref = useRef<HTMLDivElement>(null);

  // Auto-inject CSS
  useEffect(() => ensureStyles(), []);

  // Auto-measure for refraction
  const [measured, setMeasured] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const isRefraction = template === "refraction" || template === "refractionPanel" || template === "refractionLoupe";
    const needsMeasure = isRefraction && !options?.width && !options?.height;

    if (!needsMeasure || !ref.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          setMeasured({ width: Math.round(w), height: Math.round(h) });
        }
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [template, options?.width, options?.height]);

  const finalOptions = useMemo(() => {
    if (measured && !options?.width && !options?.height) {
      return { ...options, width: measured.width, height: measured.height };
    }
    return options ?? {};
  }, [options, measured]);

  const generated = useMemo(
    () => renderGlass(template, finalOptions),
    [template, finalOptions]
  );

  // Inject SVG filter
  useEffect(() => {
    if (!generated.svgFilter) return;
    return injectSvgFilter(generated.svgFilter);
  }, [generated.svgFilter]);

  const style = useMemo(() => {
    const vars: Record<string, string | number> = {};
    for (const [key, val] of Object.entries(generated.cssVars)) {
      vars[key] = val;
    }
    if (generated.inlineStyle) Object.assign(vars, generated.inlineStyle);
    return vars as React.CSSProperties;
  }, [generated.cssVars, generated.inlineStyle]);

  return {
    ref,
    className: generated.className,
    style,
  };
}
