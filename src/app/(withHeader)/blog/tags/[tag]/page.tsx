import { getBlogPosts } from "../../../../../mdx/contentLoader";
import { createMetadata } from "../../../../../utils/metadata";
import { BlogCard } from "../../_components/BlogCard";
import BlogList from "../../_components/BlogList";
import { TagsBox } from "../../_components/TagsBox";
import { description, getStaticParams, title } from "./_metadata";

export async function generateMetadata({
  params,
}: PageProps<"/blog/tags/[tag]">) {
  const { tag } = await params;

  return createMetadata({
    path: `/blog/tags/${tag}`,
    title: title(tag),
    description: description(tag),
  });
}

export async function generateStaticParams() {
  return getStaticParams();
}

export default async function Page({ params }: PageProps<"/blog/tags/[tag]">) {
  const { tag } = await params;

  // ページネーションは実装しない
  return (
    <BlogList
      header={
        <div className="mb-4 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">{tag}</h1>
        </div>
      }
      tag={tag}
      currentPage={1}
      perPage={1000}
    />
  );
}
