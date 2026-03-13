import { defineConfig } from "tsup";
import { copyFileSync } from "fs";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "react/index": "src/react/index.ts",
    "vue/index": "src/vue/index.ts",
    "vanilla/index": "src/vanilla/index.ts",
    "effects/index": "src/effects/index.ts",
    "engines/svg-refraction": "src/engines/svg-refraction/index.ts",
    presets: "src/presets.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom", "vue"],
  sourcemap: true,
  onSuccess: async () => {
    copyFileSync("src/solid-glass.css", "dist/solid-glass.css");
  },
});
