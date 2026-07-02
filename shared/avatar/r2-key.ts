import { normalizeBeatboxerNameForAvatar } from "./normalize.js";

/**
 * R2 オブジェクトキーを生成する。
 *
 * 画像は出場者名にのみ紐づく。Tavily 結果が変わっても既存キャッシュを使う。
 *
 * Args:
 *   name: 出場者名（正規化済み推奨）。
 *
 * Returns:
 *   `avatars/{name}` 形式のキー。
 */
export const buildAvatarR2Key = (name: string): string => {
  const normalizedName = normalizeBeatboxerNameForAvatar(name);
  return `avatars/${normalizedName}`;
};
