"use cache";

import type { MetadataRoute } from "next";
import { SITE_URL } from "../constants";
import { getBlogPosts, getAllTags } from "../mdx/contentLoader";

const baseDomain = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, tags] = await Promise.all([
    getBlogPostEntries(),
    getTagEntries(),
  ]);

  return [
    ...getStaticPageEntries(),
    ...getMediaEntries(),
    ...blogPosts,
    ...tags,
  ];
}

async function getBlogPostEntries(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts();

  return posts.map((post) => ({
    url: `${baseDomain}/blog/posts/${post.id}`,
    lastModified: post.frontmatter.date,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
}

async function getTagEntries(): Promise<MetadataRoute.Sitemap> {
  const allTags = await getAllTags();

  return allTags.map((tag) => ({
    url: `${baseDomain}/blog/tags/${tag}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));
}

function getMediaEntries(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseDomain}/media`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseDomain}/media/articles`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseDomain}/media/talks`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseDomain}/media/podcasts`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}

function getStaticPageEntries(): MetadataRoute.Sitemap {
  return [
    {
      url: baseDomain,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseDomain}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseDomain}/jobs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseDomain}/blog`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseDomain}/labs`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
