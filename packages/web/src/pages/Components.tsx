import { useState, useEffect, useMemo, useRef } from "react";
import { Glass } from "solid-glass";
import { createLiquidGlass, type SurfaceType } from "solid-glass/engines/svg-refraction";
import { Search, Bell, X, Info, CheckCircle, AlertTriangle, User, Lock, Mail } from "lucide-react";
import { CodeBlock } from "../components/CodeBlock";
import { RenderTierBadge } from "../components/RenderTierTag";

/* TierBadge alias for shared component */
const TierBadge = RenderTierBadge;

const BG_IMAGE = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";

/* ─── GlassCard Demo ─── */
function GlassCardDemo() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-white">GlassCard</h3>
          <TierBadge tier="css" />
        </div>
        <p className="text-slate-400 text-sm">A ready-to-use frosted glass card with title, subtitle, and content slots.</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl h-80 flex items-center justify-center">
        <img src={BG_IMAGE} alt="" className="absolute inset-0 w-[120%] h-[120%] object-cover -top-[10%] -left-[10%]" />
        <div className="relative z-10 flex gap-4 flex-wrap justify-center px-4">
          <Glass template="frosted" blur={16} tintColor="#ffffff" tintOpacity={0.1} borderRadius={20} className="p-6 w-64">
            <h3 className="text-lg font-semibold text-white mb-1">Notification</h3>
            <p className="text-sm text-white/60 mb-3">3 new messages</p>
            <p className="text-sm text-white/80">Preview of the latest message content goes here...</p>
          </Glass>
          <Glass template="crystal" blur={8} tintColor="#8b5cf6" tintOpacity={0.08} borderRadius={20} className="p-6 w-64">
            <h3 className="text-lg font-semibold text-white mb-1">Analytics</h3>
            <p className="text-sm text-white/60 mb-3">Weekly report</p>
            <p className="text-sm text-white/80">Up 24% from last week</p>
          </Glass>
        </div>
      </div>

      <CodeBlock code={`import { GlassCard } from "solid-glass/components/react";

<GlassCard title="Notification" subtitle="3 new messages">
  <p>Preview of the latest message...</p>
</GlassCard>

// Or with crystal effect:
<GlassCard title="Analytics" effect="crystal" blur={8}>
  <p>Up 24% from last week</p>
</GlassCard>`} />
    </div>
  );
}

/* ─── GlassButton Demo ─── */
function GlassButtonDemo() {
  const [clicked, setClicked] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-white">GlassButton</h3>
          <TierBadge tier="css" />
        </div>
        <p className="text-slate-400 text-sm">Interactive glass-styled buttons with hover and active states.</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl h-48 flex items-center justify-center bg-gradient-to-br from-blue-600 via-violet-600 to-fuchsia-600">
        <div className="flex gap-4 flex-wrap justify-center px-4">
          {(["frosted", "crystal", "thin", "aurora"] as const).map((tmpl) => (
            <Glass
              key={tmpl}
              as="button"
              template={tmpl}
              blur={12}
              tintColor="#ffffff"
              tintOpacity={0.08}
              borderRadius={12}
              className={`px-5 py-2.5 text-sm font-medium text-white cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${clicked === tmpl ? "ring-2 ring-white/50" : ""}`}
              onClick={() => { setClicked(tmpl); setTimeout(() => setClicked(null), 1000); }}
            >
              {tmpl.charAt(0).toUpperCase() + tmpl.slice(1)}
            </Glass>
          ))}
        </div>
      </div>

      {clicked && (
        <p className="text-sm text-green-400 text-center">Clicked: {clicked}!</p>
      )}

      <CodeBlock code={`import { GlassButton } from "solid-glass/components/react";

<GlassButton onClick={() => alert("Clicked!")}>
  Get Started
</GlassButton>

<GlassButton effect="crystal" disabled>
  Disabled
</GlassButton>`} />
    </div>
  );
}

/* ─── Loupe Demo ─── */
function LoupeDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<Element | null>(null);
  const [pos, setPos] = useState({ x: 150, y: 120 });
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
        refractiveIndex: 1.5,
        surface: "convexCircle" as SurfaceType,
        specularOpacity: 0.7,
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
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-white">Loupe</h3>
          <TierBadge tier="svg-backdrop" />
        </div>
        <p className="text-slate-400 text-sm">
          A magnifying glass component using the SVG refraction engine. Move your mouse over the image.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl h-80 cursor-none select-none"
        onMouseMove={handleMouseMove}
      >
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
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
            boxShadow: "0 0 0 2px rgba(255,255,255,0.3), 0 8px 32px rgba(0,0,0,0.3)",
            pointerEvents: "none",
          }}
        />
      </div>

      <CodeBlock code={`import { Loupe } from "solid-glass/components/react";

<div style={{ position: "relative" }}>
  <img src="photo.jpg" />
  <Loupe x={150} y={150} size={120} />
</div>`} />
    </div>
  );
}

/* ─── RefractionPanel Demo ─── */
function RefractionPanelDemo() {
  const svgRef = useRef<Element | null>(null);
  const [surface, setSurface] = useState<SurfaceType>("convexSquircle");

  const glass = useMemo(
    () =>
      createLiquidGlass({
        width: 300,
        height: 200,
        radius: 20,
        bezelWidth: 50,
        glassThickness: 200,
        blur: 8,
        refractiveIndex: 1.5,
        surface,
        specularOpacity: 0.6,
        saturation: 1.2,
        dpr: 1,
      }),
    [surface]
  );

  useEffect(() => {
    if (svgRef.current) svgRef.current.remove();
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
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-white">RefractionPanel</h3>
          <TierBadge tier="svg-backdrop" />
        </div>
        <p className="text-slate-400 text-sm">
          A panel using the SVG refraction engine with Snell-Descartes law.
        </p>
      </div>

      <div className="flex gap-2 justify-center mb-4">
        {(["convexCircle", "convexSquircle", "concave", "lip"] as SurfaceType[]).map((s) => (
          <button
            key={s}
            onClick={() => setSurface(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${surface === s ? "bg-white text-slate-900" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
          >
            {s.replace("convex", "Convex ").replace("concave", "Concave").replace("lip", "Lip")}
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-2xl h-80 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80"
          alt=""
          className="absolute inset-0 w-[115%] h-[115%] object-cover -top-[7%] -left-[7%]"
        />
        <div
          style={{
            width: 300,
            height: 200,
            borderRadius: 20,
            overflow: "hidden",
            backdropFilter: glass.filterRef,
            WebkitBackdropFilter: glass.filterRef,
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="text-center px-4 relative z-10">
            <p className="text-white/90 font-medium">Physics-based glass</p>
            <p className="text-white/50 text-xs mt-1">Surface: {surface}</p>
          </div>
        </div>
      </div>

      <CodeBlock code={`import { RefractionPanel } from "solid-glass/components/react";

<RefractionPanel
  width={320}
  height={200}
  bezelWidth={40}
  surface="${surface}"
>
  <h2>Physics-based glass</h2>
</RefractionPanel>`} />
    </div>
  );
}

/* ─── GlassNavbar Demo ─── */
function GlassNavbarDemo() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-white">GlassNavbar</h3>
          <TierBadge tier="css" />
        </div>
        <p className="text-slate-400 text-sm">A horizontal navigation bar with frosted glass effect, ideal for fixed headers over rich backgrounds.</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl h-72">
        <img src={BG_IMAGE} alt="" className="absolute inset-0 w-[120%] h-[120%] object-cover -top-[10%] -left-[10%]" />
        <div className="relative z-10 p-4">
          <Glass template="frosted" blur={24} tintColor="#0f172a" tintOpacity={0.25} borderRadius={16} className="px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gem size={20} className="text-blue-400" />
              <span className="text-white font-bold text-lg">Glassify</span>
            </div>
            <nav className="hidden sm:flex items-center gap-6">
              <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Home</a>
              <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Features</a>
              <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Pricing</a>
              <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Docs</a>
            </nav>
            <div className="flex items-center gap-3">
              <button className="text-white/60 hover:text-white transition-colors"><Search size={18} /></button>
              <Glass as="button" template="thin" blur={8} tintColor="#3b82f6" tintOpacity={0.3} borderRadius={10} className="px-4 py-1.5 text-sm font-medium text-white cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform">
                Sign Up
              </Glass>
            </div>
          </Glass>
        </div>
        <div className="absolute bottom-6 left-0 right-0 text-center text-white/40 text-sm">
          Page content below the navbar...
        </div>
      </div>

      <CodeBlock code={`import { Glass } from "solid-glass";

<Glass template="frosted" blur={24} tintColor="#0f172a" tintOpacity={0.25} borderRadius={16}
  className="px-5 py-3 flex items-center justify-between">
  <div className="flex items-center gap-2">
    <Gem size={20} />
    <span className="text-white font-bold">Glassify</span>
  </div>
  <nav className="flex items-center gap-6">
    <a href="#">Home</a>
    <a href="#">Features</a>
    <a href="#">Pricing</a>
  </nav>
  <Glass as="button" template="thin" blur={8} tintColor="#3b82f6"
    tintOpacity={0.3} borderRadius={10} className="px-4 py-1.5 text-sm">
    Sign Up
  </Glass>
</Glass>`} />
    </div>
  );
}

/* ─── GlassModal Demo ─── */
function GlassModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-white">GlassModal</h3>
          <TierBadge tier="css" />
        </div>
        <p className="text-slate-400 text-sm">A modal dialog with frosted glass backdrop and content panel. Click the button below to preview.</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl h-80">
        <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 flex items-center justify-center h-full">
          {!open ? (
            <Glass as="button" template="frosted" blur={12} tintColor="#ffffff" tintOpacity={0.1} borderRadius={12} className="px-6 py-3 text-white font-medium cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform" onClick={() => setOpen(true)}>
              Open Modal
            </Glass>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" onClick={() => setOpen(false)}>
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
                <Glass template="frosted" blur={20} tintColor="#1e293b" tintOpacity={0.6} borderRadius={20} className="p-8 w-80 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">Confirm Action</h4>
                    <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white transition-colors"><X size={18} /></button>
                  </div>
                  <p className="text-white/60 text-sm mb-6">Are you sure you want to proceed? This action cannot be undone.</p>
                  <div className="flex gap-3 justify-end">
                    <Glass as="button" template="thin" blur={8} tintColor="#ffffff" tintOpacity={0.05} borderRadius={10} className="px-4 py-2 text-sm text-white/70 cursor-pointer hover:text-white transition-colors" onClick={() => setOpen(false)}>
                      Cancel
                    </Glass>
                    <Glass as="button" template="thin" blur={8} tintColor="#3b82f6" tintOpacity={0.3} borderRadius={10} className="px-4 py-2 text-sm text-white font-medium cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform" onClick={() => setOpen(false)}>
                      Confirm
                    </Glass>
                  </div>
                </Glass>
              </div>
            </div>
          )}
        </div>
      </div>

      <CodeBlock code={`import { Glass } from "solid-glass";

{/* Backdrop */}
<div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

{/* Modal panel */}
<Glass template="frosted" blur={20} tintColor="#1e293b" tintOpacity={0.6}
  borderRadius={20} className="p-8 w-80 shadow-2xl">
  <h4 className="text-lg font-semibold text-white">Confirm Action</h4>
  <p className="text-white/60 text-sm mb-6">
    Are you sure you want to proceed?
  </p>
  <div className="flex gap-3 justify-end">
    <Glass as="button" template="thin" blur={8} tintColor="#ffffff"
      tintOpacity={0.05} borderRadius={10} className="px-4 py-2">
      Cancel
    </Glass>
    <Glass as="button" template="thin" blur={8} tintColor="#3b82f6"
      tintOpacity={0.3} borderRadius={10} className="px-4 py-2">
      Confirm
    </Glass>
  </div>
</Glass>`} />
    </div>
  );
}

/* ─── GlassTooltip Demo ─── */
function GlassTooltipDemo() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const items = [
    { icon: <Search size={20} />, label: "Search", tip: "Search files and folders" },
    { icon: <Bell size={18} />, label: "Alerts", tip: "View notifications" },
    { icon: <User size={18} />, label: "Profile", tip: "Account settings" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-white">GlassTooltip</h3>
          <TierBadge tier="css" />
        </div>
        <p className="text-slate-400 text-sm">Small tooltip bubbles with a thin glass effect, appearing on hover.</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl h-48 flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="flex gap-8">
          {items.map((item, idx) => (
            <div key={idx} className="relative flex flex-col items-center">
              <div
                className="relative"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <Glass template="thin" blur={10} tintColor="#ffffff" tintOpacity={0.1} borderRadius={12} className="p-3 text-white/80 hover:text-white cursor-pointer transition-colors">
                  {item.icon}
                </Glass>
                {hoveredIdx === idx && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
                    <Glass template="thin" blur={14} tintColor="#0f172a" tintOpacity={0.5} borderRadius={8} className="px-3 py-1.5 whitespace-nowrap">
                      <span className="text-xs text-white/90">{item.tip}</span>
                    </Glass>
                    <div className="w-2 h-2 rotate-45 bg-slate-800/50 backdrop-blur-sm mx-auto -mt-1" />
                  </div>
                )}
              </div>
              <span className="text-white/50 text-xs mt-2">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <CodeBlock code={`import { Glass } from "solid-glass";

{/* Tooltip wrapper */}
<div className="relative" onMouseEnter={show} onMouseLeave={hide}>
  <Glass template="thin" blur={10} tintColor="#ffffff"
    tintOpacity={0.1} borderRadius={12} className="p-3">
    <SearchIcon />
  </Glass>

  {/* Tooltip bubble */}
  {visible && (
    <Glass template="thin" blur={14} tintColor="#0f172a"
      tintOpacity={0.5} borderRadius={8} className="px-3 py-1.5 absolute -top-12">
      <span className="text-xs text-white/90">Search files</span>
    </Glass>
  )}
</div>`} />
    </div>
  );
}

/* ─── GlassToast Demo ─── */
function GlassToastDemo() {
  const [visibleToasts, setVisibleToasts] = useState<Set<string>>(new Set(["success", "info", "warning"]));

  const toasts = [
    { id: "success", icon: <CheckCircle size={18} />, title: "Success", message: "Your changes have been saved.", tintColor: "#22c55e", iconColor: "text-green-400" },
    { id: "info", icon: <Info size={18} />, title: "Info", message: "A new version is available.", tintColor: "#3b82f6", iconColor: "text-blue-400" },
    { id: "warning", icon: <AlertTriangle size={18} />, title: "Warning", message: "Storage is almost full.", tintColor: "#f59e0b", iconColor: "text-amber-400" },
  ];

  const dismissToast = (id: string) => {
    setVisibleToasts((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const resetToasts = () => setVisibleToasts(new Set(["success", "info", "warning"]));

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-white">GlassToast</h3>
          <TierBadge tier="css" />
        </div>
        <p className="text-slate-400 text-sm">Toast notifications with glass styling. Each type uses a different tint color for visual distinction.</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl min-h-[280px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="flex flex-col items-end gap-3">
          {toasts.filter((t) => visibleToasts.has(t.id)).map((toast) => (
            <Glass key={toast.id} template="frosted" blur={16} tintColor={toast.tintColor} tintOpacity={0.12} borderRadius={14} className="p-4 w-80 flex items-start gap-3">
              <span className={`mt-0.5 ${toast.iconColor}`}>{toast.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{toast.title}</p>
                <p className="text-xs text-white/60 mt-0.5">{toast.message}</p>
              </div>
              <button onClick={() => dismissToast(toast.id)} className="text-white/30 hover:text-white/70 transition-colors mt-0.5">
                <X size={14} />
              </button>
            </Glass>
          ))}
          {visibleToasts.size === 0 && (
            <div className="w-full flex items-center justify-center h-40">
              <button onClick={resetToasts} className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
                Reset toasts
              </button>
            </div>
          )}
        </div>
      </div>

      <CodeBlock code={`import { Glass } from "solid-glass";

{/* Success toast */}
<Glass template="frosted" blur={16} tintColor="#22c55e"
  tintOpacity={0.12} borderRadius={14} className="p-4 w-80 flex items-start gap-3">
  <CheckCircle size={18} className="text-green-400" />
  <div>
    <p className="text-sm font-semibold text-white">Success</p>
    <p className="text-xs text-white/60">Your changes have been saved.</p>
  </div>
  <button><X size={14} /></button>
</Glass>

{/* Info toast — swap tintColor */}
<Glass template="frosted" blur={16} tintColor="#3b82f6" tintOpacity={0.12} ...>

{/* Warning toast */}
<Glass template="frosted" blur={16} tintColor="#f59e0b" tintOpacity={0.12} ...>`} />
    </div>
  );
}

/* ─── GlassForm Demo ─── */
function GlassFormDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-white">GlassForm</h3>
          <TierBadge tier="css" />
        </div>
        <p className="text-slate-400 text-sm">A login form with glass-styled input fields and submit button, perfect for auth pages with scenic backgrounds.</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl h-[420px] flex items-center justify-center">
        <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80" alt="" className="absolute inset-0 w-[115%] h-[115%] object-cover -top-[7%] -left-[7%]" />
        <div className="relative z-10 w-full max-w-sm px-4">
          <Glass template="frosted" blur={18} tintColor="#0f172a" tintOpacity={0.4} borderRadius={24} className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 mb-3">
                <Lock size={22} className="text-blue-400" />
              </div>
              <h4 className="text-xl font-bold text-white">Welcome back</h4>
              <p className="text-white/50 text-sm mt-1">Sign in to your account</p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="text-xs text-white/50 font-medium mb-1.5 block">Email</label>
                <Glass template="thin" blur={6} tintColor="#ffffff" tintOpacity={0.05} borderRadius={10} className="flex items-center gap-2 px-3">
                  <Mail size={16} className="text-white/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-white text-sm py-2.5 placeholder:text-white/20 outline-none"
                  />
                </Glass>
              </div>

              <div>
                <label className="text-xs text-white/50 font-medium mb-1.5 block">Password</label>
                <Glass template="thin" blur={6} tintColor="#ffffff" tintOpacity={0.05} borderRadius={10} className="flex items-center gap-2 px-3">
                  <Lock size={16} className="text-white/30" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-transparent text-white text-sm py-2.5 placeholder:text-white/20 outline-none"
                  />
                </Glass>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 text-white/50 cursor-pointer">
                  <input type="checkbox" className="rounded border-white/20 bg-white/5" />
                  Remember me
                </label>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
              </div>

              <Glass as="button" template="frosted" blur={10} tintColor="#3b82f6" tintOpacity={0.35} borderRadius={12} className="w-full py-2.5 text-sm font-semibold text-white cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-transform mt-2">
                Sign In
              </Glass>
            </form>

            <p className="text-center text-xs text-white/30 mt-5">
              Don&apos;t have an account? <a href="#" className="text-blue-400 hover:text-blue-300">Sign up</a>
            </p>
          </Glass>
        </div>
      </div>

      <CodeBlock code={`import { Glass } from "solid-glass";

{/* Form container */}
<Glass template="frosted" blur={18} tintColor="#0f172a"
  tintOpacity={0.4} borderRadius={24} className="p-8">
  <h4 className="text-xl font-bold text-white">Welcome back</h4>

  {/* Glass input field */}
  <Glass template="thin" blur={6} tintColor="#ffffff"
    tintOpacity={0.05} borderRadius={10} className="flex items-center gap-2 px-3">
    <Mail size={16} className="text-white/30" />
    <input type="email" placeholder="you@example.com"
      className="bg-transparent text-white outline-none" />
  </Glass>

  {/* Glass submit button */}
  <Glass as="button" template="frosted" blur={10} tintColor="#3b82f6"
    tintOpacity={0.35} borderRadius={12} className="w-full py-2.5">
    Sign In
  </Glass>
</Glass>`} />
    </div>
  );
}

/* ─── Main Page ─── */
const COMPONENTS = [
  { id: "glass-card", label: "GlassCard", tier: "css" as const, Component: GlassCardDemo },
  { id: "glass-button", label: "GlassButton", tier: "css" as const, Component: GlassButtonDemo },
  { id: "glass-navbar", label: "GlassNavbar", tier: "css" as const, Component: GlassNavbarDemo },
  { id: "glass-modal", label: "GlassModal", tier: "css" as const, Component: GlassModalDemo },
  { id: "glass-tooltip", label: "GlassTooltip", tier: "css" as const, Component: GlassTooltipDemo },
  { id: "glass-toast", label: "GlassToast", tier: "css" as const, Component: GlassToastDemo },
  { id: "glass-form", label: "GlassForm", tier: "css" as const, Component: GlassFormDemo },
  { id: "loupe", label: "Loupe", tier: "svg-backdrop" as const, Component: LoupeDemo },
  { id: "liquid-glass-panel", label: "RefractionPanel", tier: "svg-backdrop" as const, Component: RefractionPanelDemo },
];

export function Components() {
  const [active, setActive] = useState("glass-card");

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-blue-200 to-violet-200 bg-clip-text text-transparent">
        Components
      </h1>
      <p className="text-slate-400 mb-4">
        Ready-to-use example components built with solid-glass. Copy into your project and customize.
      </p>
      <p className="text-sm text-slate-500 mb-12">
        Source code: <a href="https://github.com/iplanwebsites/solid-glass/tree/main/components/react" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">components/react/</a> on GitHub
      </p>

      <div className="grid lg:grid-cols-[200px_1fr] gap-10">
        {/* Sidebar */}
        <nav className="hidden lg:block sticky top-24 self-start">
          <ul className="space-y-1 border-l border-slate-800">
            {COMPONENTS.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => {
                    setActive(c.id);
                    document.getElementById(c.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`block pl-4 py-1.5 text-sm border-l-2 -ml-px transition-colors text-left w-full ${
                    active === c.id
                      ? "border-blue-400 text-white"
                      : "border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <span className="font-mono">{c.label}</span>
                  <span className={`ml-2 text-[9px] ${c.tier === "svg-backdrop" ? "text-amber-400" : "text-violet-400"}`}>
                    {c.tier === "svg-backdrop" ? "Chrome only" : "All browsers"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="min-w-0 space-y-20">
          {COMPONENTS.map((c) => (
            <section key={c.id} id={c.id} className="scroll-mt-24">
              <c.Component />
            </section>
          ))}

          {/* CTA to Playground */}
          <div className="text-center pt-8 pb-4">
            <a
              href="/playground"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-lime-500 to-yellow-500 text-slate-900 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Customize in Playground &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
