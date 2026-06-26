/** Country.names JSONB に格納される言語コード */
export const countryNameLanguages = [
  "be",
  "cs",
  "da",
  "de",
  "en",
  "es",
  "et",
  "fr",
  "ga",
  "hi",
  "hu",
  "it",
  "ja",
  "ko",
  "ms",
  "nl",
  "no",
  "pl",
  "pt",
  "ta",
  "zh_Hans_CN",
  "zh_Hant_TW",
] as const;

export type CountryNameLanguage = (typeof countryNameLanguages)[number];

/** Country テーブルの names カラムの型 */
export type CountryNames = Record<CountryNameLanguage, string>;

/**
 * サイト UI でサポートする言語と表示名。
 * 現時点では CountryNameLanguage の部分集合（将来一致予定）。
 */
export const languageLabels = {
  ja: "日本語",
  en: "English",
  de: "Deutsch",
} as const satisfies Partial<Record<CountryNameLanguage, string>>;

export type SupportedLanguage = keyof typeof languageLabels;
