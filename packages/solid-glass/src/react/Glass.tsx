import React, { forwardRef, useMemo, useEffect, useRef } from "react";
import type { GlassEffectName, GlassProps } from "../types";
import { getEffect } from "../effects";
import { cn } from "../utils";

/**
 * Unified Glass component supporting all effects.
 *
 * @example
 * ```tsx
 * <Glass effect="frosted" options={{ blur: 16 }}>
 *   <p>Hello from behind the glass</p>
 * </Glass>
 *
 * <Glass effect="aurora" options={{ colors: ["#a78bfa", "#6ee7b7"] }}>
 *   <p>Aurora vibes</p>
 * </Glass>
 * ```
 */
export const Glass = forwardRef<HTMLDivElement, GlassProps<GlassEffectName>>(
  function Glass(
    { effect = "frosted", options = {}, radius, blur, children, className, style, as: Tag = "div", ...rest },
    forwardedRef
  ) {
    const svgContainerRef = useRef<Element | null>(null);

    const merged = useMemo(() => {
      const o = { ...options };
      if (radius !== undefined) (o as Record<string, unknown>).borderRadius = radius;
      if (blur !== undefined) (o as Record<string, unknown>).blur = blur;
      return o;
    }, [options, radius, blur]);

    const generated = useMemo(() => {
      const gen = getEffect(effect);
      return gen(merged);
    }, [effect, merged]);

    // SVG filter injection
    useEffect(() => {
      if (!generated.svgFilter) return;
      const container = document.createElement("div");
      container.innerHTML = generated.svgFilter;
      const svg = container.firstElementChild;
      if (svg) {
        document.body.appendChild(svg);
        svgContainerRef.current = svg;
        return () => {
          svg.remove();
        };
      }
    }, [generated.svgFilter]);

    const combinedStyle = useMemo(() => {
      const vars: Record<string, string | number> = {};
      for (const [key, val] of Object.entries(generated.cssVars)) {
        vars[key] = val;
      }
      return { ...vars, ...style } as React.CSSProperties;
    }, [generated.cssVars, style]);

    return React.createElement(
      Tag as string,
      {
        ref: forwardedRef,
        className: cn(generated.className, className),
        style: combinedStyle,
        ...rest,
      },
      children
    );
  }
);
