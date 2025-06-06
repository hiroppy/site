import type { CollectionEntry } from "astro:content";

export interface BlogItemProps {
  post: CollectionEntry<"blog">;
  currentTag?: string;
  variant?: "card" | "list";
  showImage?: boolean;
  maxTags?: number;
}

export function getBlogItemUrl(slug: string): string {
  return `/blog/${slug}`;
}

export function getBlogItemImageAlt(title: string): string {
  return title;
}

export function getBlogItemAriaLabel(title: string): string {
  return `記事「${title}」を読む`;
}

export function getTagVariant(
  tag: string,
  currentTag?: string,
): "primary" | "secondary" {
  return currentTag && tag === currentTag ? "primary" : "secondary";
}
