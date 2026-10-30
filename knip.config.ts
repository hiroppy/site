import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: [
    ".lighthouserc.cjs",
    // MDX content files (dynamically imported)
    "src/content/blog/**/*.mdx",
  ],
  // lefthook is invoked by Git hooks, not imported by application code.
  ignoreDependencies: ["@typescript/native-preview", "lefthook"],
  compilers: {
    mdx: true,
  },
};

export default config;
