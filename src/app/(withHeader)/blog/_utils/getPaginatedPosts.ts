import { getBlogPosts } from "../../../../mdx/contentLoader";

const POSTS_PER_PAGE = 21;

export async function getPaginatedPosts({
  currentPage,
  tag,
  perPage = POSTS_PER_PAGE,
}: {
  currentPage: number;
  tag?: string;
  perPage?: number;
}) {
  "use cache";

  const allPosts = await getBlogPosts({
    tag,
  });
  const totalPages = Math.ceil(allPosts.length / perPage);
  const paginatedPosts = allPosts.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return { paginatedPosts, hasPrev, hasNext, totalPages };
}
