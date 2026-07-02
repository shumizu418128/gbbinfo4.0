import { UNAVATAR_BASE_URL } from "./constants.js";
import {
  getSnsAvatarConfig,
  INSTAGRAM_ACCOUNT_PATTERN,
  SNS_AVATAR_MATCH_ORDER,
} from "./platforms.js";
import type { AvatarFetchMethod, AvatarSnsPlatform } from "./types.js";

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
export const buildUnavatarImageUrl = (
  platform: AvatarSnsPlatform,
  accountUrl: string,
): string | null => {
  const { unavatar } = getSnsAvatarConfig(platform);
  if (!unavatar) {
    return null;
  }

  try {
    const pathname = new URL(accountUrl).pathname.replace(/\/+$/, "");
    const match = pathname.match(unavatar.pathnamePattern);
    return match
      ? `${UNAVATAR_BASE_URL}/${unavatar.segment}/${match[1]}`
      : null;
  } catch {
    return null;
  }
};

export type SnsAvatarPlatformMatch = {
  platform: AvatarSnsPlatform;
  accountUrl: string;
  method: AvatarFetchMethod;
};

/**
 * 正規化済み URL がアバター取得対象の SNS アカウント URL にマッチするか判定する。
 *
 * Instagram は対象外。
 *
 * Args:
 *   normalizedUrl: 正規化済み URL。
 *
 * Returns:
 *   マッチ時は platform・accountUrl・method。不一致時は null。
 */
export const matchSnsAvatarPlatform = (
  normalizedUrl: string,
): SnsAvatarPlatformMatch | null => {
  if (INSTAGRAM_ACCOUNT_PATTERN.test(normalizedUrl)) {
    return null;
  }

  for (const platform of SNS_AVATAR_MATCH_ORDER) {
    const { method, accountUrlPattern } = getSnsAvatarConfig(platform);
    if (accountUrlPattern.test(normalizedUrl)) {
      return { platform, accountUrl: normalizedUrl, method };
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
 *   アバター取得元。
 */
export const toAvatarSourceFromSnsMatch = (
  sns: SnsAvatarPlatformMatch,
): {
  kind: "sns";
  platform: AvatarSnsPlatform;
  accountUrl: string;
  method: AvatarFetchMethod;
} => ({
  kind: "sns",
  platform: sns.platform,
  accountUrl: sns.accountUrl,
  method: sns.method,
});
