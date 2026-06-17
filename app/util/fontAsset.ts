/**
 * フォントファイルの公開 URL を返す。
 *
 * フォントは R2 ではなくアプリサーバー（/font/*）から配信する。
 *
 * Args:
 *   filename: `Averta-ExtraBold.woff2` 形式のファイル名。
 *
 * Returns:
 *   `/font/...` 形式の URL。
 */
export const fontAssetUrl = (filename: string): string => {
  const normalized = filename.replace(/^\/+/, "");
  return `/font/${normalized}`;
};
