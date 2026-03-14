import { useState } from "react";
import { Github, BookOpen, Layers, Box, Play, Gem, FlaskConical, Menu, X, FlaskRound } from "lucide-react";
import "solid-glass/css";
import "@/styles/globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLink = (href: string, label: string, Icon: typeof Layers) => (
    <a
      href={href}
      onClick={() => setMobileMenuOpen(false)}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-slate-400 hover:text-white hover:bg-white/5"
    >
      <Icon size={16} />
      {label}
    </a>
  );

  const navItems = (
    <>
      {navLink("/gallery", "Gallery", Layers)}
      {navLink("/playground", "Playground", Play)}
      {navLink("/docs", "Docs", BookOpen)}
      {navLink("/components", "Components", Box)}
      {navLink("/kitchen", "Kitchen", FlaskConical)}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
          <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <Gem size={28} className="text-accent" />
            <div>
              <span className="font-bold text-lg tracking-tight">solid-glass</span>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded-full ml-2">v0.9</span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems}
            <a
              href="https://github.com/iplanwebsites/solid-glass"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors ml-2"
            >
              <Github size={16} />
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href="https://github.com/iplanwebsites/solid-glass"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Github size={20} />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 z-50 h-full w-64 bg-slate-900 border-l border-white/10 shadow-2xl md:hidden">
            <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
              <span className="text-sm font-semibold text-white">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col p-4 gap-1">
              {navItems}
            </nav>
          </div>
        </>
      )}

      {/* Background orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute top-[60%] left-[50%] w-72 h-72 bg-lime-300/5 rounded-full blur-3xl" />
        <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[100px]" />
      </div>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Gem size={16} className="text-accent" />
            <span>solid-glass — Glass effect toolkit for React, Vue & Vanilla JS.</span>
            <a href="https://solidglass.dev" className="text-slate-400 hover:text-white transition-colors">solidglass.dev</a>
          </div>
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
