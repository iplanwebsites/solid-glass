import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    vike({ prerender: true }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/",
});
