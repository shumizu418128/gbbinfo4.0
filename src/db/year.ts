import { desc, eq } from "drizzle-orm";
import { getDb } from "./client.js";
import { yearTable } from "./tables.js";

/**
 * 指定年の Year 行と関連 Country を取得する。
 *
 * Args:
 *   year: 取得対象の開催年。
 *
 * Returns:
 *   Country 付き Year 情報。中止年など会場未定の場合は country が null。
 *
 * Raises:
 *   Error: 指定年が存在しない場合。
 */
export const findYearWithCountry = async (year: number) => {
  const row = await getDb().query.yearTable.findFirst({
    where: eq(yearTable.year, year),
    with: { country: true },
  });
  if (!row) {
    throw new Error(`Year not found: ${year}`);
  }
  return row;
};

/** Year + 任意の Country（中止年は country が null）。 */
export type YearWithCountry = Awaited<ReturnType<typeof findYearWithCountry>>;

/**
 * 全ての開催年を降順（新しい順）で取得する。
 *
 * Returns:
 *   年の数値配列。
 */
export const findAllYears = async (): Promise<number[]> => {
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

/**
 * 非年度ページの Header / Footer 用データを取得する。
 *
 * Returns:
 *   years: 全開催年の数値配列（降順）。
 *   latestYearWithCountry: 最新開催年の Country 付き Year 情報。
 */
export const findHeaderFooterData = async () => {
  const latestYear = new Date().getFullYear();
  const [years, latestYearWithCountry] = await Promise.all([
    findAllYears(),
    findYearWithCountry(latestYear),
  ]);
  return { years, latestYearWithCountry };
};
