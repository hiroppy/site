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
  // remove
  comment?: string;
  appendixes?: any;
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
