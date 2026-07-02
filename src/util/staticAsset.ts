const assetBaseUrl = (import.meta.env.PUBLIC_ASSET_BASE_URL ?? "").replace(
  /\/$/,
  "",
);

/**
 * 静的アセット配信のベース URL を返す。
 *
 * Returns:
 *   PUBLIC_ASSET_BASE_URL（末尾スラッシュなし）。
 *
 * Raises:
 *   Error: PUBLIC_ASSET_BASE_URL 未設定時。
 */
export const getAssetBaseUrl = (): string => {
  if (!assetBaseUrl) {
    throw new Error(
      "PUBLIC_ASSET_BASE_URL is required. Set it to your Cloudflare Pages URL (e.g. https://gbbinfo-assets.pages.dev).",
    );
  }
  return assetBaseUrl;
};

/**
 * 静的アセットの公開 URL を返す。
 *
 * PUBLIC_ASSET_BASE_URL（Cloudflare Pages）が必須。
 * Astro ではクライアント側に PUBLIC_ 接頭辞の変数のみ渡る。
 *
 * Args:
 *   path: `/images/foo.webp` 形式のパス。
 *
 * Returns:
 *   Cloudflare Pages 向けの URL。
 *
 * Raises:
 *   Error: PUBLIC_ASSET_BASE_URL 未設定時。
 */
export const staticAssetUrl = (path: string): string => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getAssetBaseUrl()}${normalized}`;
};
