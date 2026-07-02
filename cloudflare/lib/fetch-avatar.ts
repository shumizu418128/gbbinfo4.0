import type { AvatarFetchMethod, AvatarPlatform } from "../../shared/avatar/types.js";
import { buildUnavatarImageUrl } from "../../shared/avatar/match.js";
import {
  extractYoutubeVideoId,
  toYoutubeThumbnailUrl,
} from "../../shared/avatar/youtube.js";
import { fetchImageBytes, fetchOgImageUrl } from "./og-image.js";

export type AvatarFetchResult =
  | { ok: true; bytes: ArrayBuffer; contentType: string }
  | { ok: false; reason: string; detail: string };

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
 *   画像バイナリまたは失敗理由。
 */
export const fetchAvatarImage = async (
  platform: AvatarPlatform,
  method: AvatarFetchMethod,
  sourceUrl: string,
  videoId?: string | null,
): Promise<AvatarFetchResult> => {
  if (platform === "youtube-video") {
    const resolvedVideoId = videoId ?? extractYoutubeVideoId(sourceUrl);
    if (!resolvedVideoId) {
      return {
        ok: false,
        reason: "youtube_video_id_not_found",
        detail: `Could not extract video ID from ${sourceUrl}`,
      };
    }
    return fetchImageBytes(toYoutubeThumbnailUrl(resolvedVideoId));
  }

  if (method === "unavatar") {
    const unavatarUrl = buildUnavatarImageUrl(platform, sourceUrl);
    if (!unavatarUrl) {
      return {
        ok: false,
        reason: "unavatar_url_invalid",
        detail: `Could not build unavatar.io URL for platform=${platform} url=${sourceUrl}`,
      };
    }

    const image = await fetchImageBytes(unavatarUrl);
    if (!image.ok) {
      return {
        ok: false,
        reason: `unavatar_${image.reason}`,
        detail: image.detail,
      };
    }

    return image;
  }

  const ogImage = await fetchOgImageUrl(sourceUrl);
  if (!ogImage.ok) {
    return ogImage;
  }

  return fetchImageBytes(ogImage.imageUrl);
};
