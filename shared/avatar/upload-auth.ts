const BEARER_PREFIX = "Bearer ";

/**
 * 2 つの文字列を定数時間で比較する。
 *
 * Args:
 *   a: 比較元。
 *   b: 比較先。
 *
 * Returns:
 *   一致すれば true。
 */
const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
};

/**
 * avatar アップロード API の Bearer 認可を検証する。
 *
 * Args:
 *   request: 受信リクエスト。
 *   secret: 環境変数の共有シークレット。
 *
 * Returns:
 *   認可されていれば true。secret 未設定時は常に false。
 */
export const isAuthorizedAvatarUpload = (
  request: Request,
  secret: string | undefined,
): boolean => {
  if (!secret?.length) {
    return false;
  }

  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith(BEARER_PREFIX)) {
    return false;
  }

  const token = authorization.slice(BEARER_PREFIX.length);
  return timingSafeEqual(token, secret);
};
