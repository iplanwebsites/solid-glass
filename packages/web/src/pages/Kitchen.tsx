import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { createLiquidGlass, type SurfaceType } from "solid-glass/engines/svg-refraction";
import { Glass, type GlassEffectName } from "solid-glass";
import { ArrowRight, Sparkles, Zap, Play, Pause, FlaskConical } from "lucide-react";
import { NavLink } from "react-router-dom";

// Hero background images - random on page load
const HERO_BGS = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=90", // Mountains
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&q=90", // Foggy mountains
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=90", // Nature valley
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=90", // Lake reflection
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=90", // Beach
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1600&q=90", // Stars
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=90", // Mountain peak
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

function useAnimatedBubbles(count: number, containerSize: { width: number; height: number }, paused: boolean) {
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
  }, [count, containerSize.width, containerSize.height]);

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

function GlassBubble({ bubble, mousePos }: { bubble: Bubble; mousePos: { x: number; y: number } }) {
  const svgRef = useRef<Element | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Get the style preset for this bubble
  const style = BUBBLE_STYLES[bubble.styleIndex];

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
  const scaledBezelWidth = Math.round((style.bezelWidth / 100) * glassSize);

  const glass = useMemo(() => createLiquidGlass({
    width: glassSize,
    height: glassSize,
    radius: Math.round(glassSize / 2), // Max radius = perfect circle
    bezelWidth: Math.max(10, scaledBezelWidth),
    glassThickness: style.glassThickness,
    blur: isHovered ? style.blur + 2 : style.blur,
    refractiveIndex: style.refractiveIndex,
    surface: style.surface,
    specularOpacity: isHovered ? Math.min(1, style.specularOpacity + 0.15) : style.specularOpacity,
    dpr: 1,
  }), [glassSize, style, scaledBezelWidth, isHovered]);

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
      className="absolute cursor-pointer"
      style={{
        left: bubble.x - glassSize / 2 + displacement.x,
        top: bubble.y - glassSize / 2 + displacement.y,
        width: glassSize,
        height: glassSize,
        transform: `scale(${visualScale})`,
        transition: "transform 0.15s ease-out",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="w-full h-full transition-all duration-300"
        style={{
          borderRadius: "50%", // Always perfect circle
          overflow: "hidden",
          backdropFilter: glass.filterRef,
          WebkitBackdropFilter: glass.filterRef,
          boxShadow: isHovered
            ? "0 0 0 3px rgba(190, 231, 46, 0.6), 0 0 60px rgba(190, 231, 46, 0.4), 0 12px 40px rgba(0,0,0,0.5)"
            : "0 0 0 1px rgba(255,255,255,0.25), 0 8px 32px rgba(0,0,0,0.35)",
          transform: isHovered ? "scale(1.15)" : "scale(1)",
        }}
      />
    </div>
  );
}

function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const [engine, setEngine] = useState<"svg" | "shaders">("svg");

  const bubbles = useAnimatedBubbles(engine === "svg" ? 8 : 0, containerSize, isPaused);

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

  return (
    <section className="relative">
      <div
        ref={containerRef}
        className="relative overflow-hidden h-[70vh] min-h-[500px]"
        onMouseMove={handleMouseMove}
      >
        {/* Background image with parallax - extra size to prevent gaps during movement */}
        <img
          src={HERO_BG}
          alt=""
          className="absolute object-cover transition-transform duration-300 ease-out pointer-events-none"
          style={{
            width: "120%",
            height: "120%",
            top: "-10%",
            left: "-10%",
            transform: `translate(${(mousePos.x - containerSize.width / 2) * -0.015}px, ${(mousePos.y - containerSize.height / 2) * -0.015}px)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/80" />

        {/* Animated bubbles (SVG engine) */}
        {engine === "svg" && bubbles.map(bubble => (
          <GlassBubble key={bubble.id} bubble={bubble} mousePos={mousePos} />
        ))}

        {/* Shader effect overlay panels */}
        {engine === "shaders" && (
          <div className="absolute inset-0 flex items-center justify-center gap-8 p-12">
            {(["frosted", "crystal", "aurora", "prism"] as GlassEffectName[]).map((effect, i) => (
              <Glass
                key={effect}
                effect={effect}
                options={{ blur: 12, animationSpeed: 4 + i }}
                className="w-40 h-40 flex items-center justify-center rounded-2xl animate-float"
                style={{
                  animationDelay: `${i * 0.5}s`,
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
              Hover to interact. Watch them float and morph.
            </p>

            {/* Engine switch */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <button
                onClick={() => setEngine("svg")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  engine === "svg"
                    ? "bg-lime-400 text-slate-900"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                <Zap size={14} /> SVG Refraction
              </button>
              <button
                onClick={() => setEngine("shaders")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  engine === "shaders"
                    ? "bg-lime-400 text-slate-900"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                <Sparkles size={14} /> Shaders
              </button>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/10 text-white/70 hover:bg-white/20 transition-all"
              >
                {isPaused ? <Play size={14} /> : <Pause size={14} />}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink
                to="/gallery"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-lime-100 transition-colors"
              >
                Explore Gallery <ArrowRight size={18} />
              </NavLink>
              <NavLink
                to="/showcase"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                Open Playground
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GlassButtonsShowcase() {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const buttons = [
    { effect: "frosted" as GlassEffectName, label: "Frosted Button", options: { blur: 12, tintOpacity: 0.15 } },
    { effect: "crystal" as GlassEffectName, label: "Crystal Button", options: { blur: 8, distortionStrength: 30 } },
    { effect: "aurora" as GlassEffectName, label: "Aurora Button", options: { colors: ["#a78bfa", "#6ee7b7"] } },
    { effect: "holographic" as GlassEffectName, label: "Holo Button", options: { iridescence: 0.5 } },
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
                key={btn.effect}
                effect={btn.effect}
                options={btn.options as never}
                className={`px-8 py-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                  hoveredBtn === btn.effect ? "scale-110 shadow-2xl" : ""
                }`}
                onMouseEnter={() => setHoveredBtn(btn.effect)}
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
    { effect: "frosted" as GlassEffectName, title: "Frosted", desc: "Classic Apple-style blur" },
    { effect: "crystal" as GlassEffectName, title: "Crystal", desc: "Noise-based distortion" },
    { effect: "aurora" as GlassEffectName, title: "Aurora", desc: "Animated gradient overlay" },
    { effect: "smoke" as GlassEffectName, title: "Smoke", desc: "Dark animated turbulence" },
    { effect: "prism" as GlassEffectName, title: "Prism", desc: "Spectral color splitting" },
    { effect: "holographic" as GlassEffectName, title: "Holographic", desc: "Iridescent shimmer" },
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
                key={panel.effect}
                effect={panel.effect}
                options={{ blur: 14 }}
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
                      {`<Glass effect="${panel.effect}" />`}
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
  console.log("[Kitchen] Rendering");

  return (
    <div>
      {/* Debug header - remove later */}
      <div className="bg-lime-500/20 border border-lime-500/50 text-lime-300 text-center py-2 text-sm">
        <FlaskConical className="inline w-4 h-4 mr-2" />
        Kitchen Page - Experimental Components
      </div>

      <HeroSection />
      <GlassButtonsShowcase />
      <LoupeShowcase />
      <InteractivePanelGrid />
    </div>
  );
}
