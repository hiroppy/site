const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,md,mdx}"],
  theme: {
    fontFamily: {
      body: [
        "Avenir",
        "Helvetica",
        "Arial",
        "Hiragino Sans",
        "Meiryo,sans-serif",
      ],
    },
    listStyleType: {
      none: "none",
      hyphen: "'-  '",
    },
    extend: {
      colors: {
        main: "#3498db",
        javascript: "#f1e05a",
        typescript: "#3178c6",
        css: "#563d7c",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
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
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        html: { fontSize: "17px" },
      });
    }),
  ],
};
