import { createOgImageResponse } from "../../../_utils/createOgImageResponse";
import { KINDS, TITLE } from "./_constants";
import { getKind } from "./_utils/getKind";
import { getMetadata } from "./_utils/getMetadata";

export { size, contentType } from "../../../_utils/createOgImageResponse";

export const alt = TITLE;

export async function generateStaticParams() {
  return KINDS.map((kind) => ({ kind }));
}

export default async function Image({ params }: PageProps<"/media/[kind]">) {
  const { kind: k } = await params;
  const kind = getKind(k);
  const { title, description } = getMetadata(kind);

  return createOgImageResponse(title, "Media", description);
}
