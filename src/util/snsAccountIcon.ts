import {
  SPOTIFY_ACCOUNT_PATTERN,
  YOUTUBE_CHANNEL_PATTERN,
} from "~/constants/beatboxerSearch.js";

export type SnsPlatform = "spotify" | "youtube";

export type SnsAccountMatch = {
  platform: SnsPlatform;
  accountUrl: string;
};

const SNS_PATTERNS: ReadonlyArray<{
  platform: SnsPlatform;
  pattern: RegExp;
}> = [
  { platform: "spotify", pattern: SPOTIFY_ACCOUNT_PATTERN },
  { platform: "youtube", pattern: YOUTUBE_CHANNEL_PATTERN },
];

const avatarUrlCache = new Map<string, string | null>();

const SNS_FETCH_USER_AGENT =
  "Mozilla/5.0 (compatible; GBBInfoBot/1.0; +https://gbbinfo.com)";

/**
 * SNS パターンマッチ用に URL を正規化する。
 *
 * Args:
 *   url: 対象 URL。
 *
 * Returns:
 *   正規化済み URL 文字列。パース失敗時は元の URL。
 */
export const normalizeUrlForSnsMatch = (url: string): string => {
  try {
    const parsed = new URL(url);
    let hostname = parsed.hostname.toLowerCase();
    if (hostname === "m.youtube.com") {
      hostname = "www.youtube.com";
    }

    let pathname = parsed.pathname.replace(/\/+$/, "");
    const youtubeHandleMatch = pathname.match(/^\/(@[a-zA-Z0-9_-]+)/);
    if (youtubeHandleMatch) {
      pathname = youtubeHandleMatch[0];
    }

    return `https://${hostname}${pathname}`;
  } catch {
    return url;
  }
};

/**
 * URL がアバター取得対象の SNS アカウント URL にマッチするか判定する。
 *
 * Args:
 *   url: 対象 URL。
 *
 * Returns:
 *   マッチ時は platform と正規化済み accountUrl。不一致時は null。
 */
export const matchSnsAccountUrl = (url: string): SnsAccountMatch | null => {
  const normalized = normalizeUrlForSnsMatch(url);
  for (const { platform, pattern } of SNS_PATTERNS) {
    if (pattern.test(normalized)) {
      return { platform, accountUrl: normalized };
    }
  }
  return null;
};

/**
 * HTML から og:image の URL を抽出する。
 *
 * Args:
 *   html: ページ HTML。
 *
 * Returns:
 *   画像 URL。見つからなければ null。
 */
const extractOgImageUrl = (html: string): string | null => {
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1].replace(/&amp;/g, "&");
    }
  }

  return null;
};

/**
 * SNS アカウントページからアバター画像 URL を取得する。
 *
 * YouTube / Spotify の og:image をビルド時に取得する。
 *
 * Args:
 *   accountUrl: SNS アカウント URL。
 *   platform: SNS プラットフォーム。
 *
 * Returns:
 *   画像 URL。取得失敗時は null。
 */
export const fetchSnsAccountAvatarUrl = async (
  accountUrl: string,
  platform: SnsPlatform,
): Promise<string | null> => {
  const cacheKey = `${platform}:${accountUrl}`;
  if (avatarUrlCache.has(cacheKey)) {
    return avatarUrlCache.get(cacheKey) ?? null;
  }

  try {
    const response = await fetch(accountUrl, {
      headers: {
        Accept: "text/html",
        "User-Agent": SNS_FETCH_USER_AGENT,
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      avatarUrlCache.set(cacheKey, null);
      return null;
    }

    const html = await response.text();
    const imageUrl = extractOgImageUrl(html);
    avatarUrlCache.set(cacheKey, imageUrl);
    return imageUrl;
  } catch {
    avatarUrlCache.set(cacheKey, null);
    return null;
  }
};
