import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  fullyParallel: true,
  webServer: {
    // docker内でsharpを動かすのは難しいのでastro previewを使わない
    command: "serve dist",
    port: 3000,
    reuseExistingServer: true,
  },
};

export default config;
