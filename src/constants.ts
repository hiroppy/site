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
    isRoot: false,
  },
  {
    icon: "👨‍💻",
    title: "Jobs",
    href: "/jobs",
    isRoot: false,
  },
  {
    icon: "📣",
    title: "Media",
    href: "/media",
    isRoot: false,
  },
  {
    icon: "🗒",
    title: "Blog",
    href: "/blog",
    isRoot: true,
  },
];
export const HATENA_BLOG_URL = "https://abouthiroppy.hatenablog.jp";
export const HATENA_BLOG_ENTRY_URL = `${HATENA_BLOG_URL}/entry`;

export const JOB_FORM = "https://forms.gle/8RWCDQzDDTnv3inX8";

export type PAGE_PATH = (typeof PAGE_LINKS)[number]["href"];
export type MediaType = "articles" | "podcasts" | "achievements" | "talks";
