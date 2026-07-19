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
  cs: "Čeština",
  da: "Dansk",
  de: "Deutsch",
  es: "Español",
  et: "Eesti",
  fr: "Français",
  hi: "हिन्दी",
  hu: "Magyar",
  it: "Italiano",
  ms: "Bahasa MY",
  nl: "Nederlands",
  no: "Norsk",
  pl: "Polski",
  pt: "Português",
  ta: "தமிழ்",
  zh_Hans_CN: "简体中文",
  zh_Hant_TW: "繁體中文",
} as const satisfies Partial<Record<CountryNameLanguage, string>>;

export type SupportedLanguage = keyof typeof languageLabels;

/** サイトのデフォルト言語 */
export const baseLocale: SupportedLanguage = "ja";

/** UI 対応言語コード一覧 */
export const supportedLanguages = Object.keys(
  languageLabels,
) as SupportedLanguage[];

/**
 * Open Graph 用ロケール（BCP 47 風）。
 * languageLabels に言語を足したら、ここにも対応エントリを追加すること。
 */
export const ogLocales = {
  ja: "ja_JP",
  ko: "ko_KR",
  en: "en_US",
  cs: "cs_CZ",
  da: "da_DK",
  de: "de_DE",
  es: "es_ES",
  et: "et_EE",
  fr: "fr_FR",
  hi: "hi_IN",
  hu: "hu_HU",
  it: "it_IT",
  ms: "ms_MY",
  nl: "nl_NL",
  no: "nb_NO",
  pl: "pl_PL",
  pt: "pt_PT",
  ta: "ta_IN",
  zh_Hans_CN: "zh_CN",
  zh_Hant_TW: "zh_TW",
} as const satisfies Record<SupportedLanguage, string>;

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
