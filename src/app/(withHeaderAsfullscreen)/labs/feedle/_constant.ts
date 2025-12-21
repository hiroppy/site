export const ARTICLE_TYPES = ["frontend", "ai"] as const;

export type ArticleType = (typeof ARTICLE_TYPES)[number];

export const ARTICLE_KINDS = [
  "all",
  "official",
  "community",
  "release",
  "podcast",
] as const;

export type ArticleKind = (typeof ARTICLE_KINDS)[number];

export const ARTICLE_TYPE_CONFIGS = [
  {
    id: "frontend",
    name: "Frontend",
    description: "Frontend development articles and resources",
    enabled: true,
    categories: [
      {
        id: "official",
        name: "Official",
        description: "Official documentation and announcements",
        enabled: true,
      },
      {
        id: "community",
        name: "Community",
        description: "Community articles and blog posts",
        enabled: true,
      },
      {
        id: "release",
        name: "Release",
        description: "Release notes and changelog updates",
        enabled: true,
      },
      {
        id: "podcast",
        name: "Podcast",
        description: "Podcast episodes and audio content",
        enabled: true,
      },
    ],
  },
  {
    id: "ai",
    name: "AI",
    description: "Artificial Intelligence and Machine Learning articles",
    enabled: true,
    categories: [
      {
        id: "official",
        name: "Official",
        description: "Official AI/ML documentation and announcements",
        enabled: true,
      },
      {
        id: "community",
        name: "Community",
        description: "Community AI/ML articles and research",
        enabled: true,
      },
      {
        id: "release",
        name: "Release",
        description: "AI/ML tool and framework releases",
        enabled: true,
      },
      {
        id: "podcast",
        name: "Podcast",
        description: "AI/ML podcast episodes and audio content",
        enabled: true,
      },
    ],
  },
] satisfies ArticleTypeConfig[];

type CategoryConfig = {
  id: ArticleKind;
  name: string;
  description: string;
  enabled: boolean;
};

type ArticleTypeConfig = {
  id: ArticleType;
  name: string;
  description: string;
  enabled: boolean;
  categories: CategoryConfig[];
};
