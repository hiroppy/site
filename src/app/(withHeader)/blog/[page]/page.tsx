"use cache";

import { notFound } from "next/navigation";
import { getBlogPosts } from "../../../../mdx/contentLoader";
import { BLOG_DESCRIPTION, BLOG_SITE_TITLE } from "../../../_constants";
import { createMetadata } from "../../../_utils/metadata";
import {
  BlogListContent,
  POSTS_PER_PAGE,
} from "../_components/BlogListContent";

export const metadata = createMetadata({
  path: "/blog",
  title: BLOG_SITE_TITLE,
  description: BLOG_DESCRIPTION,
});

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const params = [];

  for (let i = 2; i <= totalPages; i++) {
    params.push({ page: `${i}` });
  }

  return params;
}

export default async function Page({ params }: PageProps<"/blog/[page]">) {
  const { page: pageParam } = await params;
  const currentPage = Number(pageParam);

  if (isNaN(currentPage) || currentPage < 2) {
    notFound();
  }

  const posts = await getBlogPosts();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  if (currentPage > totalPages) {
    notFound();
  }

  return <BlogListContent currentPage={currentPage} />;
}
