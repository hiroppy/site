import { getAllBlogIds } from "../../../../../mdx/contentLoader";

export const title = "Blog Post";

export async function getStaticParams() {
  const ids = await getAllBlogIds();

  return ids.map((id) => ({ id }));
}
