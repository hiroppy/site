import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  webServer: {
    command: "pnpm start",
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
    },
  },
  use: {
    actionTimeout: 60000,
    navigationTimeout: 120000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    viewport: {
      width: 1280,
      height: 720,
    },
  },
  projects: [
    {
      name: "chrome-a11y",
      testMatch: "tests/a11y.test.ts",
      use: {
        ...devices["Desktop Chrome"],
        colorScheme: "light",
      },
    },
    {
      name: "android-a11y",
      testMatch: "tests/a11y.test.ts",
      use: {
        ...devices["Pixel 7"],
        colorScheme: "light",
      },
    },
    {
      name: "chrome-routes",
      testMatch: "tests/routes.test.ts",
      use: {
        ...devices["Desktop Chrome"],
        actionTimeout: 30000,
        navigationTimeout: 60000,
      },
    },
    {
      name: "chrome-vrt-pages",
      testMatch: ["tests/vrt-pages.test.ts", "tests/metadata-pages.test.ts"],
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "android-vrt-pages",
      testMatch: "tests/vrt-pages.test.ts",
      use: {
        ...devices["Pixel 7"],
      },
    },
    {
      name: "chrome-vrt-components",
      testMatch: "tests/vrt-components.test.ts",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
