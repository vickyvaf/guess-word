import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), TanStackRouterVite()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api/supabase": {
          target: env.VITE_SUPABASE_TARGET_URL || env.VITE_SUPABASE_URL,
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/api\/supabase/, ""),
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-error-boundary"],
            supabase: ["@supabase/supabase-js"],
            tanstack: ["@tanstack/react-query", "@tanstack/react-router"],
            xstate: ["xstate", "@xstate/react"],
            "ui-vendor": ["lucide-react"],
          },
        },
      },
    },
  };
});
