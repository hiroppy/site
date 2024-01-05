import rss from "@astrojs/rss";
import { extname } from "node:path";
import { getBlogs } from "../../utils/blog";
import { BLOG_DESCRIPTION, SITE_TITLE } from "../../constants";

const posts = await getBlogs();
const site = new URL("blog", import.meta.env.SITE).href;

export function GET() {
  return rss({
    title: SITE_TITLE,
    description: BLOG_DESCRIPTION,
    site,
    items: posts.map((post) => ({
      link: `${site}/${post.slug}`,
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.date),
      customData: `
        <enclosure url="${import.meta.env.SITE}${post.data.image.replace(
          /^\//,
          "",
        )}" length="0" type="image/${extname(post.data.image).replace(
          /^\./,
          "",
        )}" />
      `.trim(),
    })),
  });
}
