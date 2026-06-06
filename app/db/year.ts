import { eq } from "drizzle-orm";
import { getDb } from "./client.js";
import { yearTable, type YearWithCountry } from "./tables.js";

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
export const findYearWithCountry = async (
  year: number,
): Promise<YearWithCountry> => {
  const row = await getDb().query.yearTable.findFirst({
    where: eq(yearTable.year, year),
    with: { country: true },
  });
  if (!row?.country) {
    throw new Error(`Year not found: ${year}`);
  }
  const { country, ...yearInfo } = row;
  return { ...yearInfo, country };
};

export type YearContext = {
  yearWithCountry: YearWithCountry;
  latestYearWithCountry: YearWithCountry;
};

/**
 * ページ表示用に、指定年と最新年の Year + Country を取得する。
 *
 * Args:
 *   year: URL パラメータの開催年。
 *
 * Returns:
 *   指定年と最新年の Year + Country ペア。
 */
export const loadYearContext = async (year: number): Promise<YearContext> => {
  const yearWithCountry = await findYearWithCountry(year);
  const nowYear = new Date().getFullYear();

  if (nowYear !== year) {
    const latestYearWithCountry = await findYearWithCountry(nowYear);
    return { yearWithCountry, latestYearWithCountry };
  }

  return { yearWithCountry, latestYearWithCountry: yearWithCountry };
};
