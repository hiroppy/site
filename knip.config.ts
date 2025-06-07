import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: [
    "src/pages/**/*.{astro,ts}",
    "src/content/**/*.{md,mdx}",
    "src/layouts/**/*.astro",
  ],
  project: ["src/**/*.{astro,ts,tsx,js,jsx,mdx}"],
  ignore: [
    "generated/**",
    // mdx uses theme files
    "src/components/BlogCardItem.astro",
    // Unlisted dependencies
    "src/content/blog/cjs-esm-reference-chart-of-behavior.mdx",
    "src/content/blog/create-module-bundler-esm.mdx",
    "src/content/blog/nodejs-esm.mdx",
  ],
  ignoreDependencies: [
    // for playwright
    "serve",
    "tailwindcss",
  ],
  astro: {
    config: ["astro.config.mjs"],
  },
  compilers: {
    mdx: true,
  },
};

export default config;
