import { createOgImageResponse } from "../../_utils/createOgImageResponse";

export { size, contentType } from "../../_utils/createOgImageResponse";

export const runtime = "nodejs";
export const alt = "About - hiroppy";

export default async function Image() {
  return createOgImageResponse(
    "About - hiroppy",
    "About",
    "JavaScript Engineer, Speaker, OSS Contributor, Community Organizer",
  );
}
