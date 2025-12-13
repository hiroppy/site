import {
  createOgImageResponse,
  ogSize,
  ogContentType,
} from "../../../../../utils/createOgImageResponse";
import { description, getStaticParams, title } from "./_metadata";

export const size = ogSize;
export const contentType = ogContentType;

export const alt = title("tag");

export async function generateStaticParams() {
  return getStaticParams();
}

export default async function Image({ params }: PageProps<"/blog/tags/[tag]">) {
  const { tag } = await params;

  return createOgImageResponse(title(tag), description(tag));
}
