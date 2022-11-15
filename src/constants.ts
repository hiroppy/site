export const SITE_TITLE = "hiroppy's site";

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

export type PAGE_PATH = typeof PAGE_LINKS[number]["href"];

export type MediaType = "article" | "podcast" | "achievement" | "talk";

export const HATENA_BLOG_URL = "https://blog.hiroppy.me/entry";
