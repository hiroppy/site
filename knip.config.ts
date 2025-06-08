import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: [
    "src/pages/**/*.{astro,ts}",
    "src/content/**/*.{md,mdx}",
    "src/layouts/**/*.astro",
    "scripts/**/*.mts",
  ],
  project: ["src/**/*.{astro,ts,tsx,js,jsx,mdx}", "scripts/**/*.mts"],
  ignore: [
    "generated/**",
    // mdx uses theme files
    "src/components/BlogCardItem.astro",
    // Unlisted dependencies
    "src/content/blog/cjs-esm-reference-chart-of-behavior.mdx",
    "src/content/blog/create-module-bundler-esm.mdx",
    "src/content/blog/nodejs-esm.mdx",
    // Unlisted binaries (1)
    // test:vrt:${{ matrix.test-type }}  .github/workflows/ci.yml
    ".github/workflows/ci.yml",
  ],
  ignoreDependencies: [
    // for playwright
    "serve",
    "tailwindcss",
    "@iconify-json/mdi",
  ],
  astro: {
    config: ["astro.config.mjs"],
  },
  compilers: {
    mdx: true,
  },
};

export default config;
