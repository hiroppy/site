import { Feed, type FeedOptions, type Item } from "feed";

export function createRssFeed(options: FeedOptions) {
  return new Feed(options);
}

export function generateRssResponse(rssXml: string, cacheControl?: string) {
  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        cacheControl || "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}

export function addItemsToFeed(feed: Feed, items: Item[]) {
  items.forEach((item) => feed.addItem(item));
}
