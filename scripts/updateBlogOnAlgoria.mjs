import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, extname, basename } from "node:path";
import algoliasearch from "algoliasearch";
import { remark } from "remark";
import strip from "strip-markdown";
import remarkFrontmatter from "remark-frontmatter";
import yaml from "yaml";
import { config } from "dotenv";

config();

const ext = ".mdx";
const blogDir = join(fileURLToPath(import.meta.url), "../../src/pages/blog");
const posts = (await readdir(blogDir)).filter((name) => extname(name) === ext);
const contents = await Promise.all(
  posts.map(async (filename) => {
    const name = basename(filename, ext);
    const md = await readFile(join(blogDir, filename), "utf-8");
    const frontmatter = {
      title: "",
      description: "",
    };
    const content = await remark()
      .use(remarkFrontmatter, ["yaml"])
      .use(() => (tree) => {
        const { title, description } = yaml.parse(
          tree.children.find(({ type }) => type === "yaml").value
        );

        frontmatter.title = title;
        frontmatter.description = description;

        return {
          ...tree,
          children: tree.children.filter(({ type }) => type !== "yaml"),
        };
      })
      .use(strip)
      .process(md);

    return {
      objectID: name,
      url: `https://hiroppy.me/blog/${name}`,
      content: content.value,
      ...frontmatter,
    };
  })
);
const client = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID,
  process.env.ALGOLIA_ADMIN_KEY
);
const index = client.initIndex("blog");

await index.saveObjects(contents, { autoGenerateObjectIDIfNotExist: true });
