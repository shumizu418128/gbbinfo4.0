import { eq } from "drizzle-orm";
import { getDb } from "./client.js";
import { yearTable } from "./tables.js";
import type { WithRequired } from "./utils.js";

/**
 * 指定年の Year 行と関連 Country を取得する。
 *
 * Args:
 *   year: 取得対象の開催年。
 *
 * Returns:
 *   Country を含む Year 情報。
 *
 * Raises:
 *   Error: 指定年または関連 Country が存在しない場合。
 */
export const findYearWithCountry = async (year: number) => {
  const row = await getDb().query.yearTable.findFirst({
    where: eq(yearTable.year, year),
    with: { country: true },
  });
  if (!row?.country) {
    throw new Error(`Year not found: ${year}`);
  }
  return row as WithRequired<typeof row, "country">;
};

// YearWithCountry 型のエイリアス
export type YearWithCountry = Awaited<ReturnType<typeof findYearWithCountry>>;
