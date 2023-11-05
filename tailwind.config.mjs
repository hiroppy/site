import Color from "color";

const darken = (clr, val) => Color(clr).darken(val).hex();

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,md,mdx}"],
  theme: {
    fontFamily: {
      body: [
        "system-ui",
        "Arial",
        "Helvetica",
        "'Hiragino Sans'",
        "'Hiragino Kaku Gothic ProN'",
        "'Meiryo,sans-serif'",
        "sans-serif",
      ],
    },
    listStyleType: {
      none: "none",
      hyphen: "'-  '",
    },
    extend: {
      colors: {
        main: {
          DEFAULT: "#3498db",
          dark: darken("#3498db", 0.7),
        },
        javascript: {
          DEFAULT: "#f1e05a",
          dark: darken("#f1e05a", 0.7),
        },
        typescript: "#3178c6",
        css: "#563d7c",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "focus-in": "text-focus-in 0.5s linear both",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        "focus-in": {
          "0%": {
            filter: "blur(12px)",
            opacity: "0",
          },
          to: {
            filter: "blur(0)",
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [],
};
