/// <reference path="../.astro/types.d.ts" />

type Window = {
  algolia: {
    applicationId: string;
    searchOnlyKey: string;
  };
  searchInitialized?: boolean;
};

declare global {
  var window: Window;
}

type ImportMetaEnv = {
  readonly GITHUB_TOKEN: string;

  readonly ALGOLIA_ADMIN_KEY: string;
  readonly PUBLIC_ALGOLIA_APPLICATION_ID: string;
  readonly PUBLIC_ALGOLIA_SEARCH_ONLY_KEY: string;

  readonly FEEDLE_API_URL: string;
  readonly FEEDLE_API_TOKEN: string;
};

type ImportMeta = {
  readonly env: ImportMetaEnv;
};

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
  links?: Array<{
    title: string;
    description?: string;
    image?: string;
    name: string;
    url: string;
  }>;
};

type OGPJson = Record<
  string,
  {
    title: string;
    description: string;
    image: string;
  }
>;
