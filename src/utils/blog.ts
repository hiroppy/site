import type { MDXInstance } from "astro";

export type Mdxs = MDXInstance<BlogFrontmatter>[];

export function sortByDate(mdxs: Mdxs) {
  return mdxs.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export function parseTags(tags: string) {
  return tags.split(",").map((v) => v.trim());
}

export function getAllTags(mdxs: Mdxs) {
  return [
    ...new Set(
      mdxs
        .map((post) => parseTags(post.frontmatter.tags))
        .flat()
        .sort((a, b) => a.length - b.length)
    ),
  ];
}
