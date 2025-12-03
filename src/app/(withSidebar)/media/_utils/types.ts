export type MediaType = "articles" | "talks" | "podcasts";

export type MediaItem = {
  title: string;
  description?: string;
  image?: string;
  url: string;
  siteUrl?: string;
  publishedAt: string;
  links?: Array<{
    title: string;
    description?: string;
    image?: string;
    name: string;
    url: string;
  }>;
};

export type DataItem = {
  title: string;
  url: string;
  publishedAt: string;
  category: string;
  icon: string;
  prefixForTitle: string;
  siteUrl?: string;
};

export const VALID_KINDS: MediaType[] = ["articles", "talks", "podcasts"];
