import { desc, eq } from "drizzle-orm";
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

/**
 * 全ての開催年を降順（新しい順）で取得する。
 *
 * Returns:
 *   年の数値配列。
 */
const findAllYears = async (): Promise<number[]> => {
  const rows = await getDb()
    .select({ year: yearTable.year })
    .from(yearTable)
    .orderBy(desc(yearTable.year));
  return rows.map((r) => r.year);
};

/**
 * 指定年の詳細情報と全開催年一覧を並列取得する。
 *
 * Args:
 *   year: 詳細を取得する開催年。
 *
 * Returns:
 *   yearWithCountry: 指定年の Country 付き Year 情報。
 *   years: 全開催年の数値配列（降順）。
 */
export const findYearResources = async (year: number) => {
  const [yearWithCountry, years] = await Promise.all([
    findYearWithCountry(year),
    findAllYears(),
  ]);
  return { yearWithCountry, years };
};
