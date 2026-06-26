import {
  findYearResources,
  findYearWithCountry,
  type YearWithCountry,
} from "~/db/year.js";

export type CommonYearData = {
  yearWithCountry: YearWithCountry;
  years: number[];
  latestYearWithCountry: YearWithCountry;
};

/**
 * 指定年の共通ページデータ（Header / Hero / Footer 用）をビルド時に取得する。
 *
 * Args:
 *   year: 対象の開催年。
 *
 * Returns:
 *   yearWithCountry・years・latestYearWithCountry。
 */
export const getCommonYearData = async (
  year: number,
): Promise<CommonYearData> => {
  const { yearWithCountry, years } = await findYearResources(year);
  const latestYear = new Date().getFullYear();
  const latestYearWithCountry =
    year === latestYear
      ? yearWithCountry
      : await findYearWithCountry(latestYear);
  return { yearWithCountry, years, latestYearWithCountry };
};
