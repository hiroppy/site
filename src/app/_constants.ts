export const SITE_TITLE = "hiroppy's site";
export const BLOG_SITE_TITLE = "技術探し";
export const SITE_DESCRIPTION =
  "Hiroppy is a JavaScript engineer and working on some OSS projects and Japanese communities.";
export const BLOG_DESCRIPTION =
  "This blog posts my life topic and tech topics mainly JavaScript.";
const HATENA_BLOG_URL = "https://abouthiroppy.hatenablog.jp";
export const HATENA_BLOG_ENTRY_URL = `${HATENA_BLOG_URL}/entry`;

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Media", href: "/media/all" },
  { label: "Jobs", href: "/jobs" },
  { label: "Blog", href: "/blog" },
  { label: "Labs", href: "/labs" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
