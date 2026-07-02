/**
 * アバター用に出場者名を正規化する。
 *
 * Args:
 *   name: 出場者名。
 *
 * Returns:
 *   大文字・安全文字のみの名前。
 */
export const normalizeBeatboxerNameForAvatar = (name: string): string =>
  name.trim().toUpperCase().replace(/[^a-zA-Z0-9_-]/g, "_");

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
