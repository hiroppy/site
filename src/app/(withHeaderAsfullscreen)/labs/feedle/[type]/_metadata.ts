import { ARTICLE_TYPES } from "../_constant";

export const title = (kind: string) => `Feedle - ${kind}`;
export const description = "開発者向けの技術記事収集プラットフォーム";

export function getStaticParams() {
  return ARTICLE_TYPES.map((t) => ({
    type: t,
  }));
}
