import type { MarkdownInstance } from "astro";
import { formatDate } from "./formatDate";

export type Mdxs = MarkdownInstance<BlogFrontmatter>[];

export function sortByDate(mdxs: Mdxs) {
  return mdxs.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export function createAccordionDescription(mdxs: Mdxs) {
  const posts = sortByDate(mdxs);

  return `number of posts - ${
    posts.length
  }<br />last posted date - ${formatDate(
    new Date(posts[0].frontmatter.date)
  )}<br />previous blog - <a href="https://blog.hiroppy.me" target="_blank">技術探し</a>`;
}

// TODO: refactor
export function getTags(tags: string) {
  return tags.split(",").map((v) => v.trim());
}

export function getAllTags(mdxs: Mdxs) {
  return [
    ...new Set(
      mdxs
        .map((post) => post.frontmatter.tags.split(",").map((v) => v.trim()))
        .flat()
        .sort((a, b) => a.length - b.length)
    ),
  ];
}
