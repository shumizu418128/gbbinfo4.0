import type { YearWithCountry } from "~/db/year.js";
import {
  getCommonYearData,
  getHeaderFooterData,
  type CommonYearData,
} from "~/util/staticPaths.js";

/** GBB 2027。日程は未定、開催都市は Warsaw。 */
export const GBB_2027_YEAR = 2027;

/** Poland の ISO 3166-1 数値コード。Year.iso_code と揃える。 */
const POLAND_ISO_CODE = 616;

const isMissingYearError = (error: unknown, year: number): boolean =>
  error instanceof Error && error.message === `Year not found: ${year}`;

/**
 * Supabase に Year 行が入るまでのプレースホルダ。
 *
 * startsAt / endsAt は日程未定のため null。
 * categories はルール未発表のため null。出場者ページは部門が決まってから生成する。
 */
const placeholderYear = {
  year: GBB_2027_YEAR,
  startsAt: null,
  endsAt: null,
  categories: null,
  city: "Warsaw",
  isoCode: POLAND_ISO_CODE,
  country: null,
} as YearWithCountry;

/**
 * GBB 2027 の共通ページデータを返す。
 *
 * Year 行がまだ無いときはプレースホルダを使う。
 * サイトルートの開催年はスナップショットのままにし、このページの年度選択にだけ 2027 を足す。
 *
 * Args:
 *   なし。
 *
 * Returns:
 *   yearWithCountry・years・latestYearWithCountry。
 *
 * Raises:
 *   Error: 2027 以外の年が見つからないなど、プレースホルダで吸収できない失敗。
 */
export const getGbb2027CommonData = async (): Promise<CommonYearData> => {
  try {
    return await getCommonYearData(GBB_2027_YEAR);
  } catch (error) {
    if (!isMissingYearError(error, GBB_2027_YEAR)) {
      throw error;
    }
  }

  const header = await getHeaderFooterData();
  const years = header.years.includes(GBB_2027_YEAR)
    ? header.years
    : [GBB_2027_YEAR, ...header.years];

  return {
    yearWithCountry: placeholderYear,
    years,
    latestYearWithCountry: header.latestYearWithCountry,
  };
};
