import { createOgImageResponse } from "../../../../_utils/createOgImageResponse";

export { size, contentType } from "../../../../_utils/createOgImageResponse";

export const runtime = "nodejs";
export const alt = "Blog Tag";

export default async function Image({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  return createOgImageResponse(
    `${tag} - Blog`,
    "Blog Tag",
    `Blog posts tagged with ${tag}`,
  );
}
