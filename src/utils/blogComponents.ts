export function getBlogItemUrl(slug: string) {
  return `/blog/${slug}`;
}

export function getBlogItemImageAlt(title: string) {
  return title;
}

export function getBlogItemAriaLabel(title: string) {
  return `記事「${title}」を読む`;
}
