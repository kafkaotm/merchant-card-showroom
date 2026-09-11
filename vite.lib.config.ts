import { defineConfig } from "vite";

// Builds the portable card library consumed by sample.html: a single
// dependency-free bundle, no app/store code included. Two output formats:
// - ES (momo-cards.js): for consumers who `<script type="module">` or
//   import it, e.g. from a real dev server.
// - IIFE (momo-cards.iife.js): for opening sample.html by plain
//   double-click. A `<script type="module">` fetching another module from
//   file:// is blocked by CORS in Chrome; a classic (non-module) <script>
//   is not, so the IIFE build is what makes true zero-server, zero-build
//   double-click-to-open actually work, not just "open via a static server".
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: "src/cards/index.ts",
      name: "MomoCards",
      fileName: (format) => (format === "iife" ? "momo-cards.iife.js" : "momo-cards.js"),
      formats: ["es", "iife"],
    },
  },
});
