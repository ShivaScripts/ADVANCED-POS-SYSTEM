import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // --- START: THE FIX ---
  define: {
    'process.env': {}
  },
  // --- END: THE FIX ---
  build: {
    outDir: "dist", // 👈 revert to default
  },
});