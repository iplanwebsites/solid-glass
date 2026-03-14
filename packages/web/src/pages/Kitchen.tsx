import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { createLiquidGlass, type SurfaceType } from "solid-glass/engines/svg-refraction";
import { Glass, type TemplateName } from "solid-glass";
import { ArrowRight, Sparkles, Play, Pause, Settings2, RotateCcw, X } from "lucide-react";
import { Slider } from "../components/ui/slider";

// Hero background images - random on page load
const HERO_BGS = [
  // Nature & Landscapes
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=90", // Mountains
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&q=90", // Foggy mountains
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=90", // Nature valley
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=90", // Lake reflection
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=90", // Beach
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1600&q=90", // Stars
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=90", // Mountain peak
  // Textures & Surfaces
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1600&q=90", // Colorful gradient abstract
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1600&q=90", // Purple gradient
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&q=90", // Gradient mesh
  "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=1600&q=90", // Aurora borealis
  "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1600&q=90", // Dark gradient
  "https://images.unsplash.com/photo-1557683316-973673bdar25?w=1600&q=90", // Marble texture
  "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=1600&q=90", // Paper texture cream
  "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=1600&q=90", // Dark geometric
  "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=1600&q=90", // Red smoke
  "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1600&q=90", // Watercolor abstract
  // Architecture & Patterns
  "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1600&q=90", // Japan temple
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1600&q=90", // Glass building
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=90", // Geometric ceiling
  // Macro & Abstract
  "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=1600&q=90", // Oil on water
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5571?w=1600&q=90", // Crystal macro
  "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=1600&q=90", // Paint swirl
];

// Pick random background on module load
const HERO_BG = HERO_BGS[Math.floor(Math.random() * HERO_BGS.length)];

// Bubble style presets - each with unique visual character
const BUBBLE_STYLES = [
  {
    name: "crystal-sphere",
    bezelWidth: 22, glassThickness: 280, blur: 4, refractiveIndex: 1.8, specularOpacity: 0.75, surface: "convexCircle" as SurfaceType
  },
  {
    name: "liquid-drop",
    bezelWidth: 30, glassThickness: 350, blur: 2, refractiveIndex: 2.0, specularOpacity: 0.85, surface: "convexCircle" as SurfaceType
  },
  {
    name: "soft-bubble",
    bezelWidth: 40, glassThickness: 150, blur: 6, refractiveIndex: 1.4, specularOpacity: 0.5, surface: "convexCircle" as SurfaceType
  },
  {
    name: "sharp-lens",
    bezelWidth: 15, glassThickness: 400, blur: 0, refractiveIndex: 2.2, specularOpacity: 0.9, surface: "convexCircle" as SurfaceType
  },
  {
    name: "frosted-orb",
    bezelWidth: 35, glassThickness: 200, blur: 10, refractiveIndex: 1.5, specularOpacity: 0.4, surface: "convexCircle" as SurfaceType
  },
  {
    name: "diamond",
    bezelWidth: 18, glassThickness: 500, blur: 1, refractiveIndex: 2.4, specularOpacity: 0.95, surface: "convexCircle" as SurfaceType
  },
];

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

      // Check for overlap with existing bubbles
      let overlaps = false;
      for (const pos of positions) {
        const dx = x - pos.x;
        const dy = y - pos.y;
        const minDist = (size + pos.size) / 2 + 30; // 30px gap between bubbles
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

    // If we couldn't place after max attempts, force place with smaller size
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

    // Generate well-distributed positions
    const positions = generateDistributedPositions(
      count,
      containerSize.width,
      containerSize.height,
      90,  // min size
      150  // max size
    );

    const initial: Bubble[] = positions.map((pos, i) => ({
      id: i,
      x: pos.x,
      y: pos.y,
      size: pos.size,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      surface: "convexCircle" as SurfaceType, // All circles for max roundness
      phase: Math.random() * Math.PI * 2,
      morphSpeed: 0.3 + Math.random() * 0.4,
      styleIndex: i % BUBBLE_STYLES.length,
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

        // Bounce off edges
        const halfSize = b.size / 2;
        if (newX < halfSize || newX > containerSize.width - halfSize) {
          newVx *= -1;
          newX = Math.max(halfSize, Math.min(containerSize.width - halfSize, newX));
        }
        if (newY < halfSize || newY > containerSize.height - halfSize) {
          newVy *= -1;
          newY = Math.max(halfSize, Math.min(containerSize.height - halfSize, newY));
        }

        // Gentle floating motion
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

  // Use fixed integer size for the glass (ImageData requires integers)
  const glassSize = Math.round(bubble.size);

  // Visual size with morphing (for CSS transform, doesn't affect ImageData)
  const visualScale = useMemo(() => {
    const baseMorph = Math.sin(bubble.phase) * 0.08;
    return 1 + baseMorph;
  }, [bubble.phase]);

  // Interactive displacement based on mouse proximity
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

  // Scale bezel proportionally to bubble size
  const scaledBezelWidth = Math.round((svgParams.bezelWidth / 100) * glassSize);

  const glass = useMemo(() => createLiquidGlass({
    width: glassSize,
    height: glassSize,
    radius: Math.round(glassSize / 2), // Max radius = perfect circle
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

// Default SVG parameters
const DEFAULT_SVG_PARAMS = {
  bubbleCount: 9,
  bezelWidth: 18,
  glassThickness: 230,
  blur: 3,
  refractiveIndex: 1.9,
  specularOpacity: 0.60,
};

interface SVGParams {
  bubbleCount: number;
  bezelWidth: number;
  glassThickness: number;
  blur: number;
  refractiveIndex: number;
  specularOpacity: number;
}

function ControlsPanel({
  isOpen,
  onClose,
  isPaused,
  setIsPaused,
  svgParams,
  setSvgParams,
  onReset,
}: {
  isOpen: boolean;
  onClose: () => void;
  isPaused: boolean;
  setIsPaused: (p: boolean) => void;
  svgParams: SVGParams;
  setSvgParams: (p: SVGParams) => void;
  onReset: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700 shadow-2xl flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Settings2 size={16} className="text-lime-400" />
          Glass Controls
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Animation Toggle */}
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

        {/* SVG Refraction Parameters */}
        <div className="space-y-4">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">SVG Refraction</label>
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

function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const [svgParams, setSvgParams] = useState<SVGParams>(DEFAULT_SVG_PARAMS);
  const [resetKey, setResetKey] = useState(0);
  const [controlsOpen, setControlsOpen] = useState(false);

  const bubbles = useAnimatedBubbles(
    svgParams.bubbleCount,
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
    setResetKey((k) => k + 1);
  };

  return (
    <section className="relative">
      <div
        ref={containerRef}
        className="relative overflow-hidden h-[70vh] min-h-[500px]"
        onMouseMove={handleMouseMove}
      >
        {/* Background image with parallax - much larger to ensure full coverage */}
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

        {/* Animated glass bubbles */}
        {bubbles.map(bubble => (
          <GlassBubble key={bubble.id} bubble={bubble} mousePos={mousePos} svgParams={svgParams} />
        ))}

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
          <div className="pointer-events-auto">
            <div className="inline-flex items-center gap-2 bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2 text-sm text-white/80 mb-6">
              <Sparkles size={14} className="text-lime-400" />
              Kitchen Sink — Experimental Glass Effects
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              <span className="bg-gradient-to-r from-white via-lime-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                Glass that moves.
              </span>
              <br />
              <span className="bg-gradient-to-r from-lime-300 via-yellow-300 to-lime-300 bg-clip-text text-transparent">
                Glass that breathes.
              </span>
            </h1>

            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
              Animated glass bubbles with physics-based refraction.
              Watch them float and morph.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/gallery"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-lime-100 transition-colors"
              >
                Explore Gallery <ArrowRight size={18} />
              </a>
              <a
                href="/showcase"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                Open Playground
              </a>
            </div>
          </div>
        </div>

        {/* Controls button - bottom right of hero */}
        <button
          onClick={() => setControlsOpen(true)}
          className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-900/80 backdrop-blur-sm border border-white/20 text-white hover:bg-slate-800 transition-all z-10"
        >
          <Settings2 size={16} />
          Controls
        </button>
      </div>

      {/* Fixed Controls Panel */}
      <ControlsPanel
        isOpen={controlsOpen}
        onClose={() => setControlsOpen(false)}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        svgParams={svgParams}
        setSvgParams={setSvgParams}
        onReset={handleReset}
      />
    </section>
  );
}

function GlassButtonsShowcase() {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const buttons = [
    { template: "frosted" as TemplateName, label: "Frosted Button", overrides: { blur: 12, tintOpacity: 0.15 } },
    { template: "crystal" as TemplateName, label: "Crystal Button", overrides: { blur: 8, distortion: 30 } },
    { template: "aurora" as TemplateName, label: "Aurora Button", overrides: { colors: ["#a78bfa", "#6ee7b7"] } },
    { template: "holographic" as TemplateName, label: "Holo Button", overrides: { iridescence: 0.5 } },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-lime-200 to-yellow-200 bg-clip-text text-transparent">
            Glass Buttons
          </h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            Interactive buttons with different glass effects. Hover to see the magic.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl">
          <img
            src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-6 p-12">
            {buttons.map((btn) => (
              <Glass
                key={btn.template}
                template={btn.template}
                {...btn.overrides}
                className={`px-8 py-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                  hoveredBtn === btn.template ? "scale-110 shadow-2xl" : ""
                }`}
                onMouseEnter={() => setHoveredBtn(btn.template)}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                <span className="text-white font-semibold text-sm whitespace-nowrap">{btn.label}</span>
              </Glass>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LoupeShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<Element | null>(null);
  const [pos, setPos] = useState({ x: 200, y: 150 });
  const [isActive, setIsActive] = useState(false);
  const loupeSize = 140;

  const glass = useMemo(
    () =>
      createLiquidGlass({
        width: loupeSize,
        height: loupeSize,
        radius: loupeSize / 2,
        bezelWidth: 30,
        glassThickness: 200,
        blur: 0,
        refractiveIndex: 1.6,
        surface: "convexCircle",
        specularOpacity: 0.8,
        dpr: 1,
      }),
    []
  );

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

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: Math.max(loupeSize / 2, Math.min(rect.width - loupeSize / 2, e.clientX - rect.left)),
      y: Math.max(loupeSize / 2, Math.min(rect.height - loupeSize / 2, e.clientY - rect.top)),
    });
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-lime-200 to-yellow-200 bg-clip-text text-transparent">
            Loupe Effect
          </h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            Physics-based magnifying glass. Move your mouse to explore the image.
          </p>
          <span className="inline-block mt-3 text-[10px] font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full px-3 py-1">
            Chrome only
          </span>
        </div>

        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-3xl h-[400px] cursor-none select-none"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsActive(true)}
          onMouseLeave={() => setIsActive(false)}
        >
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="transition-opacity duration-200"
            style={{
              position: "absolute",
              left: pos.x - loupeSize / 2,
              top: pos.y - loupeSize / 2,
              width: loupeSize,
              height: loupeSize,
              borderRadius: "50%",
              overflow: "hidden",
              backdropFilter: glass.filterRef,
              WebkitBackdropFilter: glass.filterRef,
              boxShadow: "0 0 0 3px rgba(190, 231, 46, 0.4), 0 0 60px rgba(190, 231, 46, 0.2), 0 8px 32px rgba(0,0,0,0.4)",
              pointerEvents: "none",
              opacity: isActive ? 1 : 0,
            }}
          />
        </div>
      </div>
    </section>
  );
}

function InteractivePanelGrid() {
  const [activePanel, setActivePanel] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const panels = [
    { template: "frosted" as TemplateName, title: "Frosted", desc: "Classic Apple-style blur" },
    { template: "crystal" as TemplateName, title: "Crystal", desc: "Noise-based distortion" },
    { template: "aurora" as TemplateName, title: "Aurora", desc: "Animated gradient overlay" },
    { template: "smoke" as TemplateName, title: "Smoke", desc: "Dark animated turbulence" },
    { template: "prism" as TemplateName, title: "Prism", desc: "Spectral color splitting" },
    { template: "holographic" as TemplateName, title: "Holographic", desc: "Iridescent shimmer" },
  ];

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  }, []);

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-lime-200 to-yellow-200 bg-clip-text text-transparent">
            Effect Showcase
          </h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            Six distinct glass effects. Hover to expand and explore.
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-3xl"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
        >
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=80"
            alt=""
            className="absolute w-[110%] h-[110%] object-cover transition-transform duration-200 ease-out"
            style={{
              top: "-5%",
              left: "-5%",
              transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
            }}
          />
          <div className="absolute inset-0 bg-black/10" />

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
            {panels.map((panel, i) => (
              <Glass
                key={panel.template}
                template={panel.template}
                blur={14}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-500 ${
                  activePanel === i ? "scale-105 z-10" : activePanel !== null ? "scale-95 opacity-70" : ""
                }`}
                onMouseEnter={() => setActivePanel(i)}
                onMouseLeave={() => setActivePanel(null)}
              >
                <h3 className="text-white font-semibold text-lg">{panel.title}</h3>
                <p className="text-white/60 text-sm mt-1">{panel.desc}</p>
                {activePanel === i && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <code className="text-[10px] text-lime-300 font-mono">
                      {`<Glass template="${panel.template}" />`}
                    </code>
                  </div>
                )}
              </Glass>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Kitchen() {
  return (
    <div>
      <HeroSection />
      <GlassButtonsShowcase />
      <LoupeShowcase />
      <InteractivePanelGrid />
    </div>
  );
}
