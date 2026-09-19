import { createSign } from "node:crypto";
import type { SearchStatus } from "./types.js";

const DEFAULT_RANGE = "typesafe!A:H";
const APPEND_TIMEOUT_MS = 5000;
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const SPREADSHEET_ID_IN_URL = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;

type ServiceAccount = {
  client_email: string;
  private_key: string;
};

const readEnv = (name: string): string => {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
};

const stripBom = (value: string): string =>
  value.charCodeAt(0) === 0xfeff ? value.slice(1) : value;

const unwrapWrappingQuotes = (value: string): string => {
  if (value.length < 2) {
    return value;
  }
  const start = value[0];
  const end = value[value.length - 1];
  if ((start === "'" && end === "'") || (start === '"' && end === '"')) {
    return value.slice(1, -1);
  }
  return value;
};

const parseJsonObject = (raw: string): Record<string, unknown> | null => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
    if (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }
  } catch {
    return null;
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return null;
  }
  return parsed as Record<string, unknown>;
};

const decodeBase64Json = (raw: string): Record<string, unknown> | null => {
  const compact = raw.replace(/\s+/g, "");
  if (compact.length < 80 || !/^[A-Za-z0-9+/]+=*$/.test(compact)) {
    return null;
  }
  try {
    const decoded = Buffer.from(compact, "base64").toString("utf8").trim();
    if (!decoded.startsWith("{")) {
      return null;
    }
    return parseJsonObject(decoded);
  } catch {
    return null;
  }
};

const normalizePrivateKey = (value: string): string => {
  const unescaped = value
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
  if (unescaped.includes("\n") || !unescaped.includes("BEGIN")) {
    return unescaped;
  }
  const match = unescaped.match(
    /-----BEGIN ([A-Z ]+)-----([A-Za-z0-9+/=]+)-----END \1-----/,
  );
  if (!match) {
    return unescaped;
  }
  const body = match[2].replace(/\s+/g, "");
  const lines = body.match(/.{1,64}/g) ?? [body];
  return `-----BEGIN ${match[1]}-----\n${lines.join("\n")}\n-----END ${match[1]}-----\n`;
};

const serviceAccountFromObject = (
  parsed: Record<string, unknown> | null,
): ServiceAccount | null => {
  if (
    !parsed ||
    typeof parsed.client_email !== "string" ||
    typeof parsed.private_key !== "string"
  ) {
    return null;
  }
  return {
    client_email: parsed.client_email,
    private_key: normalizePrivateKey(parsed.private_key),
  };
};

const serviceAccountFromLooseText = (raw: string): ServiceAccount | null => {
  const email = raw.match(/"client_email"\s*:\s*"([^"]+)"/);
  const key = raw.match(/"private_key"\s*:\s*"([\s\S]*?)"\s*(?:,|\})/);
  if (!email?.[1] || !key?.[1]) {
    return null;
  }
  return {
    client_email: email[1],
    private_key: normalizePrivateKey(key[1]),
  };
};

/**
 * サービスアカウント JSON を Vercel で壊れやすい形式も含めて読む。
 *
 * Args:
 *   raw: 環境変数の生文字列。
 *
 * Returns:
 *   client_email と private_key。読めなければ null。
 */
const parseServiceAccount = (raw: string): ServiceAccount | null => {
  const normalized = stripBom(raw).trim();
  if (!normalized) {
    return null;
  }

  const candidates = [normalized];
  const unwrapped = unwrapWrappingQuotes(normalized);
  if (unwrapped !== normalized) {
    candidates.push(unwrapped);
  }

  for (const candidate of candidates) {
    const parsed =
      parseJsonObject(candidate) ?? decodeBase64Json(candidate);
    const account = serviceAccountFromObject(parsed);
    if (account) {
      return account;
    }
  }

  return serviceAccountFromLooseText(normalized);
};

/**
 * 3.0 と同じ GOOGLE_SHEET_CREDENTIALS（サービスアカウント JSON）を読む。
 *
 * Returns:
 *   client_email と private_key。無ければ null。
 */
const parseCredentials = (): ServiceAccount | null => {
  const raw = readEnv("GOOGLE_SHEET_CREDENTIALS");
  if (!raw) {
    const googleKeys = Object.keys(process.env).filter((key) =>
      key.startsWith("GOOGLE_"),
    );
    console.error("[sheets] GOOGLE_SHEET_CREDENTIALS is unset", {
      googleKeys,
    });
    return null;
  }
  const account = parseServiceAccount(raw);
  if (account) {
    return account;
  }
  const parsed =
    parseJsonObject(stripBom(raw)) ??
    decodeBase64Json(raw) ??
    parseJsonObject(unwrapWrappingQuotes(stripBom(raw)));
  if (parsed) {
    console.error(
      "[sheets] GOOGLE_SHEET_CREDENTIALS missing client_email/private_key",
      { keys: Object.keys(parsed) },
    );
    return null;
  }
  console.error("[sheets] GOOGLE_SHEET_CREDENTIALS is not valid JSON", {
    length: raw.length,
    startsWithBrace: raw.startsWith("{"),
  });
  return null;
};

const toBase64Url = (value: string): string =>
  Buffer.from(value).toString("base64url");

const signJwt = (credentials: ServiceAccount): string => {
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${toBase64Url(
    JSON.stringify({ alg: "RS256", typ: "JWT" }),
  )}.${toBase64Url(
    JSON.stringify({
      iss: credentials.client_email,
      scope: SHEETS_SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  )}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  return `${unsigned}.${signer.sign(credentials.private_key, "base64url")}`;
};

const readErrorMessage = (body: unknown): string => {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return "";
  }
  const record = body as Record<string, unknown>;
  if (typeof record.error_description === "string") {
    return record.error_description;
  }
  if (typeof record.error === "string") {
    return record.error;
  }
  if (record.error !== null && typeof record.error === "object") {
    const nested = record.error as Record<string, unknown>;
    if (typeof nested.message === "string") {
      return nested.message;
    }
  }
  return "";
};

const fetchAccessToken = async (
  credentials: ServiceAccount,
  signal: AbortSignal,
): Promise<string> => {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: signJwt(credentials),
    }),
    signal,
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = readErrorMessage(body);
    throw new Error(`token ${response.status}${detail ? `: ${detail}` : ""}`);
  }
  if (
    body === null ||
    typeof body !== "object" ||
    typeof (body as { access_token?: unknown }).access_token !== "string"
  ) {
    throw new Error("token response missing access_token");
  }
  return (body as { access_token: string }).access_token;
};

/**
 * GOOGLE_SHEETS_URL からスプレッドシート ID を取り出す。
 *
 * Returns:
 *   スプレッドシート ID。URL が無いか不正なら null。
 */
const parseSpreadsheetId = (): string | null => {
  const raw = readEnv("GOOGLE_SHEETS_URL");
  if (!raw) {
    return null;
  }
  const matched = raw.match(SPREADSHEET_ID_IN_URL);
  if (matched?.[1]) {
    return matched[1];
  }
  if (/^[a-zA-Z0-9-_]+$/.test(raw)) {
    return raw;
  }
  return null;
};

const appendRow = async (
  credentials: ServiceAccount,
  spreadsheetId: string,
  row: {
    query: string;
    lang: string;
    year: number | "";
    path: string;
    confidence: number | "";
    status: SearchStatus;
    error: string;
  },
  signal: AbortSignal,
): Promise<void> => {
  const token = await fetchAccessToken(credentials, signal);
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(DEFAULT_RANGE)}:append`,
  );
  url.searchParams.set("valueInputOption", "RAW");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values: [
        [
          new Date().toISOString(),
          row.query,
          row.lang,
          row.year,
          row.path,
          row.confidence,
          row.status,
          row.error,
        ],
      ],
    }),
    signal,
  });
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const detail = readErrorMessage(body);
    throw new Error(`append ${response.status}${detail ? `: ${detail}` : ""}`);
  }
};

/**
 * 検索クエリを Google Sheets へ 1 行追記する。
 * 失敗しても throw しない。
 *
 * Args:
 *   row: 記録する検索ログ。
 */
export const appendSearchLog = async (row: {
  query: string;
  lang: string;
  year: number | "";
  path: string;
  confidence: number | "";
  status: SearchStatus;
  error: string;
}): Promise<void> => {
  const credentials = parseCredentials();
  if (!credentials) {
    return;
  }

  const spreadsheetId = parseSpreadsheetId();
  if (!spreadsheetId) {
    console.error("[sheets] missing or invalid GOOGLE_SHEETS_URL");
    return;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), APPEND_TIMEOUT_MS);
  try {
    await appendRow(credentials, spreadsheetId, row, controller.signal);
    console.info("[sheets] appended");
  } catch (error) {
    console.error("[sheets] append failed", error);
  } finally {
    clearTimeout(timer);
  }
};
