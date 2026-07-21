/*
 * Participant / ParticipantMember の一意名を Tavily API で検索し、
 * Supabase Tavily テーブルへ upsert する。翻訳（ja/ko）は DeepL API を使用。
 *
 * Usage:
 *   npm run sync:tavily
 *   npm run sync:tavily -- --force
 */

import { toTavilyCacheKey } from "../../shared/tavily/cache-key.ts";
import { closeDb } from "@shared/db/client.js";
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

const formatElapsed = (startedAt: number): string => {
  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  return `${seconds}s`;
};

const main = async (): Promise<void> => {
  loadDotEnv();

  const databaseUrl = process.env.DATABASE_URL;
  const tavilyApiKey = process.env.TAVILY_API_KEY;
  const deeplApiKey = process.env.DEEPL_API_KEY;
  const force = process.argv.includes("--force");
  const startedAt = Date.now();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }
  if (!tavilyApiKey) {
    throw new Error("TAVILY_API_KEY is required");
  }
  if (!deeplApiKey) {
    throw new Error("DEEPL_API_KEY is required");
  }

  console.log(`[tavily] start force=${force}`);
  const names = await findTavilySyncTargetNames();
  const total = names.length;
  console.log(`[tavily] Found ${total} beatboxer names to sync`);

  let synced = 0;
  let skipped = 0;
  let failed = 0;

  for (let index = 0; index < names.length; index += 1) {
    const name = names[index]!;
    const position = index + 1;
    const cacheKey = toTavilyCacheKey(name);
    const prefix = `[tavily] [${position}/${total}]`;

    try {
      if (!force && (await hasCachedAnswer(cacheKey))) {
        skipped += 1;
        console.log(
          `${prefix} skip (cached) ${name} | synced=${synced} skipped=${skipped} failed=${failed}`,
        );
        continue;
      }

      console.log(`${prefix} syncing ${name}...`);
      const searchResult = await fetchTavilySearch(name, tavilyApiKey);

      if (searchResult.answer == null) {
        skipped += 1;
        console.warn(
          `${prefix} skip (no answer) ${name} | synced=${synced} skipped=${skipped} failed=${failed}`,
        );
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
      console.log(
        `${prefix} synced ${name} | synced=${synced} skipped=${skipped} failed=${failed}`,
      );
      await sleep(500);
    } catch (error) {
      failed += 1;
      console.error(
        `${prefix} failed ${name} | synced=${synced} skipped=${skipped} failed=${failed}`,
        error,
      );
    }
  }

  console.log(
    `[tavily] done in ${formatElapsed(startedAt)} | synced=${synced} skipped=${skipped} failed=${failed}`,
  );
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDb();
  });
