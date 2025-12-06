"use cache";

import { BLOG_DESCRIPTION, BLOG_SITE_TITLE } from "../../_constants";
import { createMetadata } from "../../_utils/metadata";
import { BlogListContent } from "./_components/BlogListContent";

export const metadata = createMetadata({
  path: "/blog",
  title: BLOG_SITE_TITLE,
  description: BLOG_DESCRIPTION,
});

export default async function Page() {
  return <BlogListContent currentPage={1} />;
}
