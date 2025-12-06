import { slug as slugger } from "github-slugger";
import matter from "gray-matter";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { parseTags } from "../app/_utils/blogHelpers";
import { sortByDate } from "../app/_utils/sortItems";
import type { Frontmatter, HeadingData, BlogPost } from "./types";

const contentDirectory = join(process.cwd(), "src/content/blog");

export async function getFrontmatter(id: string) {
  "use cache";

  const filePath = join(contentDirectory, `${id}.mdx`);
  const fileContent = await readFile(filePath, "utf8");
  // TODO
  const { data, content } = matter(fileContent);

  return {
    data: {
      ...data,
      date: new Date(data.date),
    } as Frontmatter,
    content,
  };
}

export async function getAllBlogIds() {
  "use cache";

  const files = await readdir(contentDirectory);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(".mdx", ""));
}

// TODO: 共通化
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
        const { data } = await getFrontmatter(id);

        return {
          id,
          frontmatter: data,
        };
      }),
    );
    const filteredPosts = posts.filter((post) => {
      if (!tag) return true;

      const postTags = parseTags(post.frontmatter.tags);
      return postTags.includes(tag);
    });

    return sortByDate(filteredPosts, (post) => post.frontmatter.date);
  } catch {
    return [];
  }
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const { data, content } = await getFrontmatter(id);
    const { default: MDXContent } = await import(`../content/blog/${id}.mdx`);

    return {
      id,
      frontmatter: data,
      MDXContent,
      headings: extractHeadingsFromContent(content),
    };
  } catch {
    return null;
  }
}

function extractHeadingsFromContent(content: string): HeadingData[] {
  // Extract headings from markdown content (h1-h3 only)
  const headingMatches = content.matchAll(/^(#{1,3})\s+(.+)$/gm);
  return Array.from(headingMatches).map((match) => ({
    depth: match[1].length,
    slug: slugger(match[2]),
    text: match[2],
  }));
}
