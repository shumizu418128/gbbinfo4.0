import { normalizeQuery } from "./normalize.js";

/** 部分一致でルートへ返す拒否語。大文字で保持する。 */
export const DENYLIST_TERMS = ["HIKAKIN"] as const;

/** 拒否時に返すパス。 */
export const DENYLIST_PATH = "/";

/**
 * 拒否リストに部分一致するか判定する。
 *
 * Args:
 *   query: 生クエリ。
 *
 * Returns:
 *   拒否対象なら true。
 */
export const isDeniedQuery = (query: string): boolean => {
  const normalized = normalizeQuery(query);
  return DENYLIST_TERMS.some((term) => normalized.includes(term));
};
