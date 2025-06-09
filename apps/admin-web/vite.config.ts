import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const {
  PORT = "5173",
  HOST = "0.0.0.0",
  BACKEND_URL = "http://codex:3001",
} = process.env;

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(PORT),
    host: HOST,
    proxy: {
      "/api": BACKEND_URL,
    },
  },
});
