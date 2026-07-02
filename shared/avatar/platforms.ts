import type { AvatarFetchMethod, AvatarSnsPlatform } from "./types.js";

/** unavatar.io 用のプラットフォーム別設定。 */
export type SnsUnavatarConfig = {
  segment: string;
  pathnamePattern: RegExp;
};

/** SNS プラットフォームごとのアバター取得設定。 */
export type SnsAvatarPlatformConfig = {
  method: AvatarFetchMethod;
  accountUrlPattern: RegExp;
  allowedHostnames: readonly string[];
  unavatar?: SnsUnavatarConfig;
};

export const INSTAGRAM_ACCOUNT_PATTERN =
  /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/;

/** Tavily 表示用。アバター取得対象外。 */
export const FACEBOOK_ACCOUNT_PATTERN =
  /^(https?:\/\/)?((www|m)\.)?facebook\.com\/[a-zA-Z0-9_.]+\/?$/;

/**
 * SNS プラットフォームごとのアバター取得設定。
 *
 * method・URL パターン・unavatar 設定・許可 hostname をここで一元管理する。
 */
export const SNS_AVATAR_PLATFORM_CONFIG: Record<
  AvatarSnsPlatform,
  SnsAvatarPlatformConfig
> = {
  spotify: {
    method: "ogImage",
    accountUrlPattern:
      /^(https?:\/\/)?(open\.)?spotify\.com\/artist\/[a-zA-Z0-9]+\/?$/,
    allowedHostnames: ["open.spotify.com"],
  },
  youtube: {
    method: "ogImage",
    accountUrlPattern:
      /^(https?:\/\/)?(www\.)?youtube\.com\/(c\/|channel\/|user\/|@)[a-zA-Z0-9_-]+\/?$/,
    allowedHostnames: ["www.youtube.com", "youtube.com"],
  },
  soundcloud: {
    method: "ogImage",
    accountUrlPattern:
      /^(https?:\/\/)?(www\.)?soundcloud\.com\/[a-zA-Z0-9_-]+\/?$/,
    allowedHostnames: ["soundcloud.com", "www.soundcloud.com"],
  },
  x: {
    method: "unavatar",
    accountUrlPattern:
      /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/?$/,
    allowedHostnames: ["x.com", "twitter.com", "www.twitter.com"],
    unavatar: {
      segment: "x",
      pathnamePattern: /^\/([a-zA-Z0-9_]+)$/,
    },
  },
};

/** Tavily 検索結果からアバター取得元を選ぶ際の優先順。 */
export const SNS_AVATAR_MATCH_ORDER: readonly AvatarSnsPlatform[] = [
  "spotify",
  "youtube",
  "soundcloud",
  "x",
];

export const SPOTIFY_ACCOUNT_PATTERN =
  SNS_AVATAR_PLATFORM_CONFIG.spotify.accountUrlPattern;
export const TWITTER_ACCOUNT_PATTERN =
  SNS_AVATAR_PLATFORM_CONFIG.x.accountUrlPattern;
export const SOUNDCLOUD_ACCOUNT_PATTERN =
  SNS_AVATAR_PLATFORM_CONFIG.soundcloud.accountUrlPattern;
export const YOUTUBE_CHANNEL_PATTERN =
  SNS_AVATAR_PLATFORM_CONFIG.youtube.accountUrlPattern;

/**
 * SNS プラットフォーム設定を返す。
 *
 * Args:
 *   platform: 対象プラットフォーム。
 *
 * Returns:
 *   プラットフォーム設定。
 */
export const getSnsAvatarConfig = (
  platform: AvatarSnsPlatform,
): SnsAvatarPlatformConfig => SNS_AVATAR_PLATFORM_CONFIG[platform];
