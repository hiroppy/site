import { slug as slugger } from "github-slugger";
import matter from "gray-matter";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export type HeadingData = {
  depth: number;
  slug: string;
  text: string;
};

export type BlogPost = {
  id: string;
  frontmatter: {
    title: string;
    description: string;
    date: Date;
    image: string;
    tags: string;
    hatenaPath?: string;
    references?: string[];
  };
  MDXContent: React.ComponentType;
  headings: HeadingData[];
};

const contentDirectory = path.join(process.cwd(), "src/content/blog");

function extractHeadingsFromContent(content: string): HeadingData[] {
  // Extract headings from markdown content (h1-h3 only)
  const headingMatches = content.matchAll(/^(#{1,3})\s+(.+)$/gm);
  return Array.from(headingMatches).map((match) => ({
    depth: match[1].length,
    slug: slugger(match[2]),
    text: match[2],
  }));
}

export async function getBlogPosts(): Promise<
  Omit<BlogPost, "MDXContent" | "headings">[]
> {
  try {
    const files = await readdir(contentDirectory);
    const posts = await Promise.all(
      files
        .filter((file) => file.endsWith(".mdx"))
        .map(async (file) => {
          const id = file.replace(".mdx", "");
          const filePath = path.join(contentDirectory, file);
          const fileContent = await readFile(filePath, "utf8");

          // Parse frontmatter with gray-matter
          const { data } = matter(fileContent);

          return {
            id,
            frontmatter: {
              title: data.title,
              description: data.description,
              date: new Date(data.date), // Convert ISO string to Date
              image: data.image,
              tags: data.tags,
              hatenaPath: data.hatenaPath,
              references: data.references,
            } as BlogPost["frontmatter"],
          };
        }),
    );

    return posts.sort(
      (a, b) => b.frontmatter.date.getTime() - a.frontmatter.date.getTime(),
    );
  } catch {
    return [];
  }
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(contentDirectory, `${id}.mdx`);
    const fileContent = await readFile(filePath, "utf8");
    const { data, content } = matter(fileContent);
    const { default: MDXContent } = await import(`../content/blog/${id}.mdx`);

    return {
      id,
      frontmatter: {
        title: data.title,
        description: data.description,
        date: new Date(data.date), // Convert ISO string to Date
        image: data.image,
        tags: data.tags,
        hatenaPath: data.hatenaPath,
        references: data.references,
      } as BlogPost["frontmatter"],
      MDXContent,
      headings: extractHeadingsFromContent(content),
    };
  } catch {
    return null;
  }
}
