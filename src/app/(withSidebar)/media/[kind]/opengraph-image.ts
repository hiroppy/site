import { createOgImageResponse } from "../../../_utils/createOgImageResponse";
import { getKindDescription, getKindLabel } from "../_utils/labels";
import { type MediaType, VALID_KINDS } from "../_utils/types";

export { size, contentType } from "../../../_utils/createOgImageResponse";

export const runtime = "nodejs";

export async function generateStaticParams() {
  return VALID_KINDS.map((kind) => ({ kind }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ kind: string }>;
}) {
  const { kind } = await params;

  if (!VALID_KINDS.includes(kind as MediaType)) {
    return createOgImageResponse(
      "Media & Activities",
      "Media",
      getKindDescription(undefined),
    );
  }

  const kindStr = kind as MediaType;
  const title = `Media & Activities / ${getKindLabel(kindStr)}`;
  const description = getKindDescription(kindStr);

  return createOgImageResponse(title, "Media", description);
}

export const alt = "Media & Activities";
