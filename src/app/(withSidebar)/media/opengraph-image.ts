import { createOgImageResponse } from "../../_utils/createOgImageResponse";

export { size, contentType } from "../../_utils/createOgImageResponse";

export const runtime = "nodejs";
export const alt = "Media & Activities";

export default async function Image() {
  return createOgImageResponse(
    "Media & Activities",
    "Media",
    "登壇・プレス・ポッドキャストなどのメディア活動",
  );
}
