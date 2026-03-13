/** @type {import('tailwindcss').Config} */
export default {
  content: ["./pages/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  safelist: ["bg-slate-950", "text-white", "antialiased"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          light: "rgb(var(--accent-light) / <alpha-value>)",
          dark: "rgb(var(--accent-dark) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};
