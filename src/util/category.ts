import type { Categories } from "~/db/category.js";

/**
 * カテゴリ名を URL セーフな slug へ変換する。
 *
 * Args:
 *   name: Category.name。
 *
 * Returns:
 *   小文字・ハイフン区切りの slug。
 */
export const categorySlug = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * slug に一致する Category を返す。
 *
 * Args:
 *   categories: 対象年の有効カテゴリ一覧。
 *   slug: URL の category slug。
 *
 * Returns:
 *   一致する Category。なければ undefined。
 */
export const findCategoryBySlug = (categories: Categories, slug: string) =>
  categories.find((category) => categorySlug(category.name) === slug);
