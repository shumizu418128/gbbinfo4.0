import {
  FACEBOOK_ACCOUNT_PATTERN,
  INSTAGRAM_ACCOUNT_PATTERN,
  SOUNDCLOUD_ACCOUNT_PATTERN,
  SPOTIFY_ACCOUNT_PATTERN,
  TWITTER_ACCOUNT_PATTERN,
  YOUTUBE_CHANNEL_PATTERN,
} from "~/constants/beatboxerSearch.js";

export type SnsIconFetchPlatform =
  | "spotify"
  | "youtube"
  | "soundcloud"
  | "x"
  | "facebook";

export type SnsAvatarFetchMethod = "ogImage" | "unavatar";

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

const UNAVATAR_BASE_URL = "https://unavatar.io";

const SNS_FETCH_USER_AGENT =
  "Mozilla/5.0 (compatible; GBBInfoBot/1.0; +https://gbbinfo.com)";

const ogImageAvatarUrlCache = new Map<string, string | null>();

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
    if (hostname === "twitter.com" || hostname === "www.twitter.com") {
      hostname = "x.com";
    }
    if (hostname === "www.x.com") {
      hostname = "x.com";
    }
    if (hostname === "m.soundcloud.com") {
      hostname = "soundcloud.com";
    }
    if (hostname === "m.facebook.com") {
      hostname = "www.facebook.com";
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
 * SNS アカウントページから og:image を取得する。
 *
 * Args:
 *   accountUrl: SNS アカウント URL。
 *   platform: SNS プラットフォーム。
 *
 * Returns:
 *   画像 URL。取得失敗時は null。
 */
const fetchOgImageAvatarUrl = async (
  accountUrl: string,
  platform: SnsIconFetchPlatform,
): Promise<string | null> => {
  const cacheKey = `${platform}:${accountUrl}`;
  if (ogImageAvatarUrlCache.has(cacheKey)) {
    return ogImageAvatarUrlCache.get(cacheKey) ?? null;
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
      ogImageAvatarUrlCache.set(cacheKey, null);
      return null;
    }

    const html = await response.text();
    const imageUrl = extractOgImageUrl(html);
    ogImageAvatarUrlCache.set(cacheKey, imageUrl);
    return imageUrl;
  } catch {
    ogImageAvatarUrlCache.set(cacheKey, null);
    return null;
  }
};

/**
 * SNS アカウント URL から unavatar.io のパスを組み立てる。
 *
 * Args:
 *   platform: SNS プラットフォーム。
 *   accountUrl: SNS アカウント URL。
 *
 * Returns:
 *   unavatar.io パス。組み立て不可時は null。
 */
const buildUnavatarPath = (
  platform: SnsIconFetchPlatform,
  accountUrl: string,
): string | null => {
  try {
    const pathname = new URL(accountUrl).pathname.replace(/\/+$/, "");

    switch (platform) {
      case "x": {
        const match = pathname.match(/^\/([a-zA-Z0-9_]+)$/);
        return match ? `x/${match[1]}` : null;
      }
      case "facebook": {
        const match = pathname.match(/^\/([a-zA-Z0-9_.]+)$/);
        return match ? `facebook/${match[1]}` : null;
      }
      default:
        return null;
    }
  } catch {
    return null;
  }
};

/**
 * unavatar.io のアバター画像 URL を組み立てる。
 *
 * 実際の取得はクライアント側の img 読み込みに委ねる。
 *
 * Args:
 *   accountUrl: SNS アカウント URL。
 *   platform: SNS プラットフォーム。
 *
 * Returns:
 *   画像 URL。組み立て不可時は null。
 */
const buildUnavatarAvatarUrl = (
  accountUrl: string,
  platform: SnsIconFetchPlatform,
): string | null => {
  const unavatarPath = buildUnavatarPath(platform, accountUrl);
  if (!unavatarPath) {
    return null;
  }

  return `${UNAVATAR_BASE_URL}/${unavatarPath}`;
};

/**
 * SNS アカウント URL からアバター画像 URL を解決する。
 *
 * `method: "ogImage"` はビルド時に og:image を取得する。
 * `method: "unavatar"` は unavatar.io URL を組み立て、取得はクライアントに委ねる。
 *
 * Args:
 *   sns: マッチ済み SNS アカウント情報。
 *
 * Returns:
 *   画像 URL。解決失敗時は null。
 */
export const resolveSnsAccountAvatarUrl = async (
  sns: SnsAccountMatch,
): Promise<string | null> => {
  if (sns.method === "unavatar") {
    return buildUnavatarAvatarUrl(sns.accountUrl, sns.platform);
  }

  return fetchOgImageAvatarUrl(sns.accountUrl, sns.platform);
};
