import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxyTarget = env.API_PROXY_TARGET;
  const apiProxySecure = env.API_PROXY_SECURE === "true";

  if (!apiProxyTarget) {
    throw new Error("Missing API_PROXY_TARGET. Set it in your local .env file.");
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/b1s": {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: apiProxySecure,
        },
      },
    },
  };
});
