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
    proxy: {
      // proxy to send any request to /products → http://localhost:5000/products
      '/products': {
        target: 'http://backend:5000',
        changeOrigin: true,
        secure: false,
      }
    },
    strictPort: true,
    host: '0.0.0.0',
    watch: { usePolling: true },
    hmr: { host: 'localhost', protocol: 'ws', port: 5173 },
    origin: "http://0.0.0.0:5173",
    historyApiFallback: true,
  },
});