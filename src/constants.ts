export const PAGE_LINKS = <const>[
  {
    icon: "😵‍💫",
    title: "About",
    content: "Hello, I'm Yuta Hiroto! I like OSS development and sleeping 😴",
    href: "/",
  },
  {
    icon: "👨‍💻",
    title: "Jobs",
    content:
      "I work in Yuimedi as VPoE and support Souzoh and Tabelog as a techinical adviser 🥸",
    href: "/jobs",
  },
  {
    icon: "📣",
    title: "Media",
    content:
      "Currently, I will reject the request of speaking basically but I speak on Monthly Ecosystem of Podcast",
    href: "/media",
  },
];

export type PAGE_PATH = typeof PAGE_LINKS[number]["href"];

export type MediaType = "article" | "podcast" | "achievement" | "talk";
