export type Article = {
  id: string;
  title: string;
  summary?: string;
  published_at?: string;
  url?: string;
  lang?: string;
  source?: string;
  domain?: string;
  likes_count?: number;
  hatena_bookmark_count: number;
  tags?: string[];
  harvested_at: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
};

export type Source = {
  id: string;
  name: string;
  type: string;
  url: string;
  enabled: boolean;
  kind: string;
  domain?: string;
  favicon?: string;
  website: string;
  tags: string[];
  parser?: {
    customFields?: string[];
  };
  count?: number;
  latest?: string;
  lastCompletionTime?: string;
  lastDurationMs?: number;
  lastError?: string | null;
};

export type ServiceGroup = {
  sources: Source[];
  articleCount: number;
};

type ArticlesResponse = {
  articles: Article[];
};

type SourcesResponse = {
  sources: Source[];
  categories?: any;
  summary: {
    total_sources?: number;
    total_articles?: number;
    last_harvest_execution?: string;
  };
};

const BASE_API_URL = import.meta.env.FEEDLE_API_URL;
const API_TOKEN = import.meta.env.FEEDLE_API_TOKEN;

/**
 * 記事を取得する
 * @param type 記事のタイプ (例: "frontend", "ai")
 * @param kind 記事の種類 (例: "official", "community", "release")
 * @param sourceId 特定のソースID (オプション)
 */
export async function fetchArticles(
  type: string,
  kind?: string,
  sourceId?: string,
): Promise<{ articles: Article[]; error?: string }> {
  try {
    const params = new URLSearchParams();

    params.append("domain", type);

    if (sourceId) {
      params.append("source", sourceId);
    }

    if (kind && kind !== "all") {
      params.append("kind", kind);
    }

    const url = `${BASE_API_URL}/articles?${params}`;
    const response = await fetch(url, {
      headers: {
        "x-api-token": API_TOKEN,
      },
    });

    if (!response.ok) {
      return {
        articles: [],
        error: `Failed to fetch articles: ${response.statusText}`,
      };
    }

    const data: ArticlesResponse = await response.json();

    return { articles: data.articles || [] };
  } catch (error) {
    return {
      articles: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * ソース一覧を取得する
 * @param type 記事のタイプ (例: "frontend", "ai")
 */
export async function fetchSources(
  type: string,
): Promise<{ sources: Source[]; lastHarvested?: Date; error?: string }> {
  try {
    const url = `${BASE_API_URL}/sources/${type}`;
    const response = await fetch(url, {
      headers: {
        "x-api-token": API_TOKEN,
      },
    });

    if (!response.ok) {
      return {
        sources: [],
        error: `Failed to fetch sources: ${response.statusText}`,
      };
    }

    const data: SourcesResponse = await response.json();
    const lastHarvested = data.summary?.last_harvest_execution
      ? new Date(data.summary.last_harvest_execution)
      : undefined;

    return {
      sources: data.sources || [],
      lastHarvested,
    };
  } catch (error) {
    return {
      sources: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * ソースを種類別にグループ化する
 */
function groupSourcesByCategory(sources: Source[]) {
  return {
    all: sources,
    official: sources.filter((source) => source.kind === "official"),
    community: sources.filter((source) => source.kind === "community"),
    release: sources.filter((source) => source.kind === "release"),
    podcast: sources.filter((source) => source.kind === "podcast"),
  };
}

/**
 * サービス名を取得する
 */
function getServiceName(sourceObj: Source): string {
  return sourceObj.name || sourceObj.id || "Unknown";
}

/**
 * サービスごとにソースをグループ化し、APIから取得したarticleCountを使用する
 */
export function getServiceGroups(
  category: string,
  sources: Source[],
): Record<string, ServiceGroup> {
  const sourcesByCategory = groupSourcesByCategory(sources);
  const categorySource =
    (sourcesByCategory as Record<string, Source[]>)[category] || [];
  const groups: Record<string, ServiceGroup> = {};

  categorySource.forEach((source) => {
    const serviceName = getServiceName(source);
    if (!groups[serviceName]) {
      groups[serviceName] = { sources: [], articleCount: 0 };
    }
    groups[serviceName].sources.push(source);
  });

  // APIから取得したcountを使用
  Object.keys(groups).forEach((serviceName) => {
    const totalArticleCount = groups[serviceName].sources.reduce(
      (total, source) => total + (source.count || 0),
      0,
    );
    groups[serviceName].articleCount = totalArticleCount;
  });

  return groups;
}

/**
 * 全てのソースをカテゴリ別にグループ化し、APIから取得したcountを使用する
 */
export function getAllServiceGroups(
  sources: Source[],
): Record<string, ServiceGroup> {
  const groups: Record<string, ServiceGroup> = {};

  sources.forEach((source) => {
    const serviceName = getServiceName(source);
    if (!groups[serviceName]) {
      groups[serviceName] = { sources: [], articleCount: 0 };
    }
    groups[serviceName].sources.push(source);
  });

  // APIから取得したcountを使用
  Object.keys(groups).forEach((serviceName) => {
    const totalArticleCount = groups[serviceName].sources.reduce(
      (total, source) => total + (source.count || 0),
      0,
    );
    groups[serviceName].articleCount = totalArticleCount;
  });

  return groups;
}

/**
 * 日付フィルターで記事をフィルタリングする
 */
export function filterArticlesByPeriod(
  articles: Article[],
  period: string,
): Article[] {
  if (period === "all") {
    return articles;
  }

  // 現在の日本時間を取得
  const now = new Date();
  const jstOffset = 9 * 60 * 60 * 1000; // 日本時間はUTC+9
  const nowJST = new Date(now.getTime() + jstOffset);

  // 日本時間での今日の開始時刻（0:00 JST）をUTCに変換
  const todayStartJST = new Date(
    Date.UTC(
      nowJST.getUTCFullYear(),
      nowJST.getUTCMonth(),
      nowJST.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  );
  const todayStart = new Date(todayStartJST.getTime() - jstOffset);

  // 日本時間での30日前の開始時刻（0:00 JST）をUTCに変換
  const oneMonthAgoStartJST = new Date(
    Date.UTC(
      nowJST.getUTCFullYear(),
      nowJST.getUTCMonth(),
      nowJST.getUTCDate() - 30,
      0,
      0,
      0,
      0,
    ),
  );
  const oneMonthAgoStart = new Date(oneMonthAgoStartJST.getTime() - jstOffset);

  return articles.filter((article) => {
    if (!article.published_at) return false;

    const publishedDate = new Date(article.published_at);

    switch (period) {
      case "today":
        return publishedDate >= todayStart;
      case "month":
        return publishedDate >= oneMonthAgoStart;
      default:
        return true;
    }
  });
}
