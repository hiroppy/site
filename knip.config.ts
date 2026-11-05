import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: [
    ".lighthouserc.cjs",
    // MDX content files (dynamically imported)
    "src/content/blog/**/*.mdx",
  ],
  ignoreDependencies: ["@typescript/native-preview", "lefthook"],
  compilers: {
    mdx: true,
  },
};

export default config;
