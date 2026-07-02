import {
  INSTAGRAM_ACCOUNT_PATTERN,
  SOUNDCLOUD_ACCOUNT_PATTERN,
  SPOTIFY_ACCOUNT_PATTERN,
  TWITTER_ACCOUNT_PATTERN,
  YOUTUBE_CHANNEL_PATTERN,
} from "~/constants/beatboxerSearch.js";
import type {
  AvatarFetchMethod,
  AvatarSnsPlatform,
} from "@shared/avatar/types.js";
import { normalizeUrlForSnsMatch } from "@shared/avatar/normalize.js";

export type SnsIconFetchPlatform = AvatarSnsPlatform;

export type SnsAvatarFetchMethod = AvatarFetchMethod;

export type SnsAccountMatch = {
  platform: SnsIconFetchPlatform;
  accountUrl: string;
  method: SnsAvatarFetchMethod;
};

const SNS_PATTERNS: ReadonlyArray<{
  platform: SnsIconFetchPlatform;
  pattern: RegExp;
  method: SnsAvatarFetchMethod;
}> = [
  { platform: "spotify", pattern: SPOTIFY_ACCOUNT_PATTERN, method: "ogImage" },
  { platform: "youtube", pattern: YOUTUBE_CHANNEL_PATTERN, method: "ogImage" },
  {
    platform: "soundcloud",
    pattern: SOUNDCLOUD_ACCOUNT_PATTERN,
    method: "ogImage",
  },
  { platform: "x", pattern: TWITTER_ACCOUNT_PATTERN, method: "unavatar" },
];

export { normalizeUrlForSnsMatch };

/**
 * URL がアバター取得対象の SNS アカウント URL にマッチするか判定する。
 *
 * Instagram は対象外。
 *
 * Args:
 *   url: 対象 URL。
 *
 * Returns:
 *   マッチ時は platform・正規化済み accountUrl・method。不一致時は null。
 */
export const matchSnsAccountUrl = (url: string): SnsAccountMatch | null => {
  const normalized = normalizeUrlForSnsMatch(url);
  if (INSTAGRAM_ACCOUNT_PATTERN.test(normalized)) {
    return null;
  }
  for (const { platform, pattern, method } of SNS_PATTERNS) {
    if (pattern.test(normalized)) {
      return { platform, accountUrl: normalized, method };
    }
  }
  return null;
};

/**
 * SNS マッチ情報を AvatarSource（sns）に変換する。
 *
 * Args:
 *   sns: マッチ済み SNS アカウント情報。
 *
 * Returns:
 *   Cloudflare proxy 用の取得元。
 */
export const toAvatarSourceFromSnsMatch = (
  sns: SnsAccountMatch,
): {
  kind: "sns";
  platform: SnsIconFetchPlatform;
  accountUrl: string;
  method: SnsAvatarFetchMethod;
} => ({
  kind: "sns",
  platform: sns.platform,
  accountUrl: sns.accountUrl,
  method: sns.method,
});
