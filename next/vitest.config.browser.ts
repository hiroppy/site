import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@site/utils": path.resolve(__dirname, "../src/utils"),
      "@site/shared": path.resolve(__dirname, "./src/shared"),
      "@next/shared": path.resolve(__dirname, "./src/shared"),
    },
  },
  test: {
    browser: {
      enabled: true,
      name: "chromium",
      provider: "playwright",
      headless: true,
    },
    globals: true,
  },
});
