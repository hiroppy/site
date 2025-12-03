const GITHUB_BASE_URL =
  "https://github.com/hiroppy/site/tree/main/content/blog";
const SITE_BASE_URL = "https://hiroppy.me";

export function buildPostUrls(id: string) {
  return {
    github: `${GITHUB_BASE_URL}/${id}.mdx`,
    site: SITE_BASE_URL,
    post: `${SITE_BASE_URL}/blog/${id}`,
  };
}
