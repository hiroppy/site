import { notFound } from "next/navigation";
import { getBlogPost } from "../../../../mdx/contentLoader";
import { parseTags } from "../../../_utils/blogHelpers";
import { createOgImageResponse } from "../../../_utils/createOgImageResponse";

export { size, contentType } from "../../../_utils/createOgImageResponse";

export const runtime = "nodejs";
export const alt = "Blog Post";

export default async function Image({ params }: PageProps<"/blog/[id]">) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    notFound();
  }

  const tags = parseTags(post.frontmatter.tags);

  return createOgImageResponse(
    post.frontmatter.title,
    "Blog Post",
    undefined,
    tags,
  );
}
