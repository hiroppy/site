"use cache";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "../../../../mdx/contentLoader";
import { Footer } from "../../../_components/Footer";
import { getBlogs } from "../../../_utils/blogHelpers";
import { createMetadata } from "../../../_utils/metadata";
import { fetchReferences } from "../_utils/blog/fetchReferences";
import { ArticleBody } from "./_components/ArticleBody";
import { Hero } from "./_components/Hero";
import { Navigation } from "./_components/Navigation";
import { Sidebar } from "./_components/Sidebar";
import { findPostIndex, findRelatedPosts } from "./_utils/findRelatedPosts";
import {
  calculateDateInfo,
  processHeadingsWithReferences,
} from "./_utils/processPostData";

export async function generateMetadata({
  params,
}: PageProps<"/blog/[id]">): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    notFound();
  }

  return createMetadata({
    path: `/blog/${id}`,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  });
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ id: post.id }));
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[id]">) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    notFound();
  }

  const { frontmatter, MDXContent, headings: extractedHeadings } = post;
  const headings = processHeadingsWithReferences(
    extractedHeadings,
    !!(frontmatter.references && frontmatter.references.length > 0),
  );
  const { diffDate } = calculateDateInfo(new Date(frontmatter.date));
  const posts = await getBlogs();
  const index = findPostIndex(posts, id);
  const relatedPosts = findRelatedPosts(post, posts, id, 2);
  const referencesWithTitles =
    frontmatter.references && frontmatter.references.length > 0
      ? await fetchReferences(frontmatter.references)
      : [];

  return (
    <div className="flex min-h-screen">
      <Sidebar headings={headings} />

      <div className="flex-1 overflow-x-hidden">
        <div className="container mx-auto max-w-7xl px-2 py-6 md:px-4 md:py-8">
          <article className="overflow-hidden rounded-2xl shadow-lg">
            <Hero
              title={frontmatter.title}
              image={frontmatter.image}
              date={new Date(frontmatter.date)}
            />

            <ArticleBody
              id={id}
              frontmatter={frontmatter}
              diffDate={diffDate}
              MDXContent={MDXContent}
              headings={headings}
              referencesWithTitles={referencesWithTitles}
            />
          </article>

          <Navigation posts={posts} index={index} relatedPosts={relatedPosts} />
        </div>
        <Footer />
      </div>
    </div>
  );
}
