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
  return [
    ...new Set(
      collections
        .map((post) => parseTags(post.data.tags))
        .flat()
        .sort((a, b) => a.length - b.length),
    ),
  ];
}
