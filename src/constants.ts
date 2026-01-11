import meta from "hiroppy/generated/meta.json";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? meta.site.personal;

export const SITE_TITLE = "hiroppy's site";
export const SITE_DESCRIPTION =
  "Hiroppy is a JavaScript engineer and working on some OSS projects and Japanese communities.";

export const BLOG_URL = meta.site.blog;
export const BLOG_SITE_TITLE = "技術探し";
export const BLOG_DESCRIPTION =
  "This blog posts my life topic and tech topics mainly JavaScript.";

const HATENA_BLOG_URL = "https://abouthiroppy.hatenablog.jp";
export const HATENA_BLOG_ENTRY_URL = `${HATENA_BLOG_URL}/entry`;

export const SITE_REPOSITORY_URL = "https://github.com/hiroppy/site";

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Media", href: "/media/all" },
  { label: "Jobs", href: "/jobs" },
  { label: "Blog", href: "/blog/1" },
  { label: "Labs", href: "/labs" },
] as const;

export const MEDIA_KINDS = ["all", "articles", "talks", "podcasts"] as const;

export type MediaKind = (typeof MEDIA_KINDS)[number];
