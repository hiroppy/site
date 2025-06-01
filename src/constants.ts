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
    href: "/blog",
  },
];
export const HATENA_BLOG_URL = "https://abouthiroppy.hatenablog.jp";
export const HATENA_BLOG_ENTRY_URL = `${HATENA_BLOG_URL}/entry`;

export const JOB_FORM =
  "https://coder-penguin.com/#%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B";

export type PAGE_PATH = (typeof PAGE_LINKS)[number]["href"];
export type MediaType = "media" | "podcasts" | "talks";
