import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => {
  const connectSrc =
    command === "serve"
      ? "'self' http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*"
      : "'self'";

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "inject-csp-connect-src",
        transformIndexHtml(html) {
          return html.replace("__CSP_CONNECT_SRC__", connectSrc);
        },
      },
    ],
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:8000",
          changeOrigin: true,
        },
      },
    },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react-router-dom")
          ) {
            return "react";
          }

          return undefined;
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    globals: true,
    css: true,
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
    exclude: ["tests/e2e/**", "**/node_modules/**", "dist/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/main.jsx", "src/data/directory.js"],
    },
  },
  };
});
