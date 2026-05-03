export const languageLabels = {
  ja: "日本語",
  en: "English",
  de: "Deutsch",
} as const;

export type SupportedLanguage = keyof typeof languageLabels;
