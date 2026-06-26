const assetBaseUrl = (import.meta.env.VITE_ASSET_BASE_URL ?? "").replace(/\/$/, "");

/**
 * 静的アセットの公開 URL を返す。
 *
 * VITE_ASSET_BASE_URL 未設定時はローカル public/ 向けの相対パスをそのまま返す。
 *
 * Args:
 *   path: `/images/foo.webp` 形式のパス。
 *
 * Returns:
 *   R2 またはローカル向けの URL。
 */
export const staticAssetUrl = (path: string): string => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return assetBaseUrl ? `${assetBaseUrl}${normalized}` : normalized;
};
