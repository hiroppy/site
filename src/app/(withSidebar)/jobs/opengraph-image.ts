import { createOgImageResponse } from "../../_utils/createOgImageResponse";

export { size, contentType } from "../../_utils/createOgImageResponse";

export const alt = "Skills & Work Experience";

export default async function Image() {
  return createOgImageResponse(
    alt,
    "Jobs",
    "技術スキル、職務経歴、プロジェクト履歴",
  );
}
