/** Country.names JSONB に格納される言語コード */
export const countryNameLanguages = [
  "cs",
  "da",
  "de",
  "en",
  "es",
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
  "tr",
  "zh_Hans_CN",
  "zh_Hant_TW",
] as const;

export type CountryNameLanguage = (typeof countryNameLanguages)[number];

/** Country テーブルの names カラムの型 */
export type CountryNames = Record<CountryNameLanguage, string>;
