import { NotFoundItem } from "../../../../components/NotFoundItem";
import { getPaginatedPosts } from "../_utils/getPaginatedPosts";
import { BlogCard } from "./BlogCard";
import { Pagination } from "./Pagination";
import { SearchArticles } from "./SearchArticles";
import { TagsBox } from "./TagsBox";

type Props = {
  currentPage: number;
  header?: React.ReactNode;
  tag?: string;
  isShowSearchBox?: boolean;
  perPage?: number;
};

export default async function BlogList({
  currentPage,
  header,
  tag,
  perPage,
  isShowSearchBox,
}: Props) {
  const { paginatedPosts, hasPrev, hasNext } = await getPaginatedPosts({
    currentPage,
    tag,
    perPage,
  });

  const prevUrl = hasPrev ? `/blog/${currentPage - 1}` : undefined;
  const nextUrl = hasNext ? `/blog/${currentPage + 1}` : undefined;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {header}
      {isShowSearchBox && (
        <div className="space-y-4 py-3">
          <div className="relative mx-auto max-w-md">
            <SearchArticles />
          </div>
        </div>
      )}
      <div className="sticky top-16 z-40 py-4 backdrop-blur-lg">
        <TagsBox currentTag={tag} />
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {paginatedPosts.map((post, index) => (
          <BlogCard key={post.id} post={post} lazy={index >= 6} />
        ))}
      </div>
      {paginatedPosts.length === 0 && (
        <div className="py-16 text-center">
          <NotFoundItem>該当する記事が見つかりませんでした</NotFoundItem>
        </div>
      )}
      <Pagination prev={prevUrl} next={nextUrl} />
    </div>
  );
}
