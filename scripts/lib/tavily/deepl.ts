import type { AnswerTranslation } from "../../../shared/tavily/types.ts";

const DEEPL_CONTEXT =
  "This text is intended to provide information about Beatboxer {name} participating in the GBB (Grand Beatbox Battle).";

const DEEPL_CUSTOM_INSTRUCTIONS =
  "Do not translate the name ({name}); leave it as is in the original.";

const TRANSLATION_LOCALES = ["ja", "ko"] as const;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * DeepL API でテキストを翻訳する。
 *
 * Args:
 *   text: 翻訳元（英語想定）。
 *   targetLang: ja または ko。
 *   beatboxerName: 翻訳除外対象の名前。
 *   apiKey: DeepL API キー。
 *
 * Returns:
 *   翻訳後テキスト。
 */
const translateWithDeepL = async (
  text: string,
  targetLang: "ja" | "ko",
  beatboxerName: string,
  apiKey: string,
): Promise<string> => {
  if (!text.trim()) {
    return "";
  }

  const baseUrl = apiKey.endsWith(":fx")
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate";

  const params = new URLSearchParams();
  params.append("text", text);
  params.append("source_lang", "EN");
  params.append("target_lang", targetLang.toUpperCase());
  params.append("formality", "prefer_more");
  params.append(
    "context",
    DEEPL_CONTEXT.replace("{name}", beatboxerName),
  );
  params.append(
    "custom_instructions",
    DEEPL_CUSTOM_INSTRUCTIONS.replace("{name}", beatboxerName),
  );

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(
      `DeepL API error: ${response.status} ${await response.text()}`,
    );
  }

  const data = (await response.json()) as {
    translations?: Array<{ text: string }>;
  };
  let translated = data.translations?.[0]?.text ?? "";

  if (targetLang === "ja") {
    translated = translated.replaceAll("様々な", "さまざまな");
    translated = translated.replaceAll("様", "").replaceAll("氏", "");
  }

  return translated;
};

/**
 * ja/ko 翻訳を生成する。既存翻訳は再利用する。
 *
 * Args:
 *   answer: 英語 answer。
 *   beatboxerName: 出場者名。
 *   deeplApiKey: DeepL API キー。
 *   existing: 既存の翻訳 JSON。
 *
 * Returns:
 *   完成した answer_translation。
 */
export const buildTranslations = async (
  answer: string,
  beatboxerName: string,
  deeplApiKey: string,
  existing: AnswerTranslation = {},
): Promise<AnswerTranslation> => {
  const translation: AnswerTranslation = { ...existing, en: answer };

  for (const locale of TRANSLATION_LOCALES) {
    if (translation[locale]) {
      continue;
    }
    translation[locale] = await translateWithDeepL(
      answer,
      locale,
      beatboxerName,
      deeplApiKey,
    );
    await sleep(250);
  }

  return translation;
};
