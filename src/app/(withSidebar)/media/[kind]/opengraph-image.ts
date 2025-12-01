import {
  createOgImageResponse,
  ogSize,
  ogContentType,
} from "../../../../utils/createOgImageResponse";
import { getKind } from "../../../../utils/media";
import { title, getMetadata, getStaticParams } from "./_metadata";

export const size = ogSize;
export const contentType = ogContentType;

export const alt = title;

export async function generateStaticParams() {
  return getStaticParams();
}

export default async function Image({ params }: PageProps<"/media/[kind]">) {
  const { kind: k } = await params;
  const kind = getKind(k);
  const { title, description } = getMetadata(kind);

  return createOgImageResponse(title, description);
}
