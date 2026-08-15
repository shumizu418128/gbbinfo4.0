import { ANNOUNCEMENT_MESSAGE_MAX_LENGTH } from "./constants.js";
import type { SiteAnnouncement } from "./types.js";

const DISABLED_ANNOUNCEMENT = (): SiteAnnouncement => ({
  enabled: false,
  message: "",
  updatedAt: new Date(0).toISOString(),
  expiresAt: null,
});

/**
 * 表示すべきお知らせか判定する（期限切れを含む）。
 *
 * Args:
 *   announcement: お知らせペイロード。
 *   nowMs: 判定時刻（ms）。省略時は Date.now()。
 *
 * Returns:
 *   表示すべきなら true。
 */
export const isAnnouncementVisible = (
  announcement: SiteAnnouncement,
  nowMs: number = Date.now(),
): boolean => {
  if (!announcement.enabled) {
    return false;
  }

  const message = announcement.message.trim();
  if (!message) {
    return false;
  }

  if (announcement.expiresAt) {
    const expiresMs = Date.parse(announcement.expiresAt);
    if (Number.isNaN(expiresMs) || expiresMs <= nowMs) {
      return false;
    }
  }

  return true;
};

/**
 * 未知 JSON を SiteAnnouncement に正規化する。
 *
 * Args:
 *   value: パース済み JSON。
 *
 * Returns:
 *   正規化済みお知らせ。不正時は無効状態。
 */
export const normalizeSiteAnnouncement = (value: unknown): SiteAnnouncement => {
  if (!value || typeof value !== "object") {
    return DISABLED_ANNOUNCEMENT();
  }

  const record = value as Record<string, unknown>;
  const message =
    typeof record.message === "string" ? record.message.trim() : "";
  const updatedAt =
    typeof record.updatedAt === "string" &&
    !Number.isNaN(Date.parse(record.updatedAt))
      ? record.updatedAt
      : new Date().toISOString();

  let expiresAt: string | null = null;
  if (typeof record.expiresAt === "string" && record.expiresAt.length > 0) {
    expiresAt = Number.isNaN(Date.parse(record.expiresAt))
      ? null
      : record.expiresAt;
  }

  return {
    enabled: record.enabled === true,
    message,
    updatedAt,
    expiresAt,
  };
};

type ParseWriteBodyResult =
  | { ok: true; enabled: boolean; message: string; expiresAt: string | null }
  | { ok: false; reason: string; detail: string };

/**
 * PUT ボディを検証する。
 *
 * Args:
 *   value: パース済み JSON。
 *
 * Returns:
 *   検証結果。
 */
export const parseAnnouncementWriteBody = (
  value: unknown,
): ParseWriteBodyResult => {
  if (!value || typeof value !== "object") {
    return {
      ok: false,
      reason: "invalid_json",
      detail: "Request body must be a JSON object",
    };
  }

  const record = value as Record<string, unknown>;

  if (typeof record.enabled !== "boolean") {
    return {
      ok: false,
      reason: "invalid_enabled",
      detail: "Field enabled must be a boolean",
    };
  }

  if (typeof record.message !== "string") {
    return {
      ok: false,
      reason: "invalid_message",
      detail: "Field message must be a string",
    };
  }

  const message = record.message.trim();
  if (message.length > ANNOUNCEMENT_MESSAGE_MAX_LENGTH) {
    return {
      ok: false,
      reason: "message_too_long",
      detail: `message must be at most ${ANNOUNCEMENT_MESSAGE_MAX_LENGTH} characters`,
    };
  }

  let expiresAt: string | null = null;
  if (record.expiresAt === null || record.expiresAt === "") {
    expiresAt = null;
  } else if (typeof record.expiresAt === "string") {
    if (Number.isNaN(Date.parse(record.expiresAt))) {
      return {
        ok: false,
        reason: "invalid_expires_at",
        detail: "Field expiresAt must be an ISO 8601 datetime or null",
      };
    }
    expiresAt = new Date(record.expiresAt).toISOString();
  } else if (record.expiresAt !== undefined) {
    return {
      ok: false,
      reason: "invalid_expires_at",
      detail: "Field expiresAt must be an ISO 8601 datetime or null",
    };
  }

  return {
    ok: true,
    enabled: record.enabled,
    message,
    expiresAt,
  };
};

/**
 * 書き込み用フィールドから保存用ペイロードを組み立てる。
 *
 * Args:
 *   enabled: 表示フラグ。
 *   message: 本文。
 *   expiresAt: 期限（ISO）または null。
 *
 * Returns:
 *   保存用お知らせ。
 */
export const buildSiteAnnouncement = (
  enabled: boolean,
  message: string,
  expiresAt: string | null,
): SiteAnnouncement => ({
  enabled,
  message,
  updatedAt: new Date().toISOString(),
  expiresAt,
});

/**
 * R2 未登録時のデフォルトお知らせ。
 *
 * Returns:
 *   無効なお知らせ。
 */
export const createDisabledAnnouncement = (): SiteAnnouncement =>
  DISABLED_ANNOUNCEMENT();
