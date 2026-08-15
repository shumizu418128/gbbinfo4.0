import {
  ANNOUNCEMENT_CACHE_CONTROL,
  ANNOUNCEMENT_R2_KEY,
} from "../../shared/announcement/constants.js";
import {
  buildSiteAnnouncement,
  createDisabledAnnouncement,
  normalizeSiteAnnouncement,
  parseAnnouncementWriteBody,
} from "../../shared/announcement/schema.js";
import type {
  SiteAnnouncement,
  SiteAnnouncementWriteError,
  SiteAnnouncementWriteSuccess,
} from "../../shared/announcement/types.js";
import { isAuthorizedBearer } from "../../shared/http/bearer-auth.js";

type AnnouncementEnv = {
  AVATAR_CACHE: R2Bucket;
  ANNOUNCEMENT_API_KEY?: string;
};

/**
 * 公開 JSON 用の共通ヘッダーを付与する。
 *
 * Args:
 *   headers: 設定対象 Headers。
 */
const setPublicCorsAndCache = (headers: Headers): void => {
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
  headers.set("Cache-Control", ANNOUNCEMENT_CACHE_CONTROL);
  headers.set("CDN-Cache-Control", ANNOUNCEMENT_CACHE_CONTROL);
  headers.set("Content-Type", "application/json; charset=utf-8");
};

/**
 * R2 からお知らせを読み取る。未登録時は無効状態を返す。
 *
 * Args:
 *   bucket: R2 バケット。
 *
 * Returns:
 *   お知らせペイロード。
 */
const readAnnouncement = async (
  bucket: R2Bucket,
): Promise<SiteAnnouncement> => {
  const object = await bucket.get(ANNOUNCEMENT_R2_KEY);
  if (!object) {
    return createDisabledAnnouncement();
  }

  try {
    const json: unknown = await object.json();
    return normalizeSiteAnnouncement(json);
  } catch {
    return createDisabledAnnouncement();
  }
};

/**
 * お知らせを R2 に保存する。
 *
 * Args:
 *   bucket: R2 バケット。
 *   announcement: 保存内容。
 */
const writeAnnouncement = async (
  bucket: R2Bucket,
  announcement: SiteAnnouncement,
): Promise<void> => {
  await bucket.put(ANNOUNCEMENT_R2_KEY, JSON.stringify(announcement), {
    httpMetadata: {
      contentType: "application/json; charset=utf-8",
      cacheControl: ANNOUNCEMENT_CACHE_CONTROL,
    },
  });
};

/**
 * JSON エラーレスポンスを返す。
 *
 * Args:
 *   reason: エラー識別子。
 *   detail: 詳細メッセージ。
 *   status: HTTP ステータス。
 *
 * Returns:
 *   JSON エラーレスポンス。
 */
const toErrorResponse = (
  reason: string,
  detail: string,
  status: number,
): Response => {
  const payload: SiteAnnouncementWriteError = { ok: false, reason, detail };
  console.error("[announcement]", payload);
  return Response.json(payload, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
};

export const onRequestOptions: PagesFunction<AnnouncementEnv> = async () => {
  const headers = new Headers();
  setPublicCorsAndCache(headers);
  headers.set("Cache-Control", "no-store");
  headers.delete("CDN-Cache-Control");
  return new Response(null, { status: 204, headers });
};

export const onRequestGet: PagesFunction<AnnouncementEnv> = async (context) => {
  const announcement = await readAnnouncement(context.env.AVATAR_CACHE);
  const headers = new Headers();
  setPublicCorsAndCache(headers);
  return new Response(JSON.stringify(announcement), { headers });
};

export const onRequestPut: PagesFunction<AnnouncementEnv> = async (context) => {
  const apiKey = context.env.ANNOUNCEMENT_API_KEY;
  if (!apiKey) {
    return new Response(null, { status: 404 });
  }

  if (!isAuthorizedBearer(context.request, apiKey)) {
    return new Response("Forbidden", { status: 403 });
  }

  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return toErrorResponse(
      "invalid_json",
      "Request body must be valid JSON",
      400,
    );
  }

  const parsed = parseAnnouncementWriteBody(body);
  if (!parsed.ok) {
    return toErrorResponse(parsed.reason, parsed.detail, 400);
  }

  const announcement = buildSiteAnnouncement(
    parsed.enabled,
    parsed.message,
    parsed.expiresAt,
  );

  await writeAnnouncement(context.env.AVATAR_CACHE, announcement);

  const payload: SiteAnnouncementWriteSuccess = {
    ok: true,
    announcement,
  };

  console.log("[announcement]", {
    event: "updated",
    enabled: announcement.enabled,
    expiresAt: announcement.expiresAt,
    messageLength: announcement.message.length,
  });

  return Response.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
};
