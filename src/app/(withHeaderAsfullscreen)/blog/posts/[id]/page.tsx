import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Footer } from "../../../../../components/Footer";
import { getBlogPost } from "../../../../../mdx/contentLoader";
import { createMetadata } from "../../../../../utils/metadata";
import { ArticleBody } from "./_components/ArticleBody";
import { Hero } from "./_components/Hero";
import { Navigation } from "./_components/Navigation";
import { References } from "./_components/References";
import { Sidebar } from "./_components/Sidebar";
import { getStaticParams } from "./_metadata";

export async function generateMetadata({
  params,
}: PageProps<"/blog/posts/[id]">): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    notFound();
  }

  return createMetadata({
    path: `/blog/posts/${id}`,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      type: "article",
      publishedTime: post.frontmatter.date,
      authors: ["hiroppy"],
    },
  });
}

export async function generateStaticParams() {
  return getStaticParams();
}

export default async function Page({ params }: PageProps<"/blog/posts/[id]">) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    notFound();
  }

  const { frontmatter, MDXContent, headings: extractedHeadings } = post;
  const headings = !!(
    frontmatter.references && frontmatter.references.length > 0
  )
    ? [
        ...extractedHeadings,
        { depth: 2, slug: "references", text: "参考リンク" },
      ]
    : extractedHeadings;

  return (
    <div className="flex min-h-screen">
      <Sidebar headings={headings} />

      <div className="flex-1 overflow-x-hidden">
        <div className="container mx-auto max-w-7xl px-2 py-6 md:px-4 md:py-8">
          <article className="overflow-hidden rounded-2xl shadow-lg">
            <Hero
              title={frontmatter.title}
              image={frontmatter.image}
              date={frontmatter.date}
            />

            <ArticleBody
              id={id}
              frontmatter={frontmatter}
              MDXContent={MDXContent}
              headings={headings}
            />
            {frontmatter.references && frontmatter.references.length > 0 && (
              <Suspense
                fallback={
                  <div className="my-12 h-20 animate-pulse rounded-lg bg-gray-100" />
                }
              >
                <References references={frontmatter.references} />
              </Suspense>
            )}
          </article>
          {process.env.NODE_ENV !== "development" && (
            <Suspense>
              <Navigation id={id} tags={frontmatter.tags} />
            </Suspense>
          )}
        </div>
        <Footer className="mx-4" />
      </div>
    </div>
  );
}
