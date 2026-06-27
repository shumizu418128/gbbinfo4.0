/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly VITE_ASSET_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
