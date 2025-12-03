import { getBlogPosts } from "../../mdx/contentLoader";
import { sortByDate } from "./sortItems";

export async function getBlogs() {
  const posts = await getBlogPosts();
  return sortByDate(posts, (post) => post.frontmatter.date);
}

export function parseTags(tags: string) {
  return tags.split(",").map((v) => v.trim());
}

export function getAllTags(collections: Awaited<ReturnType<typeof getBlogs>>) {
  const allTags = collections
    .map((post) => parseTags(post.frontmatter.tags))
    .flat();

  const tagCounts = allTags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
}
