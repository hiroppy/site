import { createOgImageResponse } from "../../../_utils/createOgImageResponse";

export { size, contentType } from "../../../_utils/createOgImageResponse";

export const runtime = "nodejs";
export const alt = "Feedle";

export default async function Image() {
  return createOgImageResponse(
    "Feedle",
    "Feedle",
    "開発者向けの技術記事収集プラットフォーム",
  );
}
