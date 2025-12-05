import { createOgImageResponse } from "../../_utils/createOgImageResponse";

export { size, contentType } from "../../_utils/createOgImageResponse";

export const alt = "Blog";

export default async function Image() {
  return createOgImageResponse(alt, "Blog List", "Blog posts");
}
