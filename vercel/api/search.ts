import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { getCachedSearch, setCachedSearch } from "../src/cache.js";
import { isCreditsExhausted } from "../src/credits.js";
import { DENYLIST_PATH, isDeniedQuery } from "../src/denylist.js";
import { selectPage } from "../src/selectPage.js";
import { appendSearchLog } from "../src/sheets.js";
import { notifyCreditsExhausted } from "../src/slack.js";
import type { SearchStatus } from "../src/types.js";

export const config = {
  runtime: "nodejs",
};

const DEFAULT_ORIGINS = [
  "https://gbbinfo-jpn.onrender.com",
  "http://localhost:4321",
  "http://127.0.0.1:4321",
];

const allowedOrigins = (): string[] => {
  const extra = process.env.CORS_ORIGIN;
  if (!extra) {
    return DEFAULT_ORIGINS;
  }
  return [
    ...DEFAULT_ORIGINS,
    ...extra.split(",").map((origin) => origin.trim()).filter(Boolean),
  ];
};

const app = new Hono().basePath("/api");

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) {
        return origin;
      }
      return allowedOrigins().includes(origin) ? origin : "";
    },
    allowMethods: ["POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

type SearchBody = {
  query: string;
  lang: string;
  year: number | "";
};

/**
 * year を数値として採用できるか判定する。null / false / 空文字は拒否する。
 *
 * Args:
 *   value: JSON の year フィールド。
 *
 * Returns:
 *   有限数。不正なら空文字。
 */
const parseYear = (value: unknown): number | "" => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : "";
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : "";
  }
  return "";
};

const readBody = async (c: Context): Promise<SearchBody | null> => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return null;
  }
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }
  const record = body as Record<string, unknown>;
  const query = typeof record.query === "string" ? record.query : "";
  const lang = typeof record.lang === "string" ? record.lang : "";
  return { query, lang, year: parseYear(record.year) };
};

const logSearch = (
  query: string,
  lang: string,
  year: number | "",
  path: string,
  confidence: number | "",
  status: SearchStatus,
  error = "",
): void => {
  void appendSearchLog({
    query,
    lang,
    year,
    path,
    confidence,
    status,
    error,
  });
};

app.post("/search", async (c) => {
  let query = "";
  let lang = "";
  let year: number | "" = "";

  try {
    const parsed = await readBody(c);
    if (!parsed) {
      logSearch(query, lang, year, "", "", "error", "invalid request");
      return c.json({ error: "invalid_request" }, 400);
    }

    query = parsed.query;
    lang = parsed.lang;
    year = parsed.year;

    if (!query.trim()) {
      logSearch(query, lang, year, "", "", "error", "empty query");
      return c.json({ error: "empty_query" }, 400);
    }

    if (!lang || year === "") {
      logSearch(query, lang, year, "", "", "error", "invalid request");
      return c.json({ error: "invalid_request" }, 400);
    }

    if (isDeniedQuery(query)) {
      logSearch(query, lang, year, DENYLIST_PATH, 1, "denylist");
      return c.json({ path: DENYLIST_PATH, confidence: 1 });
    }

    const cached = getCachedSearch(lang, year, query);
    if (cached) {
      logSearch(query, lang, year, cached.path, cached.confidence, "cached");
      return c.json(cached);
    }

    const selected = await selectPage(query, lang, year);
    if (selected.kind === "no_match") {
      logSearch(query, lang, year, "/", selected.confidence, "no_match");
      setCachedSearch(lang, year, query, "/", selected.confidence);
      return c.json({ path: "/", confidence: selected.confidence });
    }

    setCachedSearch(lang, year, query, selected.path, selected.confidence);
    logSearch(query, lang, year, selected.path, selected.confidence, "ok");
    return c.json({
      path: selected.path,
      confidence: selected.confidence,
    });
  } catch (error) {
    if (isCreditsExhausted(error)) {
      const status =
        error && typeof error === "object" && "status" in error
          ? Number(error.status)
          : undefined;
      const message = error instanceof Error ? error.message : String(error);
      const requestId =
        error && typeof error === "object" && "requestId" in error
          ? String(error.requestId)
          : undefined;
      await notifyCreditsExhausted({
        status,
        message,
        query,
        requestId,
      });
      logSearch(query, lang, year, "", "", "credits_exhausted", message);
      return c.json({ error: "credits_exhausted" }, 503);
    }

    const message = error instanceof Error ? error.message : String(error);
    console.error("[search]", error);
    logSearch(query, lang, year, "", "", "error", message);
    return c.json({ error: "search_failed" }, 500);
  }
});

// Vercel Node の default 関数は (req, res) => void。handle() が返す
// Response は無視され、クライアントが応答待ちのまま固まる。
export default app;
