import { Outlet, NavLink } from "react-router-dom";
import { Layers, SlidersHorizontal, Github, Gem } from "lucide-react";

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
              <Gem size={18} className="text-accent" />
            </div>
            <span className="font-semibold text-lg tracking-tight">solid-glass</span>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full ml-1">v1.0</span>
          </div>

          <nav className="flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <Layers size={16} />
              Gallery
            </NavLink>
            <NavLink
              to="/playground"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <SlidersHorizontal size={16} />
              Playground
            </NavLink>
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

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-lime-300/5 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-sm text-slate-500">
        solid-glass — A comprehensive glass effect toolkit.{" "}
        <a href="https://github.com/iplanwebsites/solid-glass" className="text-slate-400 hover:text-white transition-colors">
          GitHub
        </a>
      </footer>
    </div>
  );
}
