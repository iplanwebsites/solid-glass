import React, { forwardRef, useMemo, useEffect, useRef, useState, useCallback } from "react";
import type { GlassProps } from "../types";
import { renderGlass } from "../render-glass";
import { injectSvgFilter, ensureStyles } from "../dom";

/**
 * Glass component — apply any glass effect with flat props.
 *
 * @example
 * ```tsx
 * // Zero config — beautiful frosted glass
 * <Glass>content</Glass>
 *
 * // Pick a template
 * <Glass template="aurora">content</Glass>
 *
 * // Named preset
 * <Glass template="frostedDark" blur={20}>content</Glass>
 *
 * // Full custom
 * <Glass blur={16} tintColor="#3b82f6" borderRadius={24}>
 *   content
 * </Glass>
 * ```
 */
export const Glass = forwardRef<HTMLDivElement, GlassProps>(
  function Glass(props, forwardedRef) {
    const {
      template = "frosted",
      children,
      className,
      style,
      as: Tag = "div",
      fallback,
      // Extract glass-specific props from pass-through HTML attrs
      blur, opacity, borderRadius, tintColor, tintOpacity,
      borderColor, borderWidth, borderOpacity,
      shadowColor, shadowBlur, shadowSpread,
      distortion, noiseFrequency, noiseOctaves, noiseSeed, turbulence,
      surface, refractiveIndex, bezelWidth, glassThickness,
      specularOpacity, specularAngle, width, height,
      saturation, brightness, contrast, hueRotate,
      colors, colorOpacity, gradientAngle, colorBlend,
      animated, animationSpeed, animationEasing, bounciness, paused,
      colorScheme,
      ...htmlAttrs
    } = props;

    // Auto-inject CSS on first mount
    useEffect(() => ensureStyles(), []);

    // Build overrides from flat props
    const overrides = useMemo(() => ({
      blur, opacity, borderRadius, tintColor, tintOpacity,
      borderColor, borderWidth, borderOpacity,
      shadowColor, shadowBlur, shadowSpread,
      distortion, noiseFrequency, noiseOctaves, noiseSeed, turbulence,
      surface, refractiveIndex, bezelWidth, glassThickness,
      specularOpacity, specularAngle, width, height,
      saturation, brightness, contrast, hueRotate,
      colors, colorOpacity, gradientAngle, colorBlend,
      animated, animationSpeed, animationEasing, bounciness, paused,
      colorScheme, className, style,
    }), [
      blur, opacity, borderRadius, tintColor, tintOpacity,
      borderColor, borderWidth, borderOpacity,
      shadowColor, shadowBlur, shadowSpread,
      distortion, noiseFrequency, noiseOctaves, noiseSeed, turbulence,
      surface, refractiveIndex, bezelWidth, glassThickness,
      specularOpacity, specularAngle, width, height,
      saturation, brightness, contrast, hueRotate,
      colors, colorOpacity, gradientAngle, colorBlend,
      animated, animationSpeed, animationEasing, bounciness, paused,
      colorScheme, className, style,
    ]);

    // Auto-measure for refraction when width/height not provided
    const measureRef = useRef<HTMLDivElement | null>(null);
    const [measured, setMeasured] = useState<{ width: number; height: number } | null>(null);

    const setRefs = useCallback((el: HTMLDivElement | null) => {
      measureRef.current = el;
      if (typeof forwardedRef === "function") forwardedRef(el);
      else if (forwardedRef) forwardedRef.current = el;
    }, [forwardedRef]);

    // Auto-measure with ResizeObserver for refraction
    useEffect(() => {
      const needsMeasure = (template === "refraction" || template === "refractionPanel" || template === "refractionLoupe")
        && !width && !height;

      if (!needsMeasure || !measureRef.current) return;

      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          const { width: w, height: h } = entry.contentRect;
          if (w > 0 && h > 0) {
            setMeasured({ width: Math.round(w), height: Math.round(h) });
          }
        }
      });
      observer.observe(measureRef.current);
      return () => observer.disconnect();
    }, [template, width, height]);

    // Merge measured dimensions into overrides
    const finalOverrides = useMemo(() => {
      if (measured && !width && !height) {
        return { ...overrides, width: measured.width, height: measured.height };
      }
      return overrides;
    }, [overrides, measured, width, height]);

    const generated = useMemo(
      () => renderGlass(template, finalOverrides),
      [template, finalOverrides]
    );

    // SVG filter injection
    useEffect(() => {
      if (!generated.svgFilter) return;
      return injectSvgFilter(generated.svgFilter);
    }, [generated.svgFilter]);

    const combinedStyle = useMemo(() => {
      const vars: Record<string, string | number> = {};
      for (const [key, val] of Object.entries(generated.cssVars)) {
        vars[key] = val;
      }
      if (generated.inlineStyle) Object.assign(vars, generated.inlineStyle);
      if (style) Object.assign(vars, style);
      return vars as React.CSSProperties;
    }, [generated.cssVars, generated.inlineStyle, style]);

    return React.createElement(
      Tag as string,
      {
        ref: setRefs,
        className: generated.className,
        style: combinedStyle,
        ...htmlAttrs,
      },
      children
    );
  }
);
