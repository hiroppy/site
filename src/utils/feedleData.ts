import {
  fetchArticles,
  getServiceGroups,
  getAllServiceGroups,
  filterArticlesByPeriod,
  type Article,
  type Source,
  type ServiceGroup,
} from "./articlesApi";
import { getCachedSources } from "./sourcesCache";
import { validateArticlePath } from "./articlesConfig";
import type { ArticleType } from "./feedleConfig";

type FeedleData = {
  currentType: ArticleType;
  currentCategory: string;
  currentService?: string;
  currentPeriod: string;
  articles: Article[];
  allArticles: Article[];
  sources: Source[];
  serviceGroups: Record<string, ServiceGroup>;
  lastHarvested?: Date;
  error?: string;
};

export async function getFeedleData(
  pathSegments: string[],
  currentPeriod: string,
): Promise<FeedleData> {
  // パスの検証
  const validation = validateArticlePath(pathSegments);
  if (!validation.isValid) {
    throw new Error("Invalid path");
  }

  const currentType = validation.type! as ArticleType;
  const currentCategory = validation.category!;
  const currentService = validation.service;

  // データの取得
  let articles: Article[] = [];
  let allArticles: Article[] = [];
  let sources: Source[] = [];
  let error: string | null = null;
  let lastHarvested: Date | undefined = undefined;

  try {
    const [articlesResult, sourcesResult] = await Promise.all([
      fetchArticles(currentType),
      getCachedSources(currentType),
    ]);

    if (articlesResult.error) {
      error = articlesResult.error;
    } else {
      allArticles = articlesResult.articles;
      articles = articlesResult.articles;
    }

    if (sourcesResult.error && !error) {
      error = sourcesResult.error;
    } else {
      sources = sourcesResult.sources;
      lastHarvested = sourcesResult.lastHarvested;
    }

    // 特定のkind/sourceの記事を再取得
    if ((currentCategory !== "all" || currentService) && !error) {
      const specificArticlesResult = await fetchArticles(
        currentType,
        currentCategory === "all" ? undefined : currentCategory,
        currentService,
      );

      if (specificArticlesResult.error) {
        error = specificArticlesResult.error;
      } else {
        articles = specificArticlesResult.articles;
      }
    }

    // 日付フィルタリングを適用
    if (!error) {
      articles = filterArticlesByPeriod(articles, currentPeriod);
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  // サービスグループの生成
  const serviceGroups: Record<string, ServiceGroup> =
    currentCategory !== "all"
      ? getServiceGroups(currentCategory, sources)
      : getAllServiceGroups(sources);

  return {
    currentType,
    currentCategory,
    currentService,
    currentPeriod,
    articles,
    allArticles,
    sources,
    serviceGroups,
    lastHarvested,
    error: error || undefined,
  };
}
