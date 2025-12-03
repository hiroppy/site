module.exports = {
  plugins: [
    "prettier-plugin-tailwindcss",
    "@trivago/prettier-plugin-sort-imports",
  ],
  tailwindFunctions: ["clsx", "cn"],
  importOrder: ["^[./]"],
};
