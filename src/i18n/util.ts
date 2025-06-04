import { ui, defaultLang } from "./ui";

export function useTranslations(lang: keyof typeof ui = "ja") {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}
