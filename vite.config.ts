import MillionLint from "@million/lint";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const host = process.env.TAURI_DEV_HOST;
const isTauri = process.env.TAURI_ENV_ARCH !== undefined;

// https://vite.dev/config/
export default defineConfig({
  clearScreen: isTauri ? false : true,
  plugins: [
    MillionLint.vite({
      enabled: false,
    }),
    react(),
    TanStackRouterVite(),
    tsconfigPaths(),
    tailwindcss(),
  ],
  envPrefix: ["VITE_", "TAURI_ENV_*"],
  server: {
    // Tauri expects a fixed port, fail if that port is not available
    strictPort: true,
    // if the host Tauri is expecting is set, use it
    host: host || false,
    port: 5173,
  },
  build: {
    sourcemap: true,
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target:
      process.env.TAURI_ENV_PLATFORM == "windows" ? "chrome105" : "safari13",
    // don't minify for debug builds
    minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,
    rollupOptions: {
      output: {
        manualChunks: {
          pdf: ["pdfjs-dist"],
          react: [
            "react",
            "react-dom",
            "react-dom/client",
            "react/jsx-runtime",
          ],
          motion: ["motion"],
        },
      },
    },
  },
});
