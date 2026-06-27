/*
 * Participant / ParticipantMember の一意名を Tavily API で検索し、
 * Supabase Tavily テーブルへ upsert する。翻訳（ja/ko）は DeepL API を使用。
 *
 * Usage:
 *   npm run sync:tavily
 *   npm run sync:tavily -- --force
 *
 * ローカルキャッシュ: .cache/tavily/{cache_key}.json（gitignore 済み）
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { TAVILY_EXCLUDE_DOMAINS } from "../src/constants/beatboxerSearch.ts";
import { findUniqueBeatboxerNames } from "../src/db/participant.ts";
import {
  findTavilyByCacheKey,
  upsertTavilyRow,
  type AnswerTranslation,
} from "../src/db/tavily.ts";
import { toTavilyCacheKey } from "../src/util/tavily.ts";
import {
  isLocalTavilyCacheComplete,
  readLocalTavilyCache,
  writeLocalTavilyCache,
} from "./lib/tavily-local-cache.ts";

const DEEPL_CONTEXT =
  "This text is intended to provide information about Beatboxer {name} participating in the GBB (Grand Beatbox Battle).";

const DEEPL_CUSTOM_INSTRUCTIONS =
  "Do not translate the name ({name}); leave it as is in the original.";

const TRANSLATION_LOCALES = ["ja", "ko"] as const;

/** Tavily 同期対象外の Beatboxer 名（出場者未定など）。 */
const TAVILY_SYNC_SKIP_NAMES = new Set(["???"]);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * .env から未設定の process.env を補完する。
 */
const loadDotEnv = (): void => {
  const envPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../.env",
  );
  if (!existsSync(envPath)) {
    return;
  }
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex <= 0) {
      continue;
    }
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
};

type TavilyApiResponse = {
  answer?: string | null;
  results?: unknown[];
  [key: string]: unknown;
};

/**
 * Tavily API でビートボクサーを検索する。
 *
 * Args:
 *   beatboxerName: 出場者名。
 *   apiKey: Tavily API キー。
 *
 * Returns:
 *   Tavily API レスポンス JSON。
 */
const fetchTavilySearch = async (
  beatboxerName: string,
  apiKey: string,
): Promise<TavilyApiResponse> => {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query: `${beatboxerName} beatbox`,
      max_results: 12,
      include_answer: "basic",
      include_favicon: true,
      exclude_domains: [...TAVILY_EXCLUDE_DOMAINS],
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Tavily API error: ${response.status} ${await response.text()}`,
    );
  }

  return (await response.json()) as TavilyApiResponse;
};

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
 * 既存 Tavily 行に answer があるか判定する。
 *
 * Args:
 *   cacheKey: キャッシュキー。
 *
 * Returns:
 *   answer が非 null なら true。
 */
const hasCachedAnswer = async (cacheKey: string): Promise<boolean> => {
  const row = await findTavilyByCacheKey(cacheKey);
  if (!row) {
    return false;
  }
  const searchResults = row.searchResults as { answer?: string | null };
  return searchResults.answer != null;
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
const buildTranslations = async (
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

/**
 * DB 行からローカルキャッシュを生成する。
 *
 * Args:
 *   cacheKey: キャッシュキー。
 *   beatboxerName: 出場者名。
 */
const hydrateLocalCacheFromDb = async (
  cacheKey: string,
  beatboxerName: string,
): Promise<void> => {
  const row = await findTavilyByCacheKey(cacheKey);
  if (!row) {
    return;
  }

  const searchResults = row.searchResults as Record<string, unknown>;
  const answer = (searchResults as { answer?: string | null }).answer;
  if (answer == null) {
    return;
  }

  writeLocalTavilyCache({
    cacheKey,
    beatboxerName,
    searchResults,
    answerTranslation: (row.answerTranslation ?? {}) as AnswerTranslation,
    updatedAt: new Date().toISOString(),
  });
};

/**
 * ローカルキャッシュと DB を同期する。
 *
 * Args:
 *   cacheKey: キャッシュキー。
 *   beatboxerName: 出場者名。
 *   searchResults: Tavily 検索結果。
 *   answerTranslation: 翻訳 JSON。
 */
const persistTavilyData = async (
  cacheKey: string,
  beatboxerName: string,
  searchResults: Record<string, unknown>,
  answerTranslation: AnswerTranslation,
): Promise<void> => {
  await upsertTavilyRow(cacheKey, searchResults, answerTranslation);
  writeLocalTavilyCache({
    cacheKey,
    beatboxerName,
    searchResults,
    answerTranslation,
    updatedAt: new Date().toISOString(),
  });
};

const main = async (): Promise<void> => {
  loadDotEnv();

  const databaseUrl = process.env.DATABASE_URL;
  const tavilyApiKey = process.env.TAVILY_API_KEY;
  const deeplApiKey = process.env.DEEPL_API_KEY;
  const force = process.argv.includes("--force");

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }
  if (!tavilyApiKey) {
    throw new Error("TAVILY_API_KEY is required");
  }
  if (!deeplApiKey) {
    throw new Error("DEEPL_API_KEY is required");
  }

  const names = await findUniqueBeatboxerNames();
  console.log(`Found ${names.length} unique beatboxer names`);

  let synced = 0;
  let skipped = 0;
  let failed = 0;
  let fromLocal = 0;

  for (const name of names) {
    if (TAVILY_SYNC_SKIP_NAMES.has(name)) {
      skipped += 1;
      continue;
    }

    const cacheKey = toTavilyCacheKey(name);

    try {
      if (!force) {
        const local = readLocalTavilyCache(cacheKey);
        if (local && isLocalTavilyCacheComplete(local)) {
          await persistTavilyData(
            cacheKey,
            name,
            local.searchResults,
            local.answerTranslation,
          );
          fromLocal += 1;
          continue;
        }

        if (await hasCachedAnswer(cacheKey)) {
          await hydrateLocalCacheFromDb(cacheKey, name);
          skipped += 1;
          continue;
        }
      }

      console.log(`Syncing: ${name}`);
      const searchResult = await fetchTavilySearch(name, tavilyApiKey);

      if (searchResult.answer == null) {
        console.warn(`  Skipped (no answer): ${name}`);
        skipped += 1;
        await sleep(500);
        continue;
      }

      const existingLocal = readLocalTavilyCache(cacheKey);
      const existingDb = await findTavilyByCacheKey(cacheKey);
      const existingTranslations = {
        ...((existingDb?.answerTranslation ?? {}) as AnswerTranslation),
        ...(existingLocal?.answerTranslation ?? {}),
      };

      const answerTranslation = await buildTranslations(
        searchResult.answer,
        name,
        deeplApiKey,
        existingTranslations,
      );

      await persistTavilyData(
        cacheKey,
        name,
        searchResult as Record<string, unknown>,
        answerTranslation,
      );
      synced += 1;
      await sleep(500);
    } catch (error) {
      failed += 1;
      console.error(`  Failed: ${name}`, error);
    }
  }

  console.log(
    `Done. synced=${synced}, fromLocal=${fromLocal}, skipped=${skipped}, failed=${failed}`,
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
