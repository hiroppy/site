import { devices, type PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./tests",
  fullyParallel: true,
  webServer: {
    // docker内でsharpを動かすのは難しいのでastro previewを使わない
    command: "serve dist",
    port: 3000,
    reuseExistingServer: true,
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
      name: "chrome-a11y",
      testMatch: "tests/a11y.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "android-a11y",
      testMatch: "tests/a11y.spec.ts",
      use: {
        ...devices["Pixel 7"],
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
    {
      name: "android-vrt-components",
      testMatch: "tests/vrt-components.spec.ts",
      use: {
        ...devices["Pixel 7"],
      },
    },
  ],
};

export default config;
