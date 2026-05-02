import { cacheLife, cacheTag } from "next/cache";
import type { ArticleKind } from "../_constant";

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
  categories?: unknown;
  summary: {
    total_sources?: number;
    total_articles?: number;
    last_harvest_execution?: string;
  };
};

const BASE_API_URL = process.env.FEEDLE_API_URL;
const API_TOKEN = process.env.FEEDLE_API_TOKEN;
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

type FeedleJsonResult<T> = { ok: true; data: T } | { ok: false; error: string };

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

async function fetchFeedleJson<T>(
  url: string,
  failureMessage: string,
): Promise<FeedleJsonResult<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        "x-api-token": API_TOKEN || "",
      },
    });

    if (!response.ok) {
      return { ok: false, error: `${failureMessage}: ${response.statusText}` };
    }

    const data: T = await response.json();
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function fetchArticles(
  type: string,
  kind?: string,
  sourceId?: string,
): Promise<{ articles: Article[]; error?: string }> {
  "use cache";

  cacheLife("hours");

  const tags = ["feedle:all", `feedle:articles:${type}`];

  if (kind && kind !== "all") {
    tags.push(`feedle:articles:${type}:${kind}`);
  }
  if (sourceId) {
    tags.push(`feedle:articles:${type}:${kind || "all"}:${sourceId}`);
  }
  cacheTag(...tags);

  const params = new URLSearchParams();

  params.append("domain", type);

  if (sourceId) {
    params.append("source", sourceId);
  }

  if (kind && kind !== "all") {
    params.append("kind", kind);
  }

  const url = `${BASE_API_URL}/articles?${params}`;
  const result = await fetchFeedleJson<ArticlesResponse>(
    url,
    "Failed to fetch articles",
  );

  if (!result.ok) return { articles: [], error: result.error };

  return { articles: result.data.articles || [] };
}

export async function fetchSources(
  type: string,
): Promise<{ sources: Source[]; lastHarvested?: Date; error?: string }> {
  "use cache";

  cacheLife("hours");
  cacheTag("feedle:all", `feedle:sources:${type}`);

  const url = `${BASE_API_URL}/sources/${type}`;
  const result = await fetchFeedleJson<SourcesResponse>(
    url,
    "Failed to fetch sources",
  );

  if (!result.ok) {
    return {
      sources: [],
      error: result.error,
    };
  }

  const data = result.data;
  const lastHarvested = data.summary?.last_harvest_execution
    ? new Date(data.summary.last_harvest_execution)
    : undefined;

  return {
    sources: data.sources || [],
    lastHarvested,
  };
}

export function createServiceGroups(
  sources: Source[],
): Record<string, ServiceGroup> {
  const groups: Record<string, ServiceGroup> = {};

  sources.forEach((source) => {
    const serviceName = source.name || source.id || "Unknown";

    if (!groups[serviceName]) {
      groups[serviceName] = { sources: [], articleCount: 0 };
    }
    groups[serviceName].sources.push(source);
  });

  Object.keys(groups).forEach((serviceName) => {
    const totalArticleCount = groups[serviceName].sources.reduce(
      (total, source) => total + (source.count || 0),
      0,
    );
    groups[serviceName].articleCount = totalArticleCount;
  });

  return groups;
}

export function getServiceGroups(
  category: ArticleKind | string,
  sources: Source[],
): Record<string, ServiceGroup> {
  const sourcesByCategory = {
    all: sources,
    official: sources.filter((source) => source.kind === "official"),
    community: sources.filter((source) => source.kind === "community"),
    release: sources.filter((source) => source.kind === "release"),
    podcast: sources.filter((source) => source.kind === "podcast"),
  };
  const categorySource =
    (sourcesByCategory as Record<string, Source[]>)[category] || [];

  return createServiceGroups(categorySource);
}

/**
 * UTC日付を指定日からN日オフセットしたJST午前0時（0:00 JST）に変換し、UTC日付として返す
 * @param date - 変換する日付
 * @param daysOffset - オフセット日数（正=未来、負=過去）
 * @returns オフセット後の日のJST午前0時を表すUTC日付
 */
function getJSTDayStart(date: Date, daysOffset = 0): Date {
  const dateJST = new Date(date.getTime() + JST_OFFSET_MS);

  const dayStartJST = new Date(
    Date.UTC(
      dateJST.getUTCFullYear(),
      dateJST.getUTCMonth(),
      dateJST.getUTCDate() + daysOffset,
      0,
      0,
      0,
      0,
    ),
  );

  return new Date(dayStartJST.getTime() - JST_OFFSET_MS);
}

export function filterArticlesByPeriod(
  articles: Article[],
  period: string,
): Article[] {
  if (period === "all") {
    return articles;
  }

  const now = new Date();
  const todayStart = getJSTDayStart(now);
  const tomorrowStart = getJSTDayStart(now, 1);
  const oneMonthAgoStart = getJSTDayStart(now, -30);

  const filtered = articles.filter((article) => {
    if (!article.published_at) return false;

    const publishedDate = new Date(article.published_at);

    switch (period) {
      case "today":
        return publishedDate >= todayStart && publishedDate < tomorrowStart;
      case "month":
        return publishedDate >= oneMonthAgoStart;
      default:
        return true;
    }
  });

  return filtered;
}
