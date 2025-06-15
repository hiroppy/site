export const prerender = false;

import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { fetchArticles } from "../../../../utils/articlesApi";

function getTypeConfig(type: string, kind?: string) {
  if (kind) {
    return {
      title: `${kind.charAt(0).toUpperCase() + kind.slice(1)} Articles - Hiroppy`,
      description: `Latest ${kind} articles and resources curated by Hiroppy`,
    };
  }

  switch (type.toLowerCase()) {
    case "frontend":
      return {
        title: "Frontend Articles - Hiroppy",
        description:
          "Latest frontend development articles and resources curated by Hiroppy",
      };
    default:
      return {
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Articles - Hiroppy`,
        description: `Latest ${type} articles and resources curated by Hiroppy`,
      };
  }
}

export const GET: APIRoute = async ({ params, site, url }) => {
  const type = params.type;

  if (!type || typeof type !== "string") {
    return new Response("Type parameter is required", { status: 400 });
  }

  // URLクエリパラメータからkindを取得
  const kind = url.searchParams.get("kind");

  try {
    // 記事を取得（kindが指定されている場合はフィルタリング）
    const { articles, error } = await fetchArticles(type, kind || undefined);

    if (error) {
      return new Response(`Error fetching articles: ${error}`, { status: 500 });
    }

    // 最新の50件に制限
    const recentArticles = articles
      .sort((a, b) => {
        const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
        const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 50);

    const config = getTypeConfig(type, kind || undefined);

    // localhost の場合は localhost URL を使用
    const baseUrl =
      site ??
      (url.origin.includes("localhost") ? url.origin : "https://hiroppy.me");

    const response = await rss({
      title: config.title,
      description: config.description,
      site: baseUrl,
      customData: `<link>${baseUrl}/labs/feedle/${type}</link>`,
      items: recentArticles.map((article) => ({
        title: article.title || "Untitled",
        pubDate: article.published_at
          ? new Date(article.published_at)
          : new Date(),
        description:
          article.summary ||
          article.og_description ||
          "No description available",
        link: article.url || `${baseUrl}/labs/feedle/${article.id}`,
        categories: article.tags,
        author: article.source || "Unknown",
      })),
    });

    // Set stale-while-revalidate cache headers (1 hour = 3600 seconds)
    response.headers.set(
      "Cache-Control",
      "public, max-age=0, s-maxage=3600, stale-while-revalidate=3600",
    );

    return response;
  } catch (err) {
    console.error("RSS generation error:", err);
    return new Response("Internal server error", { status: 500 });
  }
};
