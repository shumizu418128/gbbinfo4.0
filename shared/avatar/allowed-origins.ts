/** avatar proxy が受け付けるリクエスト元ホスト名。 */
const ALLOWED_AVATAR_HOSTNAMES = new Set([
  "gbbinfo-jpn.onrender.com",
  "gbbinfo-preview.onrender.com",
  "localhost",
  "127.0.0.1",
  "[::1]",
]);

/**
 * URL 文字列のホスト名が avatar proxy の許可リストに含まれるか判定する。
 *
 * Args:
 *   urlString: Origin または Referer ヘッダー値。
 *
 * Returns:
 *   許可されていれば true。
 */
const isAllowedAvatarHostname = (urlString: string): boolean => {
  try {
    const hostname = new URL(urlString).hostname.toLowerCase();
    return ALLOWED_AVATAR_HOSTNAMES.has(hostname);
  } catch {
    return false;
  }
};

/**
 * avatar proxy へのリクエストが許可されたオリジンからか判定する。
 *
 * `Origin` または `Referer` のいずれかが許可ホストと一致すれば true。
 * ブラウザの `<img>` 読み込みは Referer、fetch は Origin を送る。
 *
 * Args:
 *   request: 受信リクエスト。
 *
 * Returns:
 *   許可されていれば true。
 */
export const isAllowedAvatarRequestOrigin = (request: Request): boolean => {
  const origin = request.headers.get("Origin");
  if (origin && isAllowedAvatarHostname(origin)) {
    return true;
  }

  const referer = request.headers.get("Referer");
  if (referer && isAllowedAvatarHostname(referer)) {
    return true;
  }

  return false;
};
