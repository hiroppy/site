import { createOgImageResponse } from "../../_utils/createOgImageResponse";

export { size, contentType } from "../../_utils/createOgImageResponse";

export const alt = "About - hiroppy";

export default async function Image() {
  return createOgImageResponse(
    alt,
    "About",
    "JavaScript Engineer, Speaker, OSS Contributor, Community Organizer",
  );
}
