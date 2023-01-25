import rss from "@astrojs/rss";
import { extname } from "node:path";
import { Collections, sortByDate } from "../../utils/blog";

const postImportResult = import.meta.glob("./*.mdx", {
  eager: true,
});
const posts = sortByDate(Object.values(postImportResult) as Collections);

export const get = () =>
  rss({
    title: "hiroppy's Blog",
    description: "a blog for hiroppy's life and programming",
    site: new URL("blog", import.meta.env.SITE).href,
    items: posts.map((post) => ({
      link: post.url ?? "",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      pubDate: new Date(post.frontmatter.date),
      customData: `
        <enclosure url="${import.meta.env.SITE}${post.frontmatter.image.replace(
        /^\//,
        ""
      )}" length="0" type="image/${extname(post.frontmatter.image).replace(
        /^\./,
        ""
      )}" />
      `.trim(),
    })),
  });
