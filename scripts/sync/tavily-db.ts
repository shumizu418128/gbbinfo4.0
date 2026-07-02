/*
 * Participant / ParticipantMember の一意名を Tavily API で検索し、
 * Supabase Tavily テーブルへ upsert する。翻訳（ja/ko）は DeepL API を使用。
 *
 * Usage:
 *   npm run sync:tavily
 *   npm run sync:tavily -- --force
 */

import { toTavilyCacheKey } from "../../shared/tavily/cache-key.ts";
import { upsertTavilyRow } from "@shared/db/tavily.js";
import { loadDotEnv } from "../lib/load-dotenv.ts";
import { fetchTavilySearch } from "../lib/tavily/api.ts";
import { buildTranslations } from "../lib/tavily/deepl.ts";
import {
  findExistingTranslationsFromDb,
  hasCachedAnswer,
} from "../lib/tavily/db-sync.ts";
import { findTavilySyncTargetNames } from "../lib/tavily/sync-targets.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

  const names = await findTavilySyncTargetNames();
  console.log(`Found ${names.length} beatboxer names to sync`);

  let synced = 0;
  let skipped = 0;
  let failed = 0;

  for (const name of names) {
    const cacheKey = toTavilyCacheKey(name);

    try {
      if (!force && (await hasCachedAnswer(cacheKey))) {
        skipped += 1;
        continue;
      }

      console.log(`Syncing: ${name}`);
      const searchResult = await fetchTavilySearch(name, tavilyApiKey);

      if (searchResult.answer == null) {
        console.warn(`  Skipped (no answer): ${name}`);
        skipped += 1;
        await sleep(500);
        continue;
      }

      const existingTranslations = await findExistingTranslationsFromDb(cacheKey);

      const answerTranslation = await buildTranslations(
        searchResult.answer,
        name,
        deeplApiKey,
        existingTranslations,
      );

      await upsertTavilyRow(
        cacheKey,
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

  console.log(`Done. synced=${synced}, skipped=${skipped}, failed=${failed}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
