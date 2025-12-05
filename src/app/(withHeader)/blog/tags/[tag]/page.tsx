"use cache";

import { getBlogPosts } from "../../../../../mdx/contentLoader";
import { getAllTags } from "../../../../_utils/blogHelpers";
import { createMetadata } from "../../../../_utils/metadata";
import { BlogCard } from "../../_components/BlogCard";
import { TagsBox } from "../../_components/TagsBox";

export async function generateMetadata({
  params,
}: PageProps<"/blog/tags/[tag]">) {
  const { tag } = await params;

  return createMetadata({
    path: `/blog/tags/${tag}`,
    title: `${tag} - Blog`,
    description: `Blog posts tagged with ${tag}`,
  });
}

export async function generateStaticParams() {
  const allTags = await getAllTags();

  return allTags.map((tag) => ({ tag }));
}

export default async function Page({ params }: PageProps<"/blog/tags/[tag]">) {
  const { tag } = await params;
  const posts = await getBlogPosts({ tag });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{tag}</h1>
        <p className="text-gray-600">関連する記事一覧（{posts.length}件）</p>
      </div>
      <div className="sticky top-16 z-40 py-6 backdrop-blur-lg">
        <TagsBox currentTag={tag} />
      </div>
      {posts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            記事が見つかりません
          </h2>
        </div>
      )}
    </div>
  );
}
