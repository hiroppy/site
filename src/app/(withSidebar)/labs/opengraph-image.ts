import { createOgImageResponse } from "../../_utils/createOgImageResponse";

export { size, contentType } from "../../_utils/createOgImageResponse";

export const runtime = "nodejs";
export const alt = "Labs - hiroppy";

export default async function Image() {
  return createOgImageResponse(
    "Labs - hiroppy",
    "Labs",
    "実験的なプロジェクトとアイデア",
  );
}
