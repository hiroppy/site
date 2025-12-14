import { notFound } from "next/navigation";
import { getBlogPost } from "../../../../../mdx/contentLoader";
import { parseTags } from "../../../../../utils/blog";
import {
  createOgImageResponse,
  ogSize,
  ogContentType,
} from "../../../../../utils/createOgImageResponse";
import { getStaticParams, title } from "./_metadata";

export const size = ogSize;
export const contentType = ogContentType;

export const alt = title;

export async function generateStaticParams() {
  return getStaticParams();
}

export default async function Image({ params }: PageProps<"/blog/posts/[id]">) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    notFound();
  }

  const tags = parseTags(post.frontmatter.tags);

  return createOgImageResponse(post.frontmatter.title, undefined, tags);
}
