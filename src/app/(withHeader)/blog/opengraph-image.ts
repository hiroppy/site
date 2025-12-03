import { createOgImageResponse } from "../../_utils/createOgImageResponse";

export { size, contentType } from "../../_utils/createOgImageResponse";

export const runtime = "nodejs";
export const alt = "Blog";

export default async function Image() {
  return createOgImageResponse(
    "Blog",
    "Blog List",
    "Blog posts by Yuta Hiroto",
  );
}
