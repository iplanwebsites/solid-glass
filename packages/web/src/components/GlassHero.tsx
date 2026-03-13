import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { createLiquidGlass, type SurfaceType } from "solid-glass/engines/svg-refraction";
import { Glass, type GlassEffectName } from "solid-glass";
import { ArrowRight, Play, Pause, Settings2, RotateCcw, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { CopyCommand } from "./CopyCommand";

// Hero background images - random on page load
const HERO_BGS = [
  // Nature & Landscapes
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=90",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&q=90",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=90",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=90",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=90",
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1600&q=90",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=90",
  // Textures & Surfaces
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1600&q=90",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1600&q=90",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&q=90",
  "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=1600&q=90",
  "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1600&q=90",
  "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=1600&q=90",
  "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=1600&q=90",
  "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=1600&q=90",
  "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1600&q=90",
  // Architecture & Patterns
  "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1600&q=90",
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1600&q=90",
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=90",
  // Macro & Abstract
  "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=1600&q=90",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5571?w=1600&q=90",
  "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=1600&q=90",
];

// Pick random background on module load
const HERO_BG = HERO_BGS[Math.floor(Math.random() * HERO_BGS.length)];

// Default SVG parameters
const DEFAULT_SVG_PARAMS = {
  bubbleCount: 9,
  bezelWidth: 50,
  glassThickness: 120,
  blur: 1,
  refractiveIndex: 1.5,
  specularOpacity: 0.25,
};

// Default Shader parameters
const DEFAULT_SHADER_PARAMS = {
  blur: 12,
  tintOpacity: 0.1,
  animationSpeed: 6,
};

interface SVGParams {
  bubbleCount: number;
  bezelWidth: number;
  glassThickness: number;
  blur: number;
  refractiveIndex: number;
  specularOpacity: number;
}

interface ShaderParams {
  blur: number;
  tintOpacity: number;
  animationSpeed: number;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  surface: SurfaceType;
  phase: number;
  morphSpeed: number;
  styleIndex: number;
}

// Poisson disk sampling for well-distributed non-overlapping positions
function generateDistributedPositions(
  count: number,
  width: number,
  height: number,
  minSize: number,
  maxSize: number
): { x: number; y: number; size: number }[] {
  const positions: { x: number; y: number; size: number }[] = [];
  const maxAttempts = 100;

  for (let i = 0; i < count; i++) {
    const size = minSize + Math.random() * (maxSize - minSize);
    const padding = size / 2 + 20;

    let placed = false;
    for (let attempt = 0; attempt < maxAttempts && !placed; attempt++) {
      const x = padding + Math.random() * (width - padding * 2);
      const y = padding + Math.random() * (height - padding * 2);

      let overlaps = false;
      for (const pos of positions) {
        const dx = x - pos.x;
        const dy = y - pos.y;
        const minDist = (size + pos.size) / 2 + 30;
        if (dx * dx + dy * dy < minDist * minDist) {
          overlaps = true;
          break;
        }
      }

      if (!overlaps) {
        positions.push({ x, y, size });
        placed = true;
      }
    }

    if (!placed) {
      const smallerSize = minSize;
      positions.push({
        x: padding + Math.random() * (width - padding * 2),
        y: padding + Math.random() * (height - padding * 2),
        size: smallerSize,
      });
    }
  }

  return positions;
}

function useAnimatedBubbles(count: number, containerSize: { width: number; height: number }, paused: boolean, resetKey: number = 0) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return;

    const positions = generateDistributedPositions(
      count,
      containerSize.width,
      containerSize.height,
      90,
      150
    );

    const initial: Bubble[] = positions.map((pos, i) => ({
      id: i,
      x: pos.x,
      y: pos.y,
      size: pos.size,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      surface: "convexCircle" as SurfaceType,
      phase: Math.random() * Math.PI * 2,
      morphSpeed: 0.3 + Math.random() * 0.4,
      styleIndex: i % 6,
    }));
    setBubbles(initial);
  }, [count, containerSize.width, containerSize.height, resetKey]);

  useEffect(() => {
    if (paused || containerSize.width === 0) return;

    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = Math.min((time - lastTimeRef.current) / 16, 3);
      lastTimeRef.current = time;

      setBubbles(prev => prev.map(b => {
        let newX = b.x + b.vx * delta;
        let newY = b.y + b.vy * delta;
        let newVx = b.vx;
        let newVy = b.vy;

        const halfSize = b.size / 2;
        if (newX < halfSize || newX > containerSize.width - halfSize) {
          newVx *= -1;
          newX = Math.max(halfSize, Math.min(containerSize.width - halfSize, newX));
        }
        if (newY < halfSize || newY > containerSize.height - halfSize) {
          newVy *= -1;
          newY = Math.max(halfSize, Math.min(containerSize.height - halfSize, newY));
        }

        const floatX = Math.sin(time * 0.001 * b.morphSpeed + b.phase) * 0.1;
        const floatY = Math.cos(time * 0.0008 * b.morphSpeed + b.phase) * 0.1;

        return {
          ...b,
          x: newX,
          y: newY,
          vx: newVx + floatX * 0.01,
          vy: newVy + floatY * 0.01,
          phase: b.phase + 0.01 * b.morphSpeed,
        };
      }));

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [paused, containerSize.width, containerSize.height]);

  return bubbles;
}

function GlassBubble({ bubble, mousePos, svgParams }: { bubble: Bubble; mousePos: { x: number; y: number }; svgParams: SVGParams }) {
  const svgRef = useRef<Element | null>(null);
  const glassSize = Math.round(bubble.size);

  const visualScale = useMemo(() => {
    const baseMorph = Math.sin(bubble.phase) * 0.08;
    return 1 + baseMorph;
  }, [bubble.phase]);

  const displacement = useMemo(() => {
    const dx = mousePos.x - bubble.x;
    const dy = mousePos.y - bubble.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 200;
    if (dist < maxDist) {
      const force = (1 - dist / maxDist) * 20;
      return { x: (dx / dist) * force || 0, y: (dy / dist) * force || 0 };
    }
    return { x: 0, y: 0 };
  }, [mousePos.x, mousePos.y, bubble.x, bubble.y]);

  const scaledBezelWidth = Math.round((svgParams.bezelWidth / 100) * glassSize);

  const glass = useMemo(() => createLiquidGlass({
    width: glassSize,
    height: glassSize,
    radius: Math.round(glassSize / 2),
    bezelWidth: Math.max(10, scaledBezelWidth),
    glassThickness: svgParams.glassThickness,
    blur: svgParams.blur,
    refractiveIndex: svgParams.refractiveIndex,
    surface: "convexCircle",
    specularOpacity: svgParams.specularOpacity,
    dpr: 1,
  }), [glassSize, svgParams, scaledBezelWidth]);

  useEffect(() => {
    const container = document.createElement("div");
    container.innerHTML = glass.svgFilter;
    const svg = container.firstElementChild;
    if (svg) {
      document.body.appendChild(svg);
      svgRef.current = svg;
    }
    return () => { svgRef.current?.remove(); };
  }, [glass.svgFilter]);

  return (
    <div
      className="absolute"
      style={{
        left: bubble.x - glassSize / 2 + displacement.x,
        top: bubble.y - glassSize / 2 + displacement.y,
        width: glassSize,
        height: glassSize,
        transform: `scale(${visualScale})`,
        transition: "transform 0.15s ease-out",
      }}
    >
      <div
        className="w-full h-full"
        style={{
          borderRadius: "50%",
          overflow: "hidden",
          backdropFilter: glass.filterRef,
          WebkitBackdropFilter: glass.filterRef,
          boxShadow: "0 0 0 1px rgba(255,255,255,0.2), 0 8px 32px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );
}

function ControlsPanel({
  isOpen,
  onClose,
  engine,
  setEngine,
  isPaused,
  setIsPaused,
  svgParams,
  setSvgParams,
  shaderParams,
  setShaderParams,
  onReset,
}: {
  isOpen: boolean;
  onClose: () => void;
  engine: "svg" | "shaders";
  setEngine: (e: "svg" | "shaders") => void;
  isPaused: boolean;
  setIsPaused: (p: boolean) => void;
  svgParams: SVGParams;
  setSvgParams: (p: SVGParams) => void;
  shaderParams: ShaderParams;
  setShaderParams: (p: ShaderParams) => void;
  onReset: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700 shadow-2xl flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Settings2 size={16} className="text-lime-400" />
          Controls
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Engine</label>
          <div className="mt-2 flex items-center justify-between bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setEngine("svg")}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                engine === "svg" ? "bg-lime-500 text-slate-900" : "text-slate-400 hover:text-white"
              }`}
            >
              SVG Refraction
            </button>
            <button
              onClick={() => setEngine("shaders")}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                engine === "shaders" ? "bg-lime-500 text-slate-900" : "text-slate-400 hover:text-white"
              }`}
            >
              Shaders
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Animation</label>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-slate-300">{isPaused ? "Paused" : "Playing"}</span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isPaused ? "bg-slate-700 text-slate-300" : "bg-lime-500/20 text-lime-400"
              }`}
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
              {isPaused ? "Play" : "Pause"}
            </button>
          </div>
        </div>

        <div className="h-px bg-slate-700" />

        {engine === "svg" ? (
          <div className="space-y-4">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">SVG Parameters</label>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300">Bubbles</span>
                  <span className="text-slate-500 font-mono">{svgParams.bubbleCount}</span>
                </div>
                <Slider value={[svgParams.bubbleCount]} min={1} max={15} step={1} onValueChange={([v]) => setSvgParams({ ...svgParams, bubbleCount: v })} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300">Bezel Width</span>
                  <span className="text-slate-500 font-mono">{svgParams.bezelWidth}</span>
                </div>
                <Slider value={[svgParams.bezelWidth]} min={5} max={60} step={1} onValueChange={([v]) => setSvgParams({ ...svgParams, bezelWidth: v })} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300">Glass Thickness</span>
                  <span className="text-slate-500 font-mono">{svgParams.glassThickness}</span>
                </div>
                <Slider value={[svgParams.glassThickness]} min={50} max={500} step={10} onValueChange={([v]) => setSvgParams({ ...svgParams, glassThickness: v })} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300">Blur</span>
                  <span className="text-slate-500 font-mono">{svgParams.blur}</span>
                </div>
                <Slider value={[svgParams.blur]} min={0} max={20} step={1} onValueChange={([v]) => setSvgParams({ ...svgParams, blur: v })} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300">Refractive Index</span>
                  <span className="text-slate-500 font-mono">{svgParams.refractiveIndex.toFixed(1)}</span>
                </div>
                <Slider value={[svgParams.refractiveIndex]} min={1.0} max={3.0} step={0.1} onValueChange={([v]) => setSvgParams({ ...svgParams, refractiveIndex: v })} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300">Specular</span>
                  <span className="text-slate-500 font-mono">{svgParams.specularOpacity.toFixed(2)}</span>
                </div>
                <Slider value={[svgParams.specularOpacity]} min={0} max={1} step={0.05} onValueChange={([v]) => setSvgParams({ ...svgParams, specularOpacity: v })} />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Shader Parameters</label>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300">Blur</span>
                  <span className="text-slate-500 font-mono">{shaderParams.blur}</span>
                </div>
                <Slider value={[shaderParams.blur]} min={0} max={30} step={1} onValueChange={([v]) => setShaderParams({ ...shaderParams, blur: v })} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300">Tint Opacity</span>
                  <span className="text-slate-500 font-mono">{shaderParams.tintOpacity.toFixed(2)}</span>
                </div>
                <Slider value={[shaderParams.tintOpacity]} min={0} max={0.5} step={0.01} onValueChange={([v]) => setShaderParams({ ...shaderParams, tintOpacity: v })} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300">Animation Speed</span>
                  <span className="text-slate-500 font-mono">{shaderParams.animationSpeed}s</span>
                </div>
                <Slider value={[shaderParams.animationSpeed]} min={1} max={20} step={1} onValueChange={([v]) => setShaderParams({ ...shaderParams, animationSpeed: v })} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <RotateCcw size={14} />
          Reset to defaults
        </button>
      </div>
    </div>
  );
}

interface GlassHeroProps {
  title?: React.ReactNode;
  tagline?: string;
  showInstallCommand?: boolean;
  showControls?: boolean;
}

export function GlassHero({
  title,
  tagline = "Customize your style, choose between 2 different engines for the best support",
  showInstallCommand = true,
  showControls = true,
}: GlassHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const [engine, setEngine] = useState<"svg" | "shaders">("svg");
  const [svgParams, setSvgParams] = useState<SVGParams>(DEFAULT_SVG_PARAMS);
  const [shaderParams, setShaderParams] = useState<ShaderParams>(DEFAULT_SHADER_PARAMS);
  const [resetKey, setResetKey] = useState(0);
  const [controlsOpen, setControlsOpen] = useState(false);

  const bubbles = useAnimatedBubbles(
    engine === "svg" ? svgParams.bubbleCount : 0,
    containerSize,
    isPaused,
    resetKey
  );

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleReset = () => {
    setSvgParams(DEFAULT_SVG_PARAMS);
    setShaderParams(DEFAULT_SHADER_PARAMS);
    setResetKey((k) => k + 1);
  };

  return (
    <section className="relative">
      <div
        ref={containerRef}
        className="relative overflow-hidden h-[70vh] min-h-[500px]"
        onMouseMove={handleMouseMove}
      >
        {/* Background image with parallax */}
        <img
          src={HERO_BG}
          alt=""
          className="absolute object-cover transition-transform duration-300 ease-out pointer-events-none"
          style={{
            minWidth: "150%",
            minHeight: "150%",
            width: "150%",
            height: "150%",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) translate(${(mousePos.x - containerSize.width / 2) * -0.008}px, ${(mousePos.y - containerSize.height / 2) * -0.008}px)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/80" />

        {/* Animated bubbles (SVG engine) */}
        {engine === "svg" && bubbles.map(bubble => (
          <GlassBubble key={bubble.id} bubble={bubble} mousePos={mousePos} svgParams={svgParams} />
        ))}

        {/* Shader effect overlay panels */}
        {engine === "shaders" && (
          <div className="absolute inset-0 flex items-center justify-center gap-8 p-12 flex-wrap">
            {(["frosted", "crystal", "aurora", "prism", "holographic", "smoke"] as GlassEffectName[]).map((effect, i) => (
              <Glass
                key={effect}
                effect={effect}
                options={{
                  blur: shaderParams.blur,
                  tintOpacity: shaderParams.tintOpacity,
                  animationSpeed: shaderParams.animationSpeed + i,
                }}
                className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center rounded-2xl animate-float"
                style={{
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                <span className="text-white/90 font-semibold text-sm capitalize">{effect}</span>
              </Glass>
            ))}
          </div>
        )}

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
          <div className="pointer-events-auto">
            {title || (
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
                <span className="bg-gradient-to-r from-white via-lime-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                  Real glass effects.
                </span>
                <br />
                <span className="bg-gradient-to-r from-lime-300 via-yellow-300 to-lime-300 bg-clip-text text-transparent">
                  Drop in, done.
                </span>
              </h1>
            )}

            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
              {tagline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <NavLink
                to="/gallery"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-lime-100 transition-colors"
              >
                View Gallery <ArrowRight size={18} />
              </NavLink>
              {showInstallCommand && (
                <CopyCommand command="npm i solid-glass" />
              )}
            </div>
          </div>
        </div>

        {/* Controls button - bottom right of hero */}
        {showControls && (
          <button
            onClick={() => setControlsOpen(true)}
            className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-900/80 backdrop-blur-sm border border-white/20 text-white hover:bg-slate-800 transition-all z-10"
          >
            <Settings2 size={16} />
            Controls
          </button>
        )}
      </div>

      {/* Fixed Controls Panel */}
      {showControls && (
        <ControlsPanel
          isOpen={controlsOpen}
          onClose={() => setControlsOpen(false)}
          engine={engine}
          setEngine={setEngine}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          svgParams={svgParams}
          setSvgParams={setSvgParams}
          shaderParams={shaderParams}
          setShaderParams={setShaderParams}
          onReset={handleReset}
        />
      )}
    </section>
  );
}
