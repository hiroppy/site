import { algoliasearch } from "algoliasearch";
import { readFile, readdir } from "fs/promises";
import matter from "gray-matter";
import { basename, extname, join } from "path";
import { remark } from "remark";
import strip from "strip-markdown";
import { fileURLToPath } from "url";

type Frontmatter = {
  title?: string;
  date?: string;
  tags?: string[];
  layout?: string;
  image?: string;
  hatenaPath?: string;
  [key: string]: unknown;
};

type Article = Frontmatter & {
  objectID: string;
  path: string;
  content: string;
};

const blogPath: string = join(
  fileURLToPath(import.meta.url),
  "../../src/content/blog",
);

async function getArticles(): Promise<Article[]> {
  const ext = ".mdx";
  const posts = (await readdir(blogPath)).filter(
    (name: string) => extname(name) === ext,
  );
  const contents = await Promise.all(
    posts.map(async (filename: string): Promise<Article> => {
      const name = basename(filename, ext);
      const md = await readFile(join(blogPath, filename), "utf-8");

      // gray-matter でパース
      const { data: frontmatter, content } = matter(md);

      // markdown を strip
      const processor = remark().use(strip);
      const processedContent = await processor.process(content);

      return {
        objectID: name,
        path: `blog/posts/${name}`,
        content: `${processedContent.value}`,
        ...frontmatter,
      };
    }),
  );

  return contents;
}

process.loadEnvFile();

const articles = await getArticles();
const contents = articles.map(
  ({ layout, image, tags, hatenaPath, date, ...rest }) => rest,
);
const client = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID!,
  process.env.ALGOLIA_ADMIN_KEY!,
);

await client.saveObjects({
  indexName: "blog",
  objects: contents,
});
