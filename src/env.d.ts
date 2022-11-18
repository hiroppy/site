/// <reference types="@astrojs/image/client" />

type DataItem = {
  siteName?: string;
  siteUrl?: string;
  url: string;
  title: string;
  description?: string;
  image?: string;
  publishedAt: string;
  category?: string;
  icon: string;
  hot?: boolean;
  prefixForTitle: string;
  appendixes?: Record<string, string | undefined>;
};

type BlogFrontmatter = {
  date: string;
  title: string;
  description: string;
  image: string;
  tags: string;
  // 以前のhatenablogのpath
  hatenaPath?: string;
};

type OGPJson = Record<
  string,
  {
    title: string;
    description: string;
    image: string;
  }
>;
