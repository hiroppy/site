import { ARTICLE_TYPE_CONFIGS, type ArticleType } from "../_constant";
import {
  type Article,
  type Source,
  type ServiceGroup,
  fetchArticles,
  fetchSources,
  filterArticlesByPeriod,
  getServiceGroups,
  createServiceGroups,
} from "./articlesApi";

export async function getSidebarData(pathSegments: string[]) {
  const validation = validateArticlePath(pathSegments);
  if (!validation.isValid) {
    throw new Error("Invalid path");
  }

  const currentType = validation.type! as ArticleType;
  const currentCategory = validation.category!;
  const currentService = validation.service;

  const sourcesResult = await fetchSources(currentType);
  const serviceGroups = createServiceGroups(sourcesResult.sources);

  return {
    currentType,
    currentCategory,
    currentService,
    serviceGroups,
    lastHarvested: sourcesResult.lastHarvested,
    error: sourcesResult.error,
  };
}

export async function getContentData(
  pathSegments: string[],
  currentPeriod: string,
) {
  const validation = validateArticlePath(pathSegments);
  if (!validation.isValid) {
    throw new Error("Invalid path");
  }

  const currentType = validation.type! as ArticleType;
  const currentCategory = validation.category!;
  const currentService = validation.service;

  let articles: Article[] = [];
  let sources: Source[] = [];
  let error: string | null = null;
  let serviceGroups: Record<string, ServiceGroup> = {};
  let lastHarvested: Date | undefined;

  try {
    const [articlesResult, sourcesResult] = await Promise.all([
      fetchArticles(currentType, pathSegments[1], pathSegments[2]),
      fetchSources(currentType),
    ]);

    if (articlesResult.error) {
      error = articlesResult.error;
    } else {
      articles = filterArticlesByPeriod(articlesResult.articles, currentPeriod);
    }

    if (sourcesResult.error && !error) {
      error = sourcesResult.error;
    } else {
      sources = sourcesResult.sources;
      lastHarvested = sourcesResult.lastHarvested;
      serviceGroups =
        currentCategory !== "all"
          ? getServiceGroups(currentCategory, sources)
          : createServiceGroups(sources);
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  return {
    currentType,
    currentCategory,
    currentService,
    currentPeriod,
    articles,
    sources,
    error: error || undefined,
    serviceGroups,
    lastHarvested,
  };
}

function validateArticlePath(path: string[]): {
  isValid: boolean;
  type?: string;
  category?: string;
  service?: string;
  error?: string;
} {
  if (path.length === 0) {
    return { isValid: false, error: "Path is empty" };
  }

  const [type, category, service] = path;
  const typeConfig = ARTICLE_TYPE_CONFIGS.find(
    (typeConfig) => typeConfig.id === type,
  );

  if (!typeConfig) {
    return { isValid: false, error: `Unknown article type: ${type}` };
  }

  if (!typeConfig.enabled) {
    return { isValid: false, error: `Article type is disabled: ${type}` };
  }

  // カテゴリの検証（指定されている場合）
  if (category && category !== "all") {
    const categories = typeConfig
      ? typeConfig.categories.filter((cat) => cat.enabled)
      : [];
    const categoryExists = categories.some((cat) => cat.id === category);
    if (!categoryExists) {
      return {
        isValid: false,
        error: `Unknown category: ${category} for type: ${type}`,
      };
    }
  }

  return {
    isValid: true,
    type,
    category: category || "all",
    service,
  };
}
