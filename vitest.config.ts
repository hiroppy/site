import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
// import { playwright } from "@vitest/browser-playwright";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    projects: [
      {
        test: {
          name: "unit",
          include: ["src/**/*.test.ts"],
          exclude: ["src/**/*.test.browser.ts", "src/**/*.test.browser.tsx"],
          environment: "node",
        },
      },
      // {
      //   test: {
      //     name: "browser",
      //     include: ["src/**/*.test.browser.ts", "src/**/*.test.browser.tsx"],
      //     css: true,
      //     setupFiles: "./vitest.browser.setup.ts",
      //     browser: {
      //       enabled: true,
      //       // @ts-expect-error mismatch
      //       provider: playwright(),
      //       instances: [
      //         {
      //           browser: "chromium",
      //           viewport: {
      //             width: 1280,
      //             height: 720,
      //           },
      //         },
      //       ],
      //       headless: true,
      //       screenshotFailures: false,
      //     },
      //   },
      // },
    ],
  },
});
