/**
 * YouTube URL から video ID を抽出する。
 *
 * Args:
 *   url: YouTube 動画 URL。
 *
 * Returns:
 *   11 文字の video ID。見つからなければ null。
 */
export const extractYoutubeVideoId = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube")) {
      const v = parsed.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) {
        return v;
      }
      const embedMatch = parsed.pathname.match(
        /^\/(?:embed|shorts)\/([a-zA-Z0-9_-]{11})(?:\/.*)?$/,
      );
      if (embedMatch) {
        return embedMatch[1];
      }
    }
    if (parsed.hostname.includes("youtu.be")) {
      const shortMatch = parsed.pathname.match(/^\/([a-zA-Z0-9_-]{11})/);
      if (shortMatch) {
        return shortMatch[1];
      }
    }
  } catch {
    return null;
  }
  return null;
};

/**
 * YouTube video ID からサムネイル URL を生成する。
 *
 * Args:
 *   videoId: 11 文字の video ID。
 *
 * Returns:
 *   hqdefault サムネイル URL。
 */
export const toYoutubeThumbnailUrl = (videoId: string): string =>
  `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
