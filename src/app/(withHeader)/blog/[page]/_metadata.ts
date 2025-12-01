import { BLOG_DESCRIPTION, BLOG_SITE_TITLE } from "../../../../constants";
import { getPaginatedPosts } from "../_utils/getPaginatedPosts";

export const title = BLOG_SITE_TITLE;
export const description = BLOG_DESCRIPTION;

export async function getStaticParams() {
  const { totalPages } = await getPaginatedPosts({
    currentPage: /* なんでもよい */ 1,
  });
  const params = [];

  for (let i = 2; i <= totalPages; i++) {
    params.push({ page: `${i}` });
  }

  return params;
}
