import { google } from "googleapis";
import type { SearchStatus } from "./types.js";

const DEFAULT_RANGE = "typesafe!A:H";
const APPEND_TIMEOUT_MS = 5000;
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const SPREADSHEET_ID_IN_URL = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;

type ServiceAccount = {
  client_email: string;
  private_key: string;
};

const readEnv = (name: string): string => {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
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
  const parsed = parseJsonObject(raw);
  if (!parsed) {
    console.error("[sheets] GOOGLE_SHEET_CREDENTIALS is not valid JSON", {
      length: raw.length,
      startsWithBrace: raw.startsWith("{"),
    });
    return null;
  }
  if (
    typeof parsed.client_email !== "string" ||
    typeof parsed.private_key !== "string"
  ) {
    console.error(
      "[sheets] GOOGLE_SHEET_CREDENTIALS missing client_email/private_key",
      { keys: Object.keys(parsed) },
    );
    return null;
  }
  return {
    client_email: parsed.client_email,
    private_key: parsed.private_key.replace(/\\n/g, "\n"),
  };
};

const createAuth = (credentials: ServiceAccount) =>
  new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES,
  });

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

  try {
    const auth = createAuth(credentials);
    const sheets = google.sheets({ version: "v4", auth });
    await sheets.spreadsheets.values.append(
      {
        spreadsheetId,
        range: DEFAULT_RANGE,
        valueInputOption: "RAW",
        requestBody: {
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
        },
      },
      { timeout: APPEND_TIMEOUT_MS, signal: AbortSignal.timeout(APPEND_TIMEOUT_MS) },
    );
  } catch (error) {
    console.error("[sheets] append failed", error);
  }
};
