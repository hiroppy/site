import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { parseTags } from "../utils/blog";
import { sortByDate } from "../utils/sortItems";
import type { Frontmatter, BlogPost } from "./types";

export async function getBlogPosts({
  tag,
}: {
  tag?: string;
} = {}): Promise<Omit<BlogPost, "MDXContent" | "headings">[]> {
  "use cache";

  try {
    const ids = await getAllBlogIds();
    const posts = await Promise.all(
      ids.map(async (id) => {
        const post = await getBlogPost(id);

        if (!post) {
          throw new Error(`Failed to load frontmatter for blog post: ${id}`);
        }

        return {
          id,
          frontmatter: post.frontmatter,
        };
      }),
    );
    const filteredPosts = posts.filter(({ frontmatter }) => {
      if (!tag) return true;

      const postTags = parseTags(frontmatter.tags);
      return postTags.includes(tag);
    });

    return sortByDate(filteredPosts, (post) => post.frontmatter.date);
  } catch {
    return [];
  }
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const {
      default: MDXContent,
      frontmatter: rawFrontmatter,
      headings,
    } = await import(`../content/blog/${id}.mdx`);

    const frontmatter = {
      ...rawFrontmatter,
      date: new Date(rawFrontmatter.date),
    } as Frontmatter;

    return {
      id,
      frontmatter,
      MDXContent,
      headings,
    };
  } catch {
    return null;
  }
}

export async function getAllBlogIds() {
  "use cache";

  const contentDirectory = join(process.cwd(), "src/content/blog");
  const files = await readdir(contentDirectory);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(".mdx", ""));
}

export async function getAllTags() {
  "use cache";

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
