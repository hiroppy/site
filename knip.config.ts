import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: [
    "generated/**",
    // Unlisted binaries (1): test:vrt:${{ matrix.type }}  .github/workflows/ci.yml
    ".github/workflows/ci.yml",
    ".lighthouserc.cjs",
    // MDX content files (dynamically imported)
    "src/content/blog/**/*.mdx",
  ],
  ignoreDependencies: [],
  compilers: {
    mdx: true,
  },
};

export default config;
