/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly FEEDLE_API_URL: string;
  readonly FEEDLE_API_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
