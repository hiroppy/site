import { getBlogPosts } from "../../mdx/contentLoader";

export function parseTags(tags: string) {
  return tags.split(",").map((v) => v.trim());
}

export async function getAllTags() {
  const posts = await getBlogPosts();
  const allTags = posts.map((post) => parseTags(post.frontmatter.tags)).flat();
  const tagCounts = allTags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
}
