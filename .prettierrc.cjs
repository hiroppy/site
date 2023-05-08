module.exports = {
  // https://github.com/withastro/prettier-plugin-astro/blob/main/README.md#pnpm-support-1
  plugins: [require.resolve("prettier-plugin-astro")],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
