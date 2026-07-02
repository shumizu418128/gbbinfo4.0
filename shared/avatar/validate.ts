import { normalizeBeatboxerNameForAvatar, normalizeUrlForSnsMatch } from "./normalize.js";
import type { AvatarFetchMethod, AvatarPlatform } from "./types.js";

const ALLOWED_PLATFORMS: ReadonlySet<AvatarPlatform> = new Set([
  "spotify",
  "youtube",
  "soundcloud",
  "x",
  "facebook",
  "youtube-video",
]);

const ALLOWED_METHODS: ReadonlySet<AvatarFetchMethod> = new Set([
  "ogImage",
  "unavatar",
]);

/**
 * platform クエリが許可値か判定する。
 *
 * Args:
 *   platform: クエリの platform。
 *
 * Returns:
 *   許可されていれば true。
 */
export const isAllowedAvatarPlatform = (
  platform: string,
): platform is AvatarPlatform => ALLOWED_PLATFORMS.has(platform as AvatarPlatform);

/**
 * method クエリが許可値か判定する。
 *
 * Args:
 *   method: クエリの method。
 *
 * Returns:
 *   許可されていれば true。
 */
export const isAllowedAvatarMethod = (
  method: string,
): method is AvatarFetchMethod => ALLOWED_METHODS.has(method as AvatarFetchMethod);

/**
 * platform と URL の hostname が整合するか判定する。
 *
 * Args:
 *   platform: 対象プラットフォーム。
 *   url: 取得元 URL。
 *
 * Returns:
 *   整合していれば true。
 */
export const isAvatarPlatformUrlConsistent = (
  platform: AvatarPlatform,
  url: string,
): boolean => {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    switch (platform) {
      case "spotify":
        return hostname === "open.spotify.com";
      case "youtube":
        return hostname === "www.youtube.com" || hostname === "youtube.com";
      case "soundcloud":
        return hostname === "soundcloud.com";
      case "x":
        return hostname === "x.com";
      case "facebook":
        return (
          hostname === "www.facebook.com" || hostname === "facebook.com"
        );
      case "youtube-video":
        return (
          hostname.includes("youtube") || hostname.includes("youtu.be")
        );
      default:
        return false;
    }
  } catch {
    return false;
  }
};

/**
 * 出場者名を正規化して返す。
 *
 * Args:
 *   name: クエリの name。
 *
 * Returns:
 *   正規化済み名前。不正時は null。
 */
export const parseAvatarName = (name: string | null): string | null => {
  if (!name?.trim()) {
    return null;
  }
  return normalizeBeatboxerNameForAvatar(name);
};

/**
 * avatar proxy の初回取得用クエリを検証・正規化する。
 *
 * R2 にキャッシュがある場合は使用されない。
 *
 * Args:
 *   platform: プラットフォーム。
 *   url: 取得元 URL。
 *   method: 取得方式。
 *
 * Returns:
 *   正規化済み取得パラメータ。不正時は null。
 */
export const parseAvatarFetchRequest = (
  platform: string | null,
  url: string | null,
  method: string | null,
): {
  platform: AvatarPlatform;
  sourceUrl: string;
  method: AvatarFetchMethod;
} | null => {
  if (!platform || !url?.trim() || !method) {
    return null;
  }

  if (!isAllowedAvatarPlatform(platform) || !isAllowedAvatarMethod(method)) {
    return null;
  }

  const sourceUrl =
    platform === "youtube-video" ? url.trim() : normalizeUrlForSnsMatch(url.trim());

  if (!isAvatarPlatformUrlConsistent(platform, sourceUrl)) {
    return null;
  }

  return {
    platform,
    sourceUrl,
    method,
  };
};
