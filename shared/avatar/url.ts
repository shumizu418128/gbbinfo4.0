import { normalizeBeatboxerNameForAvatar } from "./normalize.js";
import type { AvatarFetchMethod, AvatarPlatform, AvatarSource } from "./types.js";

/**
 * AvatarSource から proxy 用 platform を返す。
 *
 * Args:
 *   source: アバター取得元。
 *
 * Returns:
 *   クエリに載せる platform 値。
 */
export const avatarPlatformFromSource = (source: AvatarSource): AvatarPlatform =>
  source.kind === "sns" ? source.platform : "youtube-video";

/**
 * AvatarSource から proxy 用 source URL を返す。
 *
 * Args:
 *   source: アバター取得元。
 *
 * Returns:
 *   クエリに載せる url 値。
 */
export const avatarSourceUrlFromSource = (source: AvatarSource): string =>
  source.kind === "sns" ? source.accountUrl : source.sourceUrl;

/**
 * AvatarSource から proxy 用 method を返す。
 *
 * Args:
 *   source: アバター取得元。
 *
 * Returns:
 *   ogImage / unavatar。YouTube 動画サムネイルは ogImage 扱い。
 */
export const avatarMethodFromSource = (
  source: AvatarSource,
): AvatarFetchMethod => (source.kind === "sns" ? source.method : "ogImage");

/**
 * Cloudflare avatar proxy の URL を組み立てる。
 *
 * Args:
 *   baseUrl: PUBLIC_ASSET_BASE_URL（末尾スラッシュなし推奨）。
 *   name: 出場者名。
 *   source: アバター取得元。
 *
 * Returns:
 *   `/avatar?name=...&platform=...&url=...` 形式の URL。
 */
export const buildAvatarProxyUrl = (
  baseUrl: string,
  name: string,
  source: AvatarSource,
): string => {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const params = new URLSearchParams();
  params.set("name", normalizeBeatboxerNameForAvatar(name));
  params.set("platform", avatarPlatformFromSource(source));
  params.set("url", avatarSourceUrlFromSource(source));
  params.set("method", avatarMethodFromSource(source));

  if (source.kind === "youtubeThumbnail") {
    params.set("videoId", source.videoId);
  }

  return `${normalizedBase}/avatar?${params.toString()}`;
};
