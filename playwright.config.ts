import { devices, type PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
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
    },
  },
  projects: [
    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "android",
      use: {
        ...devices["Pixel 7"],
      },
    },
  ],
};

export default config;
