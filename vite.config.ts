import { defineConfig } from "vite";

// Dev server + build for the showroom app (gallery / detail / editor).
// Card library has its own build target — see vite.lib.config.ts.
export default defineConfig({
  root: ".",
  build: {
    outDir: "dist-app",
  },
});
