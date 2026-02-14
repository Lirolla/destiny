import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig, type Plugin } from "vite";

// Conditionally load Manus runtime plugin — only available in Manus environment
function loadManusPlugin(): Plugin | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("vite-plugin-manus-runtime");
    return mod.vitePluginManusRuntime();
  } catch {
    // Not in Manus environment — skip
    return null;
  }
}

const manusPlugin = loadManusPlugin();
const plugins = [react(), tailwindcss(), jsxLocPlugin(), ...(manusPlugin ? [manusPlugin] : [])];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    allowedHosts: true, // Allow all hosts for development flexibility
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
