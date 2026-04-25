import type { LanguageCode } from "../types";

export const SUPPORTED_LOCALES: LanguageCode[] = [
  "ja",
  "ko",
  "en",
  "cs",
  "da",
  "de",
  "es",
  "et",
  "fr",
  "hi",
  "hu",
  "it",
  "ms",
  "nl",
  "no",
  "pl",
  "pt",
  "ta",
  "zh_Hans_CN",
  "zh_Hant_TW",
];

export const DEFAULT_LOCALE: LanguageCode = "ja";

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
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
};

export const FALLBACK_YEAR = Number(import.meta.env.VITE_DEFAULT_YEAR ?? "2026");
