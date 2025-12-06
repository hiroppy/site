import { createOgImageResponse } from "../../_utils/createOgImageResponse";

export { size, contentType } from "../../_utils/createOgImageResponse";

export const alt = "Labs - hiroppy";

export default async function Image() {
  return createOgImageResponse(alt, "Labs", "実験的なプロジェクトとアイデア");
}
