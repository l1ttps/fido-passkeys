import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: "**/*.tsx",
    }),
  ],
  build: {
    outDir: "../public",
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
});
