export const SITE_TITLE = "hiroppy's site";
export const SITE_DESCRIPTION =
  "Hiroppy is a JavaScript engineer and working on some OSS projects and Japanese communities.";
export const BLOG_DESCRIPTION =
  "This blog posts my life topic and tech topics mainly JavaScript.";
export const PAGE_LINKS = <const>[
  {
    icon: "😵‍💫",
    title: "About",
    href: "/",
  },
  {
    icon: "👨‍💻",
    title: "Jobs",
    href: "/jobs",
  },
  {
    icon: "📣",
    title: "Media",
    href: "/media",
  },
  {
    icon: "🗒",
    title: "Blog",
    content: "",
    href: "/blog",
  },
];
export const HATENA_BLOG_URL = "https://abouthiroppy.hatenablog.jp/entry";

export type PAGE_PATH = typeof PAGE_LINKS[number]["href"];
export type MediaType = "article" | "podcast" | "achievement" | "talk";
