import {
  createOgImageResponse,
  ogSize,
  ogContentType,
} from "../../../../../utils/createOgImageResponse";
import { description, getStaticParams, title } from "./_metadata";

export const size = ogSize;
export const contentType = ogContentType;

export async function generateStaticParams() {
  return getStaticParams();
}

export default async function Image({
  params,
}: PageProps<"/labs/feedle/[type]">) {
  const { type } = await params;

  return createOgImageResponse(title(type), description);
}
