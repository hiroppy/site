export function isExternalLink(href: string, baseUrl?: string): boolean {
  if (!href) return false;

  const siteUrl = baseUrl || import.meta.env.SITE;
  return href.startsWith("http") && !href.startsWith(siteUrl);
}

export function getExternalLinkProps(
  href: string,
  target?: string,
  rel?: string,
) {
  const isExternal = isExternalLink(href);

  return {
    target: target || (isExternal ? "_blank" : undefined),
    rel: rel || (isExternal ? "noreferrer" : undefined),
  };
}
