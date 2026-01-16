import type { Item } from "feed";
import meta from "hiroppy/generated/meta.json";
import { BLOG_DESCRIPTION, BLOG_SITE_TITLE } from "../../../constants";
import { getBlogPosts } from "../../../mdx/contentLoader";
import {
  addItemsToFeed,
  createRssFeed,
  generateRssResponse,
} from "../../../utils/rss";

export async function GET() {
  const blogs = await getBlogPosts();
  const feed = createRssFeed({
    id: meta.site.blog,
    link: meta.site.blog,
    title: BLOG_SITE_TITLE,
    description: BLOG_DESCRIPTION,
    copyright: `${new Date().getFullYear()} - Copyright Hiroppy, All Rights Reserved.`,
    author: {
      name: "Hiroppy",
      link: meta.site.personal,
    },
  });

  const items: Item[] = blogs.map((blog) => ({
    link: `${meta.site.blog}/posts/${blog.id}`,
    title: blog.frontmatter.title,
    description: blog.frontmatter.description,
    date: new Date(blog.frontmatter.date),
  }));

  addItemsToFeed(feed, items);

  feed.addCategory("Technologie");

  return generateRssResponse(
    feed.rss2(),
    "public, max-age=604800, stale-while-revalidate=2592000",
  );
}
