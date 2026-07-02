import type { AvatarFetchMethod, AvatarPlatform } from "../../shared/avatar/types.js";
import { buildUnavatarImageUrl } from "../../shared/avatar/match.js";
import {
  extractYoutubeVideoId,
  toYoutubeThumbnailUrl,
} from "../../shared/avatar/youtube.js";
import { fetchImageBytes, fetchOgImageUrl } from "./og-image.js";

/**
 * platform / method に応じてアバター画像を取得する。
 *
 * Args:
 *   platform: 対象プラットフォーム。
 *   method: 取得方式。
 *   sourceUrl: 取得元 URL。
 *   videoId: YouTube 動画 ID（youtube-video 用、省略可）。
 *
 * Returns:
 *   画像バイナリ。取得失敗時は null。
 */
export const fetchAvatarImage = async (
  platform: AvatarPlatform,
  method: AvatarFetchMethod,
  sourceUrl: string,
  videoId?: string | null,
): Promise<{ bytes: ArrayBuffer; contentType: string } | null> => {
  if (platform === "youtube-video") {
    const resolvedVideoId = videoId ?? extractYoutubeVideoId(sourceUrl);
    if (!resolvedVideoId) {
      return null;
    }
    return fetchImageBytes(toYoutubeThumbnailUrl(resolvedVideoId));
  }

  if (method === "unavatar") {
    const unavatarUrl = buildUnavatarImageUrl(platform, sourceUrl);
    if (!unavatarUrl) {
      return null;
    }
    return fetchImageBytes(unavatarUrl);
  }

  const ogImageUrl = await fetchOgImageUrl(sourceUrl);
  if (!ogImageUrl) {
    return null;
  }

  return fetchImageBytes(ogImageUrl);
};
