import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  webServer: {
    command: "npm run preview",
    url: "http://localhost:3000",
  },
};

export default config;
