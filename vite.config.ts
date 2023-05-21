import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { r3f } from "@react-three/editor/vite";

// https://vitejs.dev/config/
export default defineConfig((env) => ({
  // Use this line to enable editor
  //plugins: [env.command === "build" ? react() : r3f()],
  plugins: [react()],
}));
