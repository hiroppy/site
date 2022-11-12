import rss from "@astrojs/rss";
import { Mdxs, sortByDate } from "../../utils/blog";

const postImportResult = import.meta.glob("./*.mdx", {
  eager: true,
});
const posts = sortByDate(Object.values(postImportResult) as Mdxs);

export const get = () =>
  rss({
    title: "hiroppy's Blog",
    description: "a blog for hiroppy's life and programming",
    site: import.meta.env.SITE,
    items: posts.map((post) => ({
      link: post.url ?? "",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      pubDate: new Date(post.frontmatter.date),
    })),
  });
