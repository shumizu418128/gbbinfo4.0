import { normalizeBeatboxerNameForAvatar } from "./normalize.js";
import { buildUnavatarImageUrl } from "./match.js";
import { usesSnsDetailDirectImage } from "./platforms.js";
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
 * 出場者詳細ページ用のアバター画像 URL を組み立てる。
 *
 * SNS 設定で unavatar が指定されている場合は unavatar.io を直接返し、
 * それ以外は proxy URL を返す。
 *
 * Args:
 *   baseUrl: PUBLIC_ASSET_BASE_URL（末尾スラッシュなし推奨）。
 *   name: 出場者名。
 *   source: アバター取得元。
 *
 * Returns:
 *   画像 URL。取得元が無効なら null。
 */
export const buildDetailAvatarImageUrl = (
  baseUrl: string,
  name: string,
  source: AvatarSource,
): string | null => {
  if (source.kind === "sns" && usesSnsDetailDirectImage(source.platform)) {
    return buildUnavatarImageUrl(source.platform, source.accountUrl);
  }

  return buildAvatarProxyUrl(baseUrl, name, source);
};

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
