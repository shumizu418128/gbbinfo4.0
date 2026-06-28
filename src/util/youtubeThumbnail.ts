/**
 * YouTube video ID からサムネイル画像 URL を生成する。
 *
 * Args:
 *   videoId: 11 文字の YouTube video ID。
 *
 * Returns:
 *   hqdefault サムネイル URL。
 */
export const toYoutubeThumbnailUrl = (videoId: string): string =>
  `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
