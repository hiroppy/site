import {
  createOgImageResponse,
  ogSize,
  ogContentType,
} from "../../../../utils/createOgImageResponse";
import { description, getStaticParams, title } from "./_metadata";

export const size = ogSize;
export const contentType = ogContentType;

export const alt = title;

export async function generateStaticParams() {
  return getStaticParams();
}

export default async function Image() {
  return createOgImageResponse(title, description);
}
