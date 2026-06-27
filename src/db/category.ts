import { inArray } from "drizzle-orm";
import orderBy from "lodash/orderBy.js";
import { getDb } from "./client.js";
import { categoryTable } from "./tables.js";

/**
 * 指定 ID の Category 一覧を取得する。
 *
 * Args:
 *   ids: 取得対象の Category ID 配列。Year.categories の順序を保持する。
 *
 * Returns:
 *   Category 一覧。
 */
export const findCategoriesByIds = async (ids: number[]) => {
  if (ids.length === 0) {
    return [];
  }

  const rows = await getDb().query.categoryTable.findMany({
    where: inArray(categoryTable.id, ids),
  });

  const orderMap = new Map(ids.map((id, index) => [id, index]));
  return orderBy(rows, (row) => orderMap.get(row.id) ?? 0);
};

export type Categories = Awaited<ReturnType<typeof findCategoriesByIds>>;
