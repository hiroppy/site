import { BLOG_SITE_TITLE } from "../../../../../constants";
import { getAllTags } from "../../../../../mdx/contentLoader";

export const title = (tag: string) => `${BLOG_SITE_TITLE} / "${tag}"`;
export const description = (tag: string) => `Blog posts tagged with "${tag}"`;

export async function getStaticParams() {
  const allTags = await getAllTags();

  return allTags.map((tag) => ({ tag }));
}
