import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    hmr: {
      clientPort: 443,
    },
    allowedHosts: [".ngrok-free.app"],
    // Adicione esta seção de proxy
    proxy: {
      // Redireciona requisições que começam com /api, /auth para o backend
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/auth": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/sellers": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/admin": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/products": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/home": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/users": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
