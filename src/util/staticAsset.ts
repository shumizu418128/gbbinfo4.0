const assetBaseUrl = (import.meta.env.PUBLIC_ASSET_BASE_URL ?? "").replace(/\/$/, "");

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
  if (!assetBaseUrl) {
    throw new Error(
      "PUBLIC_ASSET_BASE_URL is required. Set it to your Cloudflare Pages URL (e.g. https://gbbinfo-assets.pages.dev).",
    );
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${assetBaseUrl}${normalized}`;
};
