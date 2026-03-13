import { Outlet, NavLink } from "react-router-dom";
import { Github, Package, BookOpen, Layers, Box } from "lucide-react";

export function Layout() {
  const navLink = (to: string, label: string, Icon: typeof Layers, end = false) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
        }`
      }
    >
      <Icon size={16} />
      {label}
    </NavLink>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
          <NavLink to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 via-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-extrabold shadow-lg shadow-violet-500/20">
              SG
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">solid-glass</span>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded-full ml-2">v1.0</span>
            </div>
          </NavLink>

          <nav className="flex items-center gap-1">
            {navLink("/", "Home", Package, true)}
            {navLink("/docs", "Docs", BookOpen)}
            {navLink("/showcase", "Showcase", Layers)}
            {navLink("/components", "Components", Box)}
            <a
              href="https://github.com/iplanwebsites/solid-glass"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors ml-2"
            >
              <Github size={16} />
            </a>
          </nav>
        </div>
      </header>

      {/* Background orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-violet-600/12 rounded-full blur-[100px]" />
        <div className="absolute top-[60%] left-[50%] w-[350px] h-[350px] bg-emerald-600/8 rounded-full blur-[100px]" />
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            solid-glass — Open source glass effect toolkit for React, Vue & Vanilla JS. <a href="https://solidglass.dev" className="text-slate-400 hover:text-white transition-colors">solidglass.dev</a>
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="https://github.com/iplanwebsites/solid-glass" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://www.npmjs.com/package/solid-glass" className="hover:text-white transition-colors">npm</a>
            <span>Apache 2.0 License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
