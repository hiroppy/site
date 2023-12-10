import config from "../../astro.config.mjs";

const { i18n } = config;

export const defaultLang = i18n?.defaultLocale ?? "en";

export const ui = <const>{
  en: {
    "nav.home":
      "I started programming when I was a high school student using JS and C. I have been studying image processing for four years, and I also conducted research on optimization for ニコニコ動画.",
    "nav.about": "About",
    "nav.twitter": "Twitter",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.about": "À propos",
  },
};
