import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  optimizeDeps: {
    include: ["react-quill"],
  },
  define: {
    global: 'globalThis', // Polyfill `global` with `globalThis`
  },
  plugins: [react()],
  build: {
    outDir: "backend/public", // Ensure output directory is within backend/public
    emptyOutDir: true, // Clear the output folder before building
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"), // Entry HTML file for the React app
      },
    },
  },
  server: {
    port: 3000, // Set the port for the development server
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Backend server address
        changeOrigin: true,
        secure: false,
      },
    },
    headers: {
      "Content-Security-Policy": `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        connect-src 'self' https://api.stripe.com http://localhost:*;
        frame-src 'self' https://js.stripe.com;
      `.replace(/\s+/g, ' ').trim()
    }
  },
});
