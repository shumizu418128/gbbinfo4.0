import { isAllowedAvatarRequestOrigin } from "../../shared/avatar/allowed-origins.js";
import { buildAvatarR2Key } from "../../shared/avatar/r2-key.js";
import {
  parseAvatarFetchRequest,
  parseAvatarName,
} from "../../shared/avatar/validate.js";
import { fetchAvatarImage } from "../lib/fetch-avatar.js";

const CACHE_CONTROL = "public, max-age=31536000, immutable";

type AvatarEnv = {
  AVATAR_CACHE: R2Bucket;
};

type AvatarErrorContext = {
  name?: string;
  platform?: string | null;
  method?: string | null;
  sourceUrl?: string | null;
  videoId?: string | null;
};

type AvatarErrorPayload = {
  reason: string;
  detail: string;
} & AvatarErrorContext;

/**
 * アバター取得失敗を Workers ログへ出力する。
 *
 * Args:
 *   payload: エラー内容とリクエスト文脈。
 */
const logAvatarError = (payload: AvatarErrorPayload): void => {
  console.error("[avatar]", payload);
};

/**
 * エラーをログ出力し、クライアント向けレスポンスを返す。
 *
 * debug=1 のときは JSON、通常時は空 body + 診断ヘッダー。
 * `<img>` でも DevTools の Network → Headers で確認できる。
 *
 * Args:
 *   payload: エラー内容とリクエスト文脈。
 *   status: HTTP ステータス。
 *   debug: debug=1 指定時。
 *
 * Returns:
 *   エラーレスポンス。
 */
const toAvatarErrorResponse = (
  payload: AvatarErrorPayload,
  status = 404,
  debug = false,
): Response => {
  logAvatarError(payload);

  const headers = new Headers({
    "Cache-Control": "no-store",
    "X-Avatar-Error-Reason": payload.reason,
    "X-Avatar-Error-Detail": payload.detail.slice(0, 512),
  });

  if (debug) {
    headers.set("Content-Type", "application/json; charset=utf-8");
    return new Response(JSON.stringify(payload), { status, headers });
  }

  return new Response(null, { status, headers });
};

/**
 * R2 キャッシュから画像 Response を組み立てる。
 *
 * Args:
 *   cached: R2 オブジェクト。
 *
 * Returns:
 *   画像 Response。
 */
const toCachedResponse = (cached: R2ObjectBody): Response => {
  const headers = new Headers();
  headers.set("Cache-Control", CACHE_CONTROL);
  cached.writeHttpMetadata(headers);
  headers.set("etag", cached.httpEtag);
  return new Response(cached.body, { headers });
};

/**
 * R2 または上流から取得した画像を返す。
 *
 * キャッシュキーは出場者名のみ。Tavily 結果が変わっても既存画像を返す。
 *
 * Args:
 *   env: R2 binding。
 *   name: 正規化済み出場者名。
 *   fetchRequest: 初回取得用パラメータ。キャッシュミス時のみ使用。
 *   videoId: YouTube 動画 ID（任意）。
 *
 * Returns:
 *   画像 Response または null（fetch パラメータ不足時）。
 */
const resolveAvatarResponse = async (
  env: AvatarEnv,
  name: string,
  fetchRequest: NonNullable<ReturnType<typeof parseAvatarFetchRequest>> | null,
  videoId: string | null,
  debug: boolean,
): Promise<Response | null> => {
  const r2Key = buildAvatarR2Key(name);

  const cached = await env.AVATAR_CACHE.get(r2Key);
  if (cached) {
    return toCachedResponse(cached);
  }

  if (!fetchRequest) {
    return null;
  }

  const image = await fetchAvatarImage(
    fetchRequest.platform,
    fetchRequest.method,
    fetchRequest.sourceUrl,
    videoId,
  );
  if (!image.ok) {
    return toAvatarErrorResponse(
      {
        reason: image.reason,
        detail: image.detail,
        name,
        platform: fetchRequest.platform,
        method: fetchRequest.method,
        sourceUrl: fetchRequest.sourceUrl,
        videoId,
      },
      404,
      debug,
    );
  }

  await env.AVATAR_CACHE.put(r2Key, image.bytes, {
    httpMetadata: {
      contentType: image.contentType,
      cacheControl: CACHE_CONTROL,
    },
  });

  return new Response(image.bytes, {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": CACHE_CONTROL,
    },
  });
};

export const onRequestGet: PagesFunction<AvatarEnv> = async (context) => {
  const url = new URL(context.request.url);
  const debug = url.searchParams.get("debug") === "1";

  if (!debug && !isAllowedAvatarRequestOrigin(context.request)) {
    console.error("[avatar]", {
      reason: "forbidden_origin",
      detail: "Origin/Referer not in allowlist",
      origin: context.request.headers.get("Origin"),
      referer: context.request.headers.get("Referer"),
    });
    return new Response("Forbidden", { status: 403 });
  }

  const name = parseAvatarName(url.searchParams.get("name"));

  const platform = url.searchParams.get("platform");
  const sourceUrl = url.searchParams.get("url");
  const method = url.searchParams.get("method");
  const videoId = url.searchParams.get("videoId");

  console.log("[avatar]", {
    event: "request",
    name,
    platform,
    method,
    sourceUrl,
    videoId,
    debug,
  });

  if (!name) {
    return toAvatarErrorResponse(
      {
        reason: "invalid_name",
        detail: "Query parameter name is missing or invalid",
        platform,
        method,
        sourceUrl,
        videoId,
      },
      400,
      debug,
    );
  }

  const fetchRequest = parseAvatarFetchRequest(platform, sourceUrl, method);

  const response = await resolveAvatarResponse(
    context.env,
    name,
    fetchRequest,
    videoId,
    debug,
  );

  if (!response) {
    if (!platform || !sourceUrl || !method) {
      return toAvatarErrorResponse(
        {
          reason: "cache_miss_missing_fetch_params",
          detail:
            "R2 cache miss requires platform, url, and method query parameters",
          name,
          platform,
          method,
          sourceUrl,
          videoId,
        },
        404,
        debug,
      );
    }

    return toAvatarErrorResponse(
      {
        reason: "cache_miss_invalid_fetch_params",
        detail: `Invalid fetch params: platform=${platform} method=${method} url=${sourceUrl}`,
        name,
        platform,
        method,
        sourceUrl,
        videoId,
      },
      404,
      debug,
    );
  }

  return response;
};
