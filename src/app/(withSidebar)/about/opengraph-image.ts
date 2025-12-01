import {
  createOgImageResponse,
  ogSize,
  ogContentType,
} from "../../../utils/createOgImageResponse";
import { description, title } from "./_metadata";

export const size = ogSize;
export const contentType = ogContentType;

export const alt = title;

export default async function Image() {
  return createOgImageResponse(title, description);
}
