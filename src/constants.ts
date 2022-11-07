export const PAGE_LINKS = <const>[
  {
    icon: "😵‍💫",
    title: "About",
    content: "Hello, I'm Yuta Hiroto!",
    href: "/",
  },
  {
    icon: "👨‍💻",
    title: "Jobs",
    content: "I've been working in Yuimedi as VPoE",
    href: "/jobs",
  },
  {
    icon: "📣",
    title: "Media",
    content: "mounthly ecosystem",
    href: "/media",
  },
];

export type PAGE_PATH = typeof PAGE_LINKS[number]["href"];
