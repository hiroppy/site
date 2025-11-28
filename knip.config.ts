import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: [
    "src/pages/**/*.{astro,ts}",
    "src/content/**/*.{md,mdx}",
    "src/layouts/**/*.astro",
    "scripts/**/*.mts",
  ],
  project: ["src/**/*.{astro,ts,tsx,js,jsx,mjs,mdx}", "scripts/**/*.mts"],
  ignore: [
    "generated/**",
    // mdx uses theme files
    "src/components/blog/BlogCardItem.astro",
    "src/components/blog/Alert.astro",
    // Unlisted dependencies
    "src/content/blog/cjs-esm-reference-chart-of-behavior.mdx",
    "src/content/blog/create-module-bundler-esm.mdx",
    "src/content/blog/nodejs-esm.mdx",
    // Unlisted binaries (1)
    // test:vrt:${{ matrix.test-type }}  .github/workflows/ci.yml
    ".github/workflows/ci.yml",
  ],
  ignoreDependencies: [
    "tailwindcss",
    "@iconify-json/mdi",
    "@iconify-json/noto",
  ],
  astro: {
    config: ["astro.config.ts"],
  },
  compilers: {
    mdx: true,
  },
};

export default config;
