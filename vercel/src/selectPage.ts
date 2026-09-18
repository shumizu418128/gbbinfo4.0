import { TypeSafeClient } from "@typesafe-ai/sdk";
import {
  findYearWithSection,
  loadPageCatalog,
  yearHasSection,
} from "./catalog.js";
import {
  buildSearchQuestions,
  PERSON_NOUL_THRESHOLD,
  SECTION_CONFIDENCE_THRESHOLD,
  YEAR_SECTIONS,
  YEAR_UNSPECIFIED,
  type HubSection,
  type YearSection,
} from "./questions.js";
import type { SelectResult } from "./types.js";

const isYearSection = (value: string): value is YearSection =>
  (YEAR_SECTIONS as readonly string[]).includes(value);

let client: TypeSafeClient | null = null;

const getClient = (): TypeSafeClient => {
  if (client) {
    return client;
  }
  client = new TypeSafeClient({
    retry: { maxRetries: 1 },
  });
  return client;
};

const calendarYearNow = (): number => new Date().getFullYear();

/**
 * Choice の年キーを実際の開催年へ落とす。
 *
 * Args:
 *   selected: TypeSafe の year choice。
 *   pageYear: リクエストの表示年。
 *   availableYears: カタログの年。
 *
 * Returns:
 *   使う GBB 年。
 */
const resolveYear = (
  selected: string,
  pageYear: number,
  availableYears: number[],
): number => {
  if (selected === YEAR_UNSPECIFIED) {
    return pageYear;
  }
  const parsed = Number(selected);
  if (availableYears.includes(parsed)) {
    return parsed;
  }
  return pageYear;
};

/**
 * ハブセクションからサイト内パスを組み立てる。
 *
 * Args:
 *   lang: 表示言語。
 *   year: 解決した GBB 年。
 *   section: TypeSafe の section choice。
 *   allowYearFallback: 指定年にページが無いとき近い年へ寄せるか。
 *
 * Returns:
 *   相対パス。マッチしなければ null。
 */
const buildPath = (
  lang: string,
  year: number,
  section: HubSection,
  allowYearFallback: boolean,
): string | null => {
  const catalog = loadPageCatalog();
  if (section === "no_match") {
    return null;
  }
  if (!isYearSection(section)) {
    return null;
  }
  if (allowYearFallback) {
    const resolvedYear = findYearWithSection(catalog, year, section);
    if (resolvedYear === undefined) {
      return null;
    }
    return `/${lang}/${resolvedYear}/${section}`;
  }
  if (!yearHasSection(catalog, year, section)) {
    return null;
  }
  return `/${lang}/${year}/${section}`;
};

/**
 * TypeSafe でハブページを選ぶ。人名は participants へ寄せる。
 *
 * Args:
 *   query: 検索クエリ。
 *   lang: 表示言語。
 *   pageYear: 今見ている GBB 年。
 *
 * Returns:
 *   選出したパス、または no_match。
 *
 * Raises:
 *   TypeSafe API エラー（クレジット切れを含む）。
 */
export const selectPage = async (
  query: string,
  lang: string,
  pageYear: number,
): Promise<SelectResult> => {
  const catalog = loadPageCatalog();
  const calendarYear = calendarYearNow();
  const questions = buildSearchQuestions(
    calendarYear,
    pageYear,
    catalog.years,
  );

  const response = await getClient().systemOne({
    state: { query, lang, pageYear },
    questions,
  });

  const isPerson = response.answers.isPerson.noul;
  const sectionAnswer = response.answers.section;
  const yearAnswer = response.answers.year;
  const year = resolveYear(yearAnswer.choice, pageYear, catalog.years);
  const allowYearFallback = yearAnswer.choice === YEAR_UNSPECIFIED;

  if (isPerson >= PERSON_NOUL_THRESHOLD) {
    const path = buildPath(lang, year, "participants", allowYearFallback);
    if (path) {
      return { kind: "ok", path, confidence: isPerson };
    }
  }

  const section = sectionAnswer.choice as HubSection;
  if (
    section === "no_match" ||
    sectionAnswer.confidence < SECTION_CONFIDENCE_THRESHOLD
  ) {
    return { kind: "no_match", confidence: sectionAnswer.confidence };
  }

  const path = buildPath(lang, year, section, allowYearFallback);
  if (!path) {
    return { kind: "no_match", confidence: sectionAnswer.confidence };
  }

  return {
    kind: "ok",
    path,
    confidence: sectionAnswer.confidence,
  };
};

