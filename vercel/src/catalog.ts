import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { PageCatalog } from "./catalogTypes.js";

let cached: PageCatalog | null = null;

const catalogPath = (): string => {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.join(here, "../data/page-catalog.json");
};

/**
 * 同梱のページカタログを読み込む。
 *
 * Returns:
 *   ハブページのカタログ。
 */
export const loadPageCatalog = (): PageCatalog => {
  if (cached) {
    return cached;
  }
  const raw = readFileSync(catalogPath(), "utf-8");
  cached = JSON.parse(raw) as PageCatalog;
  return cached;
};

/**
 * 指定年にそのセクションがあるか。
 *
 * Args:
 *   catalog: カタログ。
 *   year: 対象年。
 *   section: yearSections の slug。
 *
 * Returns:
 *   存在するなら true。
 */
export const yearHasSection = (
  catalog: PageCatalog,
  year: number,
  section: string,
): boolean => catalog.yearSections[String(year)]?.includes(section) === true;

/**
 * セクションを持つ最も近い年を返す。
 *
 * Args:
 *   catalog: カタログ。
 *   preferredYear: 優先年。
 *   section: yearSections の slug。
 *
 * Returns:
 *   見つかった年。なければ undefined。
 */
export const findYearWithSection = (
  catalog: PageCatalog,
  preferredYear: number,
  section: string,
): number | undefined => {
  if (yearHasSection(catalog, preferredYear, section)) {
    return preferredYear;
  }
  return catalog.years.find((year) => yearHasSection(catalog, year, section));
};
