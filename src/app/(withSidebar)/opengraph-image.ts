import { createOgImageResponse } from "../_utils/createOgImageResponse";

export { size, contentType } from "../_utils/createOgImageResponse";

export const runtime = "nodejs";
export const alt = "hiroppy - Web Engineer";

export default async function Image() {
  return createOgImageResponse(
    "hiroppy - Web Engineer",
    "Home",
    "Web Engineer in Tokyo. Likes Open Source, Sauna, and Games.",
  );
}
