/// <reference path="../.astro/types.d.ts" />

type ImportMetaEnv = {
  readonly FEEDLE_API_URL: string;
  readonly FEEDLE_API_TOKEN: string;
};

type ImportMeta = {
  readonly env: ImportMetaEnv;
};
