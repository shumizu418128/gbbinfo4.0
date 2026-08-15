import { isAuthorizedBearer } from "../http/bearer-auth.js";

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
): boolean => isAuthorizedBearer(request, secret);
