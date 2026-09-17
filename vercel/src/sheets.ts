import { google } from "googleapis";
import type { SearchStatus } from "./types.js";

const DEFAULT_RANGE = "Sheet1!A:H";
const SPREADSHEET_TITLE = "gbbinfo-jpn";
const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.readonly",
];

type ServiceAccount = {
  client_email: string;
  private_key: string;
};

let cachedSpreadsheetId: string | null = null;

/**
 * 3.0 と同じ GOOGLE_SHEET_CREDENTIALS（サービスアカウント JSON）を読む。
 *
 * Returns:
 *   client_email と private_key。無ければ null。
 */
const parseCredentials = (): ServiceAccount | null => {
  const raw = process.env.GOOGLE_SHEET_CREDENTIALS;
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as {
      client_email?: unknown;
      private_key?: unknown;
    };
    if (
      typeof parsed.client_email !== "string" ||
      typeof parsed.private_key !== "string"
    ) {
      return null;
    }
    return {
      client_email: parsed.client_email,
      private_key: parsed.private_key.replace(/\\n/g, "\n"),
    };
  } catch {
    return null;
  }
};

const createAuth = (credentials: ServiceAccount) =>
  new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES,
  });

type SheetsAuth = ReturnType<typeof createAuth>;

/**
 * スプレッドシート ID を解決する。3.0 と同様、未指定ならブック名 gbbinfo-jpn。
 *
 * Args:
 *   auth: サービスアカウント JWT。
 *
 * Returns:
 *   スプレッドシート ID。見つからなければ null。
 */
const resolveSpreadsheetId = async (
  auth: SheetsAuth,
): Promise<string | null> => {
  if (cachedSpreadsheetId) {
    return cachedSpreadsheetId;
  }
  const fromEnv = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (fromEnv) {
    cachedSpreadsheetId = fromEnv;
    return fromEnv;
  }

  const drive = google.drive({ version: "v3", auth });
  const listed = await drive.files.list({
    q: `name = '${SPREADSHEET_TITLE}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`,
    fields: "files(id, name)",
    pageSize: 1,
  });
  const id = listed.data.files?.[0]?.id;
  if (!id) {
    return null;
  }
  cachedSpreadsheetId = id;
  return id;
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
    console.error("[sheets] missing GOOGLE_SHEET_CREDENTIALS");
    return;
  }

  try {
    const auth = createAuth(credentials);
    const spreadsheetId = await resolveSpreadsheetId(auth);
    if (!spreadsheetId) {
      console.error(`[sheets] spreadsheet ${SPREADSHEET_TITLE} not found`);
      return;
    }

    const sheets = google.sheets({ version: "v4", auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: process.env.GOOGLE_SHEETS_RANGE ?? DEFAULT_RANGE,
      valueInputOption: "USER_ENTERED",
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
    });
  } catch (error) {
    console.error("[sheets] append failed", error);
  }
};
