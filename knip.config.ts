import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/pages/**/*.{astro,ts}"],
  project: ["src/**/*.{astro,ts,tsx,js,jsx,mdx}"],
  ignore: [
    "tests/**",
    "scripts/**",
    "generated/**",
    // MDX files with external imports
    "src/content/blog/cjs-esm-reference-chart-of-behavior.mdx",
    "src/content/blog/create-module-bundler-esm.mdx",
    "src/content/blog/nodejs-esm.mdx",
    // Unused files kept for future use
    "src/components/BlogCardItem.astro",
    "src/components/Code.astro",
    "src/components/ShareButtons.astro",
    "src/components/SnsIcon.astro",
    "src/layouts/BlogLayout.astro",
    "src/layouts/ResumeLayout.astro",
    "src/utils/ogp.ts",
    "src/constants.ts",
  ],
  ignoreDependencies: [
    // OGP generation
    "satori",
    "sharp",
    // Tailwind config
    "color",
  ],
  astro: {
    config: ["astro.config.mjs"],
  },
};

export default config;
