import { getBlogPosts } from "../../../../mdx/contentLoader";
import { BlogCard } from "./BlogCard";
import { Pagination } from "./Pagination";
import { SearchArticles } from "./SearchArticles";
import { TagsBox } from "./TagsBox";

export const POSTS_PER_PAGE = 21;

type Props = {
  currentPage: number;
};

export async function BlogListContent({ currentPage }: Props) {
  const allPosts = await getBlogPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );
  const prevUrl =
    currentPage > 2
      ? `/blog/${currentPage - 1}`
      : currentPage === 2
        ? "/blog"
        : undefined;
  const nextUrl =
    currentPage < totalPages ? `/blog/${currentPage + 1}` : undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 space-y-4 py-3">
        <div className="relative mx-auto max-w-md">
          <SearchArticles />
        </div>
      </div>
      <div className="sticky top-16 z-40 py-6 backdrop-blur-lg">
        <TagsBox />
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {paginatedPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      {paginatedPosts.length === 0 && (
        <div className="py-16 text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            記事が見つかりません
          </h2>
        </div>
      )}
      <div className="mt-12">
        <Pagination prev={prevUrl} next={nextUrl} />
      </div>
    </div>
  );
}
