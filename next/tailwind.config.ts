import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./src/**/*.{ts,tsx,mdx}",
    "../src/**/*.{astro,md,mdx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
};

export default config;
