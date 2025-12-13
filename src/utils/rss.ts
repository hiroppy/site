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

/**
 * Sanitizes URLs for XML by escaping & characters
 * Required because feed library doesn't sanitize URLs in enclosure attributes (feed.js:424)
 *
 * @param url - URL to sanitize
 * @returns Sanitized URL or undefined if input is invalid
 */
function sanitizeXmlUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  if (typeof url !== "string") return undefined;

  // Replace & with &amp; for XML safety
  return url.replace(/&/g, "&amp;");
}

/**
 * Validates that a URL is well-formed and sanitizes it for XML
 * Returns undefined if invalid to prevent feed breakage
 *
 * @param url - URL to validate and sanitize
 * @returns Sanitized URL or undefined if invalid
 */
export function validateUrl(
  url: string | undefined | null,
): string | undefined {
  if (!url) return undefined;

  try {
    new URL(url);
    return sanitizeXmlUrl(url);
  } catch {
    // Invalid URL - return undefined to skip
    console.warn("Invalid URL encountered in feed:", url);
    return undefined;
  }
}
