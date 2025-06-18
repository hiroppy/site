const SITE_URL = "https://hiroppy.me";
const BASE_PATH = "/labs/feedle";

const ARTICLE_TYPES = ["frontend", "ai"] as const;
export type ArticleType = (typeof ARTICLE_TYPES)[number];

const ARTICLE_KINDS = [
  "all",
  "official",
  "community",
  "release",
  "podcast",
] as const;
type ArticleKind = (typeof ARTICLE_KINDS)[number];

export const RSS_FEED_KINDS: Array<{ key: ArticleKind; label: string }> = [
  { key: "all", label: "All" },
  { key: "official", label: "Official" },
  { key: "community", label: "Community" },
  { key: "release", label: "Release" },
  { key: "podcast", label: "Podcast" },
];

export function generateRSSUrl(
  type: ArticleType,
  kind?: ArticleKind,
  customBaseUrl?: string,
): string {
  const siteUrl =
    customBaseUrl ||
    (typeof window !== "undefined" &&
    window.location.origin.includes("localhost")
      ? window.location.origin
      : SITE_URL);
  const baseUrl = `${siteUrl}${BASE_PATH}/${type}/rss.xml`;
  return kind && kind !== "all" ? `${baseUrl}?kind=${kind}` : baseUrl;
}

export function generatePageTitle(
  type: ArticleType,
  category?: string,
  service?: string,
): string {
  let title = "Feedle";

  title += ` - ${type.charAt(0).toUpperCase() + type.slice(1)}`;

  if (category && category !== "all") {
    title += ` - ${category.charAt(0).toUpperCase() + category.slice(1)}`;
  }

  if (service) {
    title += ` - ${service}`;
  }

  return title;
}
