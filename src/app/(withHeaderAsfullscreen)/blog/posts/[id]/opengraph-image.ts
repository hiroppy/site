import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "../../../../../mdx/contentLoader";
import { parseTags } from "../../../../_utils/blogHelpers";
import { createOgImageResponse } from "../../../../_utils/createOgImageResponse";

export const alt = "Blog Post";

export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => ({ id: post.id }));
}

export default async function Image({ params }: PageProps<"/blog/posts/[id]">) {
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
