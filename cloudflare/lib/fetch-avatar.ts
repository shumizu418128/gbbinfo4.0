import type { AvatarFetchMethod, AvatarPlatform } from "../../shared/avatar/types.js";
import { fetchImageBytes, fetchOgImageUrl } from "./og-image.js";

const UNAVATAR_BASE_URL = "https://unavatar.io";

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

/**
 * unavatar.io の画像 URL を組み立てる。
 *
 * Args:
 *   platform: SNS プラットフォーム。
 *   accountUrl: SNS アカウント URL。
 *
 * Returns:
 *   unavatar.io URL。組み立て不可時は null。
 */
const buildUnavatarImageUrl = (
  platform: AvatarPlatform,
  accountUrl: string,
): string | null => {
  try {
    const pathname = new URL(accountUrl).pathname.replace(/\/+$/, "");

    if (platform === "x") {
      const match = pathname.match(/^\/([a-zA-Z0-9_]+)$/);
      return match ? `${UNAVATAR_BASE_URL}/x/${match[1]}` : null;
    }

    if (platform === "facebook") {
      const match = pathname.match(/^\/([a-zA-Z0-9_.]+)$/);
      return match ? `${UNAVATAR_BASE_URL}/facebook/${match[1]}` : null;
    }

    return null;
  } catch {
    return null;
  }
};

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
