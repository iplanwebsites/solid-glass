/**
 * LiquidGlassPanel — A panel using the physics-based SVG refraction engine.
 *
 * This component uses real Snell-Descartes refraction calculations to produce
 * a realistic glass panel with displacement-mapped refraction and specular highlights.
 *
 * Inspired by the work of Kube (Chris Feijoo):
 * https://kube.io/blog/liquid-glass-css-svg
 *
 * NOTE: The backdrop-filter SVG approach is currently Chromium-only.
 * Falls back to a simple frosted glass effect in other browsers.
 *
 * @example
 * ```tsx
 * import { LiquidGlassPanel } from "./components/react/LiquidGlassPanel";
 *
 * <LiquidGlassPanel width={320} height={200} bezelWidth={40}>
 *   <h2>Physics-based glass</h2>
 * </LiquidGlassPanel>
 * ```
 */
import React, { useEffect, useMemo, useRef } from "react";
import {
  createLiquidGlass,
  type LiquidGlassOptions,
} from "solid-glass/engines/svg-refraction";

export interface LiquidGlassPanelProps {
  children?: React.ReactNode;
  width: number;
  height: number;
  radius?: number;
  bezelWidth?: number;
  glassThickness?: number;
  blur?: number;
  refractiveIndex?: number;
  surface?: LiquidGlassOptions["surface"];
  specularOpacity?: number;
  saturation?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const LiquidGlassPanel: React.FC<LiquidGlassPanelProps> = ({
  children,
  width,
  height,
  radius = 20,
  bezelWidth = 50,
  glassThickness = 200,
  blur = 8,
  refractiveIndex = 1.5,
  surface = "convexSquircle",
  specularOpacity = 0.6,
  saturation = 1.2,
  className = "",
  style,
}) => {
  const svgRef = useRef<Element | null>(null);

  const glass = useMemo(
    () =>
      createLiquidGlass({
        width,
        height,
        radius,
        bezelWidth,
        glassThickness,
        blur,
        refractiveIndex,
        surface,
        specularOpacity,
        saturation,
        dpr: 1,
      }),
    [width, height, radius, bezelWidth, glassThickness, blur, refractiveIndex, surface, specularOpacity, saturation]
  );

  useEffect(() => {
    const container = document.createElement("div");
    container.innerHTML = glass.svgFilter;
    const svg = container.firstElementChild;
    if (svg) {
      document.body.appendChild(svg);
      svgRef.current = svg;
    }
    return () => {
      svgRef.current?.remove();
    };
  }, [glass.svgFilter]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        backdropFilter: glass.filterRef,
        WebkitBackdropFilter: glass.filterRef,
        border: "1px solid rgba(255,255,255,0.15)",
        ...style,
      }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
};
