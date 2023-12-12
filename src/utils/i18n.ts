// これもいいけど、結局保証できない
// import config from '../../astro.config.mjs'
// const a = config.i18n?.locales;
const langs = <const>["en", "ja"];

type Lang = (typeof langs)[number];

export type I18n = Record<Lang, any>;

export function useTranslations<T extends I18n>(
  lang: string | undefined,
  i18n: T,
) {
  if (!langs.includes(lang as Lang)) {
    throw new Error(`"${lang}" is not supported`);
  }

  const currentLang = lang as Lang;

  function t(key: keyof (typeof i18n)["en"]) {
    const text = i18n[currentLang][key];

    if (text === undefined) {
      throw new Error(`not found "${key as string}" in ${lang}`);
    }

    return i18n[currentLang][key];
  }

  return <const>{ t };
}

export function getStaticPaths() {
  return [{ params: { locale: "ja" } }, { params: { locale: "en" } }];
}
