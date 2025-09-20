import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "src"),
  resolve: {
    alias: {
      pages: path.resolve(__dirname, "src/pages"),
      components: path.resolve(__dirname, "src/components"),
      lib: path.resolve(__dirname, "src/lib"),
      context: path.resolve(__dirname, "src/context"),
    },
  },
  build: {
    // Resolve two directories up from frontend/spa to reach the repository root,
    // then into src/TKDHubAPI.WebAPI/wwwroot so the build always writes into the API project.
    outDir: path.resolve(
      __dirname,
      "..",
      "..",
      "src",
      "TKDHubAPI.WebAPI",
      "wwwroot",
    ),
    // Clean the output directory before building to avoid stale assets.
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "src", "index.html"),
    },
  },
  server: {
    port: 4174, // Use a different port to avoid conflicts with preview
    proxy: {
      // forward API calls to the backend during development
      "/api": {
        target: process.env.API_HOST || "https://localhost:7046",
        changeOrigin: true,
        secure: false, // Allow self-signed certificates in development
        rewrite: (path) => path.replace(/^\/api/, "/api"),
        configure: (proxy, options) => {
          // Add additional logging for debugging
          proxy.on("error", (err, req, res) => {
            console.log("Proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log(
              "Proxying request:",
              req.method,
              req.url,
              "→",
              options.target + proxyReq.path,
            );
          });
        },
      },
    },
  },
  preview: {
    port: 4173, // Keep preview on the original port
    proxy: {
      // Same proxy configuration for preview mode
      "/api": {
        target: process.env.API_HOST || "https://localhost:7046",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
