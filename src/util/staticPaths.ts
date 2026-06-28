import {
  findYearResources,
  findYearWithCountry,
  type YearWithCountry,
} from "~/db/year.js";
import {
  getCommonYearDataFromStore,
  loadBuildCache,
} from "~/db/buildCache.js";

export type CommonYearData = {
  yearWithCountry: YearWithCountry;
  years: number[];
  latestYearWithCountry: YearWithCountry;
};

const commonYearDataMemo = new Map<number, CommonYearData>();

/**
 * 指定年の共通ページデータ（Header / Hero / Footer 用）をビルド時に取得する。
 *
 * ビルドキャッシュが存在する場合は DB にアクセスしない。
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
  const memoized = commonYearDataMemo.get(year);
  if (memoized) {
    return memoized;
  }

  const store = loadBuildCache();
  if (store) {
    const data = getCommonYearDataFromStore(store, year);
    commonYearDataMemo.set(year, data);
    return data;
  }

  const { yearWithCountry, years } = await findYearResources(year);
  const latestYear = new Date().getFullYear();
  const latestYearWithCountry =
    year === latestYear
      ? yearWithCountry
      : await findYearWithCountry(latestYear);
  const data = { yearWithCountry, years, latestYearWithCountry };
  commonYearDataMemo.set(year, data);
  return data;
};
