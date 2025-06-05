import { getCollection } from "astro:content";

export async function getBlogs() {
  const posts = await getCollection("blog");

  return posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );
}

export function parseTags(tags: string) {
  return tags.split(",").map((v) => v.trim());
}

export function getAllTags(collections: Awaited<ReturnType<typeof getBlogs>>) {
  const allTags = collections.map((post) => parseTags(post.data.tags)).flat();

  const tagCounts = allTags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
}
