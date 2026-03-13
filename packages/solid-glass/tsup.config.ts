import { defineConfig } from "tsup";
import { copyFileSync } from "fs";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "effects/index": "src/effects/index.ts",
    presets: "src/presets.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom"],
  sourcemap: true,
  onSuccess: async () => {
    copyFileSync("src/solid-glass.css", "dist/solid-glass.css");
  },
});
