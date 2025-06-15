import { devices, type PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./tests",
  fullyParallel: true,
  webServer: {
    // docker内でsharpを動かすのは難しいのでastro previewを使わない
    command: "pnpm preview --port 3000",
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  expect: {
    toHaveScreenshot: {
      // Make screenshot comparison less sensitive to font rendering differences
      maxDiffPixelRatio: 0.05,
      threshold: 0.2,
      animations: "disabled",
    },
  },
  use: {
    // Global settings for better stability
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
      name: "chrome-a11y-light",
      testMatch: "tests/a11y.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        colorScheme: "light",
      },
    },
    {
      name: "chrome-a11y-dark",
      testMatch: "tests/a11y.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        colorScheme: "dark",
      },
    },
    {
      name: "android-a11y-light",
      testMatch: "tests/a11y.spec.ts",
      use: {
        ...devices["Pixel 7"],
        colorScheme: "light",
      },
    },
    {
      name: "android-a11y-dark",
      testMatch: "tests/a11y.spec.ts",
      use: {
        ...devices["Pixel 7"],
        colorScheme: "dark",
      },
    },
    {
      name: "chrome-vrt-pages",
      testMatch: "tests/vrt-pages.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "android-vrt-pages",
      testMatch: "tests/vrt-pages.spec.ts",
      use: {
        ...devices["Pixel 7"],
      },
    },
    {
      name: "chrome-vrt-components",
      testMatch: "tests/vrt-components.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
};

export default config;
