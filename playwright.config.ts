import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  webServer: {
    // docker内でsharpを動かすのは難しいのでastro previewを使わない
    command: "serve dist",
    port: 3000,
  },
};

export default config;
