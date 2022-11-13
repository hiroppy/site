export const SITE_TITLE = "hiroppy's site";

export const PAGE_LINKS = <const>[
  {
    icon: "😵‍💫",
    title: "About",
    content:
      "Hello, I'm Yuta Hiroto! I'm a Node.js and webpack committer and I like OSS development and sleeping 😴",
    href: "/",
  },
  {
    icon: "👨‍💻",
    title: "Jobs",
    content:
      "I work in Yuimedi as a VPoE and support Souzoh and Tabelog as a Technical Adviser 🥸",
    href: "/jobs",
  },
  {
    icon: "📣",
    title: "Media",
    content:
      "Currently, I will reject the request of speaking basically but I speak on Monthly Ecosystem of Podcast",
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
