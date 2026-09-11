import { defineConfig } from "vite";

// Builds the portable card library consumed by sample.html:
// a single dependency-free ESM bundle, no app/store code included.
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: "src/cards/index.ts",
      name: "MomoCards",
      fileName: () => "momo-cards.js",
      formats: ["es"],
    },
  },
});
