import { getAllTags } from "../../../../_utils/blogHelpers";
import { createOgImageResponse } from "../../../../_utils/createOgImageResponse";

export { size, contentType } from "../../../../_utils/createOgImageResponse";

export const alt = "Blog Tag";

export async function generateStaticParams() {
  const allTags = await getAllTags();

  return allTags.map((tag) => ({ tag }));
}

export default async function Image({ params }: PageProps<"/blog/tags/[tag]">) {
  const { tag } = await params;

  return createOgImageResponse(
    `${tag} - Blog`,
    "Blog Tag",
    `Blog posts tagged with ${tag}`,
  );
}
