import { ui, defaultLang } from "./ui";

type I18n = Record<"en" | "ja", any>;

export function getLangFromUrl(url: URL): "en" | "ja" {
  const [, lang] = url.pathname.split("/");

  if (lang in ui) {
    return lang as "en" | "ja";
  }

  return defaultLang as "en";
}

export function useTranslations<T extends I18n>(url: URL, i18n: T) {
  const lang = getLangFromUrl(url);

  function t(key: keyof (typeof i18n)["en"]) {
    return i18n[lang][key] ?? i18n[defaultLang as "en"][key];
  }

  return { t };
}

export function getStaticPaths() {
  return [{ params: { locale: "ja" } }, { params: { locale: "en" } }];
}
