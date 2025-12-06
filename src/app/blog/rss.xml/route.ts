import { Feed } from "feed";
import meta from "hiroppy/generated/meta.json";
import { getBlogPosts } from "../../../mdx/contentLoader";
import { BLOG_DESCRIPTION, BLOG_SITE_TITLE } from "../../_constants";

export async function GET() {
  const blogs = await getBlogPosts();
  const feed = new Feed({
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

  for (const blog of blogs) {
    feed.addItem({
      link: `${meta.site.blog}posts/${blog.id}`,
      title: blog.frontmatter.title,
      description: blog.frontmatter.description,
      date: new Date(blog.frontmatter.date),
    });
  }

  feed.addCategory("Technologie");

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
