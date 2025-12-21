import type { Item } from "feed";
import {
  addItemsToFeed,
  createRssFeed,
  generateRssResponse,
  validateUrl,
} from "../../../../../../utils/rss";
import { fetchArticles, fetchSources } from "../../_utils/articlesApi";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  try {
    const { type } = await params;

    // Extract category from query parameter if provided
    const url = new URL(request.url);
    const kind = url.searchParams.get("kind") || undefined;

    // Get articles and sources
    const articlesResult = await fetchArticles(type, kind);
    const sourcesResult = await fetchSources(type);

    if (articlesResult.error || sourcesResult.error) {
      return new Response("Failed to fetch feed data", { status: 500 });
    }

    const articles = articlesResult.articles;
    const sources = sourcesResult.sources;

    // Create feed
    const feed = createRssFeed({
      title: `Feedle - ${type.charAt(0).toUpperCase() + type.slice(1)}${kind && kind !== "all" ? ` - ${kind.charAt(0).toUpperCase() + kind.slice(1)}` : ""}`,
      description: `Tech article aggregation platform for ${type}`,
      id: `https://hiroppy.me/labs/feedle/${type}${kind && kind !== "all" ? `?kind=${kind}` : ""}`,
      link: `https://hiroppy.me/labs/feedle/${type}${kind && kind !== "all" ? `/${kind}` : ""}`,
      language: "en",
      copyright: "All rights reserved",
      updated: new Date(),
    });

    // Add articles to feed
    const sourceLookup = new Map(sources.map((source) => [source.id, source]));

    const items: Item[] = articles
      .slice(0, 50)
      .map((article) => {
        try {
          const source = article.source
            ? sourceLookup.get(article.source)
            : null;

          const item: Item = {
            title: article.og_title || article.title || "Untitled",
            id: article.id,
            link: validateUrl(article.url) || "#",
            description: article.og_description || article.summary || "",
            content: article.summary || article.og_description || "",
            author: source
              ? [
                  {
                    name: source.name,
                    link: validateUrl(source.website || source.url),
                  },
                ]
              : undefined,
            date: article.published_at
              ? new Date(article.published_at)
              : new Date(article.harvested_at),
            image: validateUrl(article.og_image),
            category: article.tags?.map((tag) => ({ name: tag })),
          };

          return item;
        } catch (error) {
          console.error(
            "Error processing article for RSS feed:",
            article.id,
            error,
          );
          return null;
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    addItemsToFeed(feed, items);

    const rss = feed.rss2();

    return generateRssResponse(
      rss,
      "public, max-age=604800, stale-while-revalidate=2592000",
    );
  } catch (error) {
    console.error("RSS generation error:", error);
    return new Response("Failed to generate RSS feed", { status: 500 });
  }
}
