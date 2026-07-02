import type { CountryNameLanguage } from "@shared/types/country.js";

export type {
  CountryNameLanguage,
  CountryNames,
} from "@shared/types/country.js";
export { countryNameLanguages } from "@shared/types/country.js";

/**
 * サイト UI でサポートする言語と表示名。
 * 対応言語の追加・変更はこのオブジェクトのみを編集すること。
 * 現時点では CountryNameLanguage の部分集合（将来一致予定）。
 */
export const languageLabels = {
  ja: "日本語",
  ko: "한국어",
  en: "English",
  de: "Deutsch",
} as const satisfies Partial<Record<CountryNameLanguage, string>>;

export type SupportedLanguage = keyof typeof languageLabels;

/** サイトのデフォルト言語 */
export const baseLocale: SupportedLanguage = "ja";

/** UI 対応言語コード一覧 */
export const supportedLanguages = Object.keys(
  languageLabels,
) as SupportedLanguage[];

/**
 * 値が SupportedLanguage かどうかを判定する。
 *
 * Args:
 *   value: 判定対象の文字列。
 *
 * Returns:
 *   SupportedLanguage であれば true。
 */
export const isSupportedLanguage = (
  value: string,
): value is SupportedLanguage => Object.hasOwn(languageLabels, value);
