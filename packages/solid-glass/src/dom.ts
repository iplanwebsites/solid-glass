/**
 * Shared DOM utilities for SVG filter injection and CSS auto-loading.
 */

/**
 * Inject an SVG filter string into the document body.
 * Returns a cleanup function that removes it.
 */
export function injectSvgFilter(svgMarkup: string): () => void {
  const container = document.createElement("div");
  container.innerHTML = svgMarkup;
  const svg = container.firstElementChild;
  if (svg) {
    document.body.appendChild(svg);
    return () => svg.remove();
  }
  return () => {};
}

/**
 * Auto-inject the solid-glass CSS if not already present.
 * Called once on first component mount. Uses a <style> tag with an id
 * so it's only injected once and can be detected.
 */
let cssInjected = false;

export function ensureStyles(): void {
  if (cssInjected) return;
  if (typeof document === "undefined") return;

  // Check if CSS is already loaded (via import "solid-glass/css" or a <link>)
  const existing = document.querySelector("[data-solid-glass-css]");
  if (existing) {
    cssInjected = true;
    return;
  }

  // Check if .sg- rules are already defined (user imported the CSS file)
  try {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule instanceof CSSStyleRule && rule.selectorText?.includes("sg-")) {
            cssInjected = true;
            return;
          }
        }
      } catch {
        // CORS: can't read cross-origin stylesheets — skip
      }
    }
  } catch {
    // Stylesheet access not available
  }

  // Inject the CSS inline
  const style = document.createElement("style");
  style.setAttribute("data-solid-glass-css", "auto");
  style.textContent = INLINE_CSS;
  document.head.appendChild(style);
  cssInjected = true;
}

// Minified critical CSS — auto-injected if no stylesheet is detected.
// This is a fallback; importing "solid-glass/css" is still recommended for SSR.
const INLINE_CSS = `[class*="sg-"]{position:relative;isolation:isolate;border-radius:var(--sg-radius,16px);opacity:var(--sg-opacity,1)}[class*="sg-"]::before,[class*="sg-"]::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none}[class*="sg-"]>*{position:relative;z-index:2}[class*="sg-"]::before{animation-play-state:var(--sg-animation-state,running);animation-timing-function:var(--sg-animation-easing,ease)}.sg-frosted::before{z-index:1;box-shadow:inset 0 0 var(--sg-shadow-blur,6px) var(--sg-shadow-spread,0px) var(--sg-shadow-color,rgba(255,255,255,0.6));background:rgba(var(--sg-tint-rgb,255,255,255),var(--sg-tint-opacity,0.08));border:var(--sg-border-width,1px) solid var(--sg-border-color,rgba(255,255,255,0.2))}.sg-frosted::after{z-index:-1;-webkit-backdrop-filter:blur(var(--sg-blur,12px));backdrop-filter:blur(var(--sg-blur,12px))}.sg-crystal::before{z-index:1;background:rgba(var(--sg-tint-rgb,255,255,255),var(--sg-tint-opacity,0.05));box-shadow:inset 0 1px 2px rgba(255,255,255,0.3),inset 0 -1px 2px rgba(0,0,0,0.05);border:1px solid rgba(255,255,255,0.15)}.sg-crystal::after{z-index:-1;-webkit-backdrop-filter:blur(var(--sg-blur,8px));backdrop-filter:blur(var(--sg-blur,8px));filter:var(--sg-filter-id);-webkit-filter:var(--sg-filter-id)}.sg-aurora::before{z-index:1;background:var(--sg-aurora-gradient);background-size:200% 200%;opacity:var(--sg-aurora-opacity,0.15);animation:sg-aurora-shift var(--sg-aurora-speed,8s) var(--sg-animation-easing,ease) infinite;animation-play-state:var(--sg-animation-state,running)}.sg-aurora::after{z-index:-1;-webkit-backdrop-filter:blur(var(--sg-blur,16px));backdrop-filter:blur(var(--sg-blur,16px))}@keyframes sg-aurora-shift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}.sg-smoke::before{z-index:1;background:rgba(var(--sg-smoke-rgb,0,0,0),var(--sg-smoke-density,0.3))}.sg-smoke::after{z-index:-1;-webkit-backdrop-filter:blur(var(--sg-blur,20px));backdrop-filter:blur(var(--sg-blur,20px));filter:var(--sg-filter-id);-webkit-filter:var(--sg-filter-id)}.sg-prism::before{z-index:1;background:linear-gradient(135deg,rgba(255,0,0,0.04),rgba(0,255,0,0.04),rgba(0,0,255,0.04));border:1px solid rgba(255,255,255,0.15)}.sg-prism::after{z-index:-1;-webkit-backdrop-filter:blur(var(--sg-blur,6px)) hue-rotate(var(--sg-prism-hue,0deg)) saturate(var(--sg-prism-saturate,1.2)) brightness(var(--sg-prism-brightness,1.05)) contrast(var(--sg-prism-contrast,1.1));backdrop-filter:blur(var(--sg-blur,6px)) hue-rotate(var(--sg-prism-hue,0deg)) saturate(var(--sg-prism-saturate,1.2)) brightness(var(--sg-prism-brightness,1.05)) contrast(var(--sg-prism-contrast,1.1))}.sg-holographic::before{z-index:1;background:var(--sg-holo-gradient);background-size:300% 300%;opacity:var(--sg-holo-iridescence,0.4);animation:sg-holo-shift var(--sg-holo-speed,6s) var(--sg-animation-easing,ease) infinite;animation-play-state:var(--sg-animation-state,running);mix-blend-mode:overlay}.sg-holographic::after{z-index:-1;-webkit-backdrop-filter:blur(var(--sg-blur,10px));backdrop-filter:blur(var(--sg-blur,10px))}@keyframes sg-holo-shift{0%,100%{background-position:0% 50%}25%{background-position:100% 0%}50%{background-position:100% 100%}75%{background-position:0% 100%}}.sg-thin::before{z-index:1;background:rgba(var(--sg-thin-bg-rgb,255,255,255),var(--sg-thin-bg-opacity,0.02));border:1px solid rgba(var(--sg-thin-bg-rgb,255,255,255),var(--sg-thin-border-opacity,0.1))}.sg-thin::after{z-index:-1;-webkit-backdrop-filter:blur(var(--sg-blur,4px));backdrop-filter:blur(var(--sg-blur,4px))}.sg-refraction::before{z-index:1;box-shadow:rgba(0,0,0,0.16) 0px 4px 9px,rgba(0,0,0,0.2) 0px 2px 24px inset,rgba(255,255,255,0.2) 0px -2px 24px inset;border:1px solid rgba(255,255,255,0.1)}.sg-refraction::after{z-index:-1;-webkit-backdrop-filter:var(--sg-refraction-filter);backdrop-filter:var(--sg-refraction-filter)}.sg-refraction--needs-measure::after{-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}`;
