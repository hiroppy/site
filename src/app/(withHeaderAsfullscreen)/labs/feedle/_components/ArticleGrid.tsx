// TODO: refactor

"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardImage,
  CardTitle,
} from "../../../../../components/Card";
import type { Article, Source } from "../_utils/articlesApi";
import {
  ArticlePreviewDialog,
  type ArticlePreviewPayload,
} from "./ArticlePreviewDialog";

const ARTICLE_PREVIEW_EVENT = "feedle:article-preview";

type Props = {
  articles: Article[];
  sources: Source[];
  currentService?: string;
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

export const ArticleGrid = ({ articles, sources, currentService }: Props) => {
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
    return articles;
  }, [articles]);

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
    <>
      <div
        id="articles-grid"
        className="grid grid-cols-1 gap-4 pb-24 contain-[layout_style] sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      >
        {visibleArticles.map((article) => {
          const source = article.source
            ? sourceLookup.get(article.source)
            : undefined;
          const description = getDisplayDescription(article, source?.kind);

          return (
            <div
              key={article.id}
              className="article-card cursor-pointer contain-[layout_style]"
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
                  src={article.og_image || ""}
                  alt={article.title || "Article image"}
                  unoptimized
                />

                <CardContent className="flex grow flex-col">
                  <CardTitle level={3} className="mb-2 text-base leading-tight">
                    {article.title || "Untitled"}
                  </CardTitle>

                  {description && (
                    <CardDescription className="mb-2 line-clamp-3">
                      {description}
                    </CardDescription>
                  )}

                  <div className="mt-auto">
                    <div className="mb-2 flex items-center justify-between text-sm text-gray-500 gap-2">
                      <span className="max-w-30 truncate rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
                        {getSourceName(article.source)}
                      </span>
                      {article.published_at && (
                        <time
                          className={
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
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700"
                          >
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
      <ArticlePreviewDialog />
    </>
  );
};
