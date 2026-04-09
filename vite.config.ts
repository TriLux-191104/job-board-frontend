// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path"; // Nếu chưa có hãy cài: npm install -D @types/node

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // THÊM ĐOẠN NÀY ĐỂ FIX LỖI "Invalid hook call"
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
