import { ClefError } from "./clef.js";

const QUOTA_ERROR_CODE = 3036;
const CAPACITY_ERROR_CODE = 3040;
const ALLOCATION_PATTERN = /daily free allocation|10,000 neurons/i;

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
 * Workers AI の失敗が日次 Neurons 上限かどうかを判定する。
 *
 * Args:
 *   error: catch した値。
 *
 * Returns:
 *   日次枠の超過なら true。容量不足（3040）は false。
 */
export const isCreditsExhausted = (error: unknown): boolean => {
  if (!(error instanceof ClefError)) {
    return false;
  }
  if (error.codes.includes(QUOTA_ERROR_CODE)) {
    return true;
  }
  if (error.codes.includes(CAPACITY_ERROR_CODE)) {
    return false;
  }
  if (error.status !== 429) {
    return false;
  }
  return ALLOCATION_PATTERN.test(`${error.message} ${stringifyBody(error.body)}`);
};
