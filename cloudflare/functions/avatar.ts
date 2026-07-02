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
 *   画像 Response。取得失敗時は null。
 */
const resolveAvatarResponse = async (
  env: AvatarEnv,
  name: string,
  fetchRequest: NonNullable<ReturnType<typeof parseAvatarFetchRequest>> | null,
  videoId: string | null,
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
  if (!image) {
    return null;
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
  const name = parseAvatarName(url.searchParams.get("name"));

  if (!name) {
    return new Response("Bad Request", { status: 400 });
  }

  const fetchRequest = parseAvatarFetchRequest(
    url.searchParams.get("platform"),
    url.searchParams.get("url"),
    url.searchParams.get("method"),
  );

  const response = await resolveAvatarResponse(
    context.env,
    name,
    fetchRequest,
    url.searchParams.get("videoId"),
  );

  if (!response) {
    return new Response("Not Found", { status: 404 });
  }

  return response;
};
