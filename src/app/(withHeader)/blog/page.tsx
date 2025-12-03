import { Icon } from "../../_components/Icon";
import { getAllTags, getBlogs } from "../../_utils/blogHelpers";
import { BLOG_DESCRIPTION, BLOG_SITE_TITLE } from "../../_utils/constants";
import { createMetadata } from "../../_utils/metadata";
import { BlogCard } from "./_components/BlogCard";
import { Pagination } from "./_components/Pagination";
import { SearchArticles } from "./_components/SearchArticles";
import { TagsBox } from "./_components/TagsBox";

export const metadata = createMetadata({
  path: "/blog",
  title: BLOG_SITE_TITLE,
  description: BLOG_DESCRIPTION,
});

const POSTS_PER_PAGE = 21;

export default async function BlogListPage() {
  const posts = await getBlogs();
  const allTags = getAllTags(posts);
  const paginatedPosts = posts.slice(0, POSTS_PER_PAGE);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const hasNextPage = totalPages > 1;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search */}
      <div className="mb-4 space-y-4 py-3">
        <div className="relative mx-auto max-w-md">
          <SearchArticles />
        </div>
      </div>

      {/* Tags */}
      <div className="sticky top-16 z-40 py-6 backdrop-blur-lg">
        <TagsBox tags={allTags} />
      </div>

      {/* Blog Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {paginatedPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {/* Empty State */}
      {paginatedPosts.length === 0 && (
        <div className="py-16 text-center">
          <Icon
            icon="mdi:file-document-outline"
            className="mb-4 text-6xl opacity-20"
            width="1.5em"
            height="1.5em"
          />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            記事が見つかりません
          </h2>
          <p className="text-gray-600">記事がありません</p>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-12">
        <Pagination
          prev={undefined}
          next={hasNextPage ? "/blog/2" : undefined}
        />
      </div>
    </div>
  );
}
