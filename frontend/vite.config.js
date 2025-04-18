import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite';
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss(),],
  preview: {
    port: 5173,
    strictPort: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    host: '0.0.0.0',
    watch: { usePolling: true },
    hmr: { host: 'localhost', protocol: 'ws', port: 5173 },
    origin: "http://0.0.0.0:5173",
    historyApiFallback: true,
  },
});