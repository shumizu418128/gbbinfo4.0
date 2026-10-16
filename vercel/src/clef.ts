import type { SearchQuestions } from "./questions.js";

const MODEL_ID = "@cf/cloudflare/clef-flash";
const ATTEMPT_TIMEOUT_MS = 10_000;
const QUOTA_ERROR_CODE = 3036;
const CAPACITY_ERROR_CODE = 3040;

export type ClefSearchResult = {
  answers: {
    isPerson: { noul: number };
    section: { choice: string; confidence: number };
    year: { choice: string };
  };
};

/**
 * Workers AI の失敗。`Error` を継承して status を載せるため class にする。
 */
export class ClefError extends Error {
  readonly status: number;
  readonly codes: readonly number[];
  readonly requestId?: string;
  readonly body: unknown;

  constructor(
    message: string,
    status: number,
    codes: readonly number[],
    requestId?: string,
    body: unknown = null,
  ) {
    super(message);
    this.name = "ClefError";
    this.status = status;
    this.codes = codes;
    this.requestId = requestId;
    this.body = body;
  }
}

const readEnv = (name: string): string => {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const readBody = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

const errorCodes = (body: unknown): number[] => {
  if (!isRecord(body) || !Array.isArray(body.errors)) {
    return [];
  }
  return body.errors.flatMap((item) => {
    if (!isRecord(item) || typeof item.code !== "number") {
      return [];
    }
    return [item.code];
  });
};

const errorMessage = (body: unknown, status: number): string => {
  if (isRecord(body) && Array.isArray(body.errors)) {
    const messages = body.errors.flatMap((item) => {
      if (!isRecord(item) || typeof item.message !== "string") {
        return [];
      }
      return [item.message];
    });
    if (messages.length > 0) {
      return messages.join("; ");
    }
  }
  if (typeof body === "string" && body.trim()) {
    return body.trim();
  }
  return `Clef request failed: ${status}`;
};

const shouldRetry = (error: ClefError): boolean => {
  if (error.codes.includes(QUOTA_ERROR_CODE)) {
    return false;
  }
  if (error.status >= 500 && error.status <= 599) {
    return true;
  }
  return error.status === 429 && error.codes.includes(CAPACITY_ERROR_CODE);
};

const isNoulAnswer = (value: unknown): value is { noul: number } =>
  isRecord(value) && typeof value.noul === "number";

const isChoiceAnswer = (
  value: unknown,
): value is { choice: string; confidence: number } =>
  isRecord(value) &&
  typeof value.choice === "string" &&
  typeof value.confidence === "number";

const isYearAnswer = (value: unknown): value is { choice: string } =>
  isRecord(value) && typeof value.choice === "string";

const parseResult = (body: unknown): ClefSearchResult | null => {
  const payload =
    isRecord(body) && isRecord(body.result) ? body.result : body;
  if (!isRecord(payload) || !isRecord(payload.answers)) {
    return null;
  }
  const { isPerson, section, year } = payload.answers;
  if (
    !isNoulAnswer(isPerson) ||
    !isChoiceAnswer(section) ||
    !isYearAnswer(year)
  ) {
    return null;
  }
  return {
    answers: {
      isPerson: { noul: isPerson.noul },
      section: { choice: section.choice, confidence: section.confidence },
      year: { choice: year.choice },
    },
  };
};

const postClef = async (
  accountId: string,
  token: string,
  state: { query: string; lang: string; pageYear: number },
  questions: SearchQuestions,
): Promise<ClefSearchResult> => {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL_ID}`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "clef-flash",
        state,
        questions,
      }),
      signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new ClefError(message, 0, []);
  }

  const requestId = response.headers.get("cf-ray") ?? undefined;
  const body = await readBody(response);
  const failed = !response.ok || (isRecord(body) && body.success === false);
  if (failed) {
    throw new ClefError(
      errorMessage(body, response.status),
      response.status,
      errorCodes(body),
      requestId,
      body,
    );
  }

  const result = parseResult(body);
  if (!result) {
    throw new ClefError(
      "Clef response is missing answers",
      response.status,
      errorCodes(body),
      requestId,
      body,
    );
  }
  return result;
};

/**
 * Clef-flash に state と質問を送り、判定を返す。
 *
 * Args:
 *   state: 検索クエリと表示中の言語・年。
 *   questions: isPerson / section / year の質問。
 *
 * Returns:
 *   各質問の回答。
 *
 * Raises:
 *   ClefError: 認証・日次枠・容量・応答形式の失敗。
 */
export const runClef = async (
  state: { query: string; lang: string; pageYear: number },
  questions: SearchQuestions,
): Promise<ClefSearchResult> => {
  const accountId = readEnv("CLOUDFLARE_ACCOUNT_ID");
  const token = readEnv("CLOUDFLARE_API_TOKEN");
  if (!accountId || !token) {
    throw new ClefError(
      "CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required",
      500,
      [],
    );
  }

  try {
    return await postClef(accountId, token, state, questions);
  } catch (error) {
    if (error instanceof ClefError && shouldRetry(error)) {
      return await postClef(accountId, token, state, questions);
    }
    throw error;
  }
};
