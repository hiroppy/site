import { getBlogPosts } from "../../../../mdx/contentLoader";
import { createOgImageResponse } from "../../../_utils/createOgImageResponse";
import { POSTS_PER_PAGE } from "../_components/BlogListContent";

export { size, contentType } from "../../../_utils/createOgImageResponse";

export const alt = "Blog";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const params = [];

  for (let i = 2; i <= totalPages; i++) {
    params.push({ page: `${i}` });
  }

  return params;
}

export default async function Image() {
  return createOgImageResponse(alt, "Blog List", "Blog posts");
}
