import {
  createOgImageResponse,
  ogSize,
  ogContentType,
} from "../../../utils/createOgImageResponse";
import { title, description } from "./_metadata";

export const size = ogSize;
export const contentType = ogContentType;

export const alt = title;

export default async function Image() {
  return createOgImageResponse(alt, description);
}
