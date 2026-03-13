/**
 * Loupe — A magnifying glass component using the SVG refraction engine.
 *
 * Inspired by the magnifying glass demo from Kube (Chris Feijoo):
 * https://kube.io/blog/liquid-glass-css-svg
 *
 * This component creates a circular loupe that refracts the content behind it,
 * producing a physically-based magnifying glass effect using SVG displacement maps.
 *
 * NOTE: The backdrop-filter SVG approach is currently Chromium-only.
 *
 * @example
 * ```tsx
 * import { Loupe } from "./components/react/Loupe";
 *
 * <div style={{ position: "relative" }}>
 *   <img src="photo.jpg" />
 *   <Loupe x={150} y={150} size={120} magnification={8} />
 * </div>
 * ```
 */
import React, { useEffect, useMemo, useRef } from "react";
import {
  createLiquidGlass,
  type LiquidGlassOptions,
} from "solid-glass/engines/svg-refraction";

export interface LoupeProps {
  /** X position of loupe center */
  x: number;
  /** Y position of loupe center */
  y: number;
  /** Diameter of the loupe in px (default: 120) */
  size?: number;
  /** Magnification scale for the zoom effect (default: 6) */
  magnification?: number;
  /** Bezel width in px (default: 30) */
  bezelWidth?: number;
  /** Glass thickness (default: 200) */
  glassThickness?: number;
  /** Surface shape (default: "convexCircle") */
  surface?: LiquidGlassOptions["surface"];
  /** Refractive index (default: 1.5) */
  refractiveIndex?: number;
  /** Backdrop blur in px (default: 0) */
  blur?: number;
  /** Additional CSS class */
  className?: string;
}

export const Loupe: React.FC<LoupeProps> = ({
  x,
  y,
  size = 120,
  magnification = 6,
  bezelWidth = 30,
  glassThickness = 200,
  surface = "convexCircle",
  refractiveIndex = 1.5,
  blur = 0,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<Element | null>(null);
  const radius = size / 2;

  const glass = useMemo(
    () =>
      createLiquidGlass({
        width: size,
        height: size,
        radius,
        bezelWidth,
        glassThickness,
        blur,
        refractiveIndex,
        surface,
        specularOpacity: 0.7,
        dpr: 1,
      }),
    [size, radius, bezelWidth, glassThickness, blur, refractiveIndex, surface]
  );

  // Inject/cleanup SVG filter
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
      ref={containerRef}
      className={className}
      style={{
        position: "absolute",
        left: x - radius,
        top: y - radius,
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        backdropFilter: `${glass.filterRef}`,
        WebkitBackdropFilter: `${glass.filterRef}`,
        boxShadow:
          "0 0 0 2px rgba(255,255,255,0.3), 0 8px 32px rgba(0,0,0,0.3)",
        pointerEvents: "none",
      }}
    />
  );
};
