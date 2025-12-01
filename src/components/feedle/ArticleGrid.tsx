import { useEffect, useMemo, useState } from "preact/hooks";
import { Card } from "../Card";
import { CardContent } from "../CardContent";
import { CardTitle } from "../CardTitle";
import { CardDescription } from "../CardDescription";
import { CardImage } from "../CardImage";
import type { Article, Source } from "../../utils/feedle/articlesApi";
import {
  ARTICLE_PREVIEW_EVENT,
  readIgnoredSourceIds,
  SUBSCRIPTION_CHANGED_EVENT,
} from "../../utils/feedle/subscriptionStore";

type Props = {
  articles: Article[];
  sources: Source[];
  currentService?: string;
};

type ArticlePreviewPayload = {
  title: string;
  summary?: string;
  description?: string;
  url?: string;
  image?: string;
  sourceName: string;
  published?: string;
  tags?: string[];
};

function isRecentArticle(publishedAt?: string): boolean {
  if (!publishedAt) return false;
  const publishedDate = new Date(publishedAt);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return publishedDate >= oneMonthAgo;
}

function getDisplayDescription(article: Article, sourceKind?: string) {
  if (sourceKind === "release") {
    return article.summary || article.og_description || "";
  }
  return article.og_description || article.summary || "";
}

export function ArticleGrid({ articles, sources, currentService }: Props) {
  const [ignoredSources, setIgnoredSources] = useState<Set<string>>(new Set());

  useEffect(() => {
    let active = true;

    const updateSubscriptions = async () => {
      const ids = await readIgnoredSourceIds();
      if (!active) return;
      setIgnoredSources(ids);
    };

    updateSubscriptions();

    const handleSubscriptionChange = () => {
      updateSubscriptions();
    };

    if (typeof window !== "undefined") {
      window.addEventListener(
        SUBSCRIPTION_CHANGED_EVENT,
        handleSubscriptionChange,
      );
    }

    return () => {
      active = false;
      if (typeof window !== "undefined") {
        window.removeEventListener(
          SUBSCRIPTION_CHANGED_EVENT,
          handleSubscriptionChange,
        );
      }
    };
  }, []);

  const sourceLookup = useMemo(() => {
    const map = new Map<string, Source>();
    sources.forEach((source) => {
      map.set(source.id, source);
      if (source.name) {
        map.set(source.name, source);
      }
    });
    return map;
  }, [sources]);

  const visibleArticles = useMemo(() => {
    if (currentService) {
      return articles;
    }

    return articles.filter((article) => {
      const sourceId = article.source;
      return !sourceId || !ignoredSources.has(sourceId);
    });
  }, [articles, currentService, ignoredSources]);

  const activateArticle = (article: Article) => {
    const summaryCandidate = article.summary?.trim();
    const hasSummary =
      !!summaryCandidate &&
      summaryCandidate !== "null" &&
      summaryCandidate !== "undefined";

    if (!hasSummary) {
      if (article.url && typeof window !== "undefined") {
        window.open(article.url, "_blank", "noopener,noreferrer");
      }
      return;
    }

    if (typeof window === "undefined") return;

    const sourceName = article.source
      ? sourceLookup.get(article.source)?.name || article.source
      : "Unknown";

    const preview: ArticlePreviewPayload = {
      title: article.title || "Untitled",
      summary: summaryCandidate || undefined,
      description: getDisplayDescription(
        article,
        sourceLookup.get(article.source || "")?.kind,
      ),
      url: article.url,
      image: article.og_image,
      sourceName,
      published: article.published_at,
      tags: article.tags,
    };

    window.dispatchEvent(
      new CustomEvent(ARTICLE_PREVIEW_EVENT, { detail: preview }),
    );
  };

  const getSourceName = (sourceId?: string) => {
    if (!sourceId) return "Unknown";
    const source = sourceLookup.get(sourceId);
    return source ? source.name || source.id || "Unknown" : sourceId;
  };

  return (
    <div
      id="articles-grid"
      class="grid grid-cols-1 gap-4 pb-24 [contain:layout_style] sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
    >
      {visibleArticles.map((article) => {
        const source = article.source
          ? sourceLookup.get(article.source)
          : undefined;
        const description = getDisplayDescription(article, source?.kind);

        return (
          <div
            class="article-card cursor-pointer [contain:layout_style]"
            onClick={() => activateArticle(article)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                activateArticle(article);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <Card variant="interactive" className="flex h-full flex-col">
              <CardImage
                src={article.og_image}
                alt={article.title || "Article image"}
              />

              <CardContent className="flex flex-grow flex-col">
                <CardTitle level={3} className="mb-2 text-base leading-tight">
                  {article.title || "Untitled"}
                </CardTitle>

                {description && (
                  <CardDescription className="mb-2 line-clamp-3">
                    {description}
                  </CardDescription>
                )}

                <div class="mt-auto">
                  <div class="mb-2 flex items-center justify-between text-sm text-gray-500">
                    <span class="max-w-32 truncate rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
                      {getSourceName(article.source)}
                    </span>
                    {article.published_at && (
                      <time
                        class={
                          isRecentArticle(article.published_at)
                            ? "font-medium text-green-700"
                            : ""
                        }
                      >
                        {new Date(article.published_at)
                          .toLocaleDateString("ja-JP", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })
                          .replace(/\//g, "/")}
                      </time>
                    )}
                  </div>

                  {article.tags && article.tags.length > 0 && (
                    <div class="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span class="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
