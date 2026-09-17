import { APIError } from "@typesafe-ai/sdk";

const CREDIT_PATTERN =
  /credit|quota|billing|balance|payment required|insufficient/i;

const stringifyBody = (body: unknown): string => {
  if (typeof body === "string") {
    return body;
  }
  try {
    return JSON.stringify(body);
  } catch {
    return "";
  }
};

/**
 * TypeSafe エラーがクレジット切れかどうかを判定する。
 *
 * Args:
 *   error: catch した値。
 *
 * Returns:
 *   クレジット切れなら true。
 */
export const isCreditsExhausted = (error: unknown): boolean => {
  if (!(error instanceof APIError)) {
    return false;
  }
  if (error.status === 402) {
    return true;
  }
  if (error.status !== 401 && error.status !== 403 && error.status !== 429) {
    return false;
  }
  return CREDIT_PATTERN.test(`${error.message} ${stringifyBody(error.body)}`);
};
