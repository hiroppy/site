import { createOgImageResponse } from "../../../_utils/createOgImageResponse";

export { size, contentType } from "../../../_utils/createOgImageResponse";

export const alt = "Feedle";

export default async function Image() {
  return createOgImageResponse(
    alt,
    "Feedle",
    "開発者向けの技術記事収集プラットフォーム",
  );
}
