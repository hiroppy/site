import { ARTICLE_TYPE_CONFIGS } from "../../_constant";

export function getStaticParams() {
  const params = [];

  for (const type of ARTICLE_TYPE_CONFIGS.filter((t) => t.enabled)) {
    for (const cat of type.categories.filter((c) => c.enabled)) {
      params.push({ type: type.id, category: cat.id });
    }
  }

  return params;
}
