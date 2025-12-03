import type { BlogPost } from "../../../../../mdx/contentLoader";
import { parseTags } from "../../../../_utils/blogHelpers";

type BlogPostLike = Pick<BlogPost, "id" | "frontmatter">;

export function findRelatedPosts<T extends BlogPostLike>(
  currentPost: BlogPostLike,
  allPosts: T[],
  currentId: string,
  limit: number = 2,
): T[] {
  const currentTags = parseTags(currentPost.frontmatter.tags);

  return allPosts
    .filter((p) => p.id !== currentId)
    .filter((p) => {
      const blogTags = parseTags(p.frontmatter.tags);
      return currentTags.some((tag) => blogTags.includes(tag));
    })
    .slice(0, limit);
}

export function findPostIndex<T extends BlogPostLike>(posts: T[], id: string) {
  return posts.findIndex((p) => p.id === id);
}
