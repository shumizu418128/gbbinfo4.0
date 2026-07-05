import { AVATAR_CACHE_CONTROL } from "../../../shared/avatar/constants.js";
import { resolveImageContentType } from "../../../shared/avatar/detect-image-type.js";
import { buildAvatarR2Key } from "../../../shared/avatar/r2-key.js";
import { isAuthorizedAvatarUpload } from "../../../shared/avatar/upload-auth.js";
import { parseAvatarName } from "../../../shared/avatar/validate.js";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

type AvatarUploadEnv = {
  AVATAR_CACHE: R2Bucket;
  AVATAR_UPLOAD_SECRET?: string;
};

type AvatarUploadSuccess = {
  ok: true;
  name: string;
  r2Key: string;
  contentType: string;
  size: number;
};

type AvatarUploadError = {
  ok: false;
  reason: string;
  detail: string;
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
  const payload: AvatarUploadError = { ok: false, reason, detail };
  console.error("[avatar-upload]", payload);
  return Response.json(payload, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
};

export const onRequestPost: PagesFunction<AvatarUploadEnv> = async (context) => {
  const secret = context.env.AVATAR_UPLOAD_SECRET;
  if (!secret) {
    return new Response(null, { status: 404 });
  }

  if (!isAuthorizedAvatarUpload(context.request, secret)) {
    return new Response("Forbidden", { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await context.request.formData();
  } catch {
    return toErrorResponse(
      "invalid_form_data",
      "Request body must be multipart/form-data",
      400,
    );
  }

  const rawName = formData.get("name");
  const name =
    typeof rawName === "string" ? parseAvatarName(rawName) : null;
  if (!name) {
    return toErrorResponse(
      "invalid_name",
      "Form field name is missing or invalid",
      400,
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return toErrorResponse(
      "invalid_file",
      "Form field file must be an image file",
      400,
    );
  }

  if (file.size === 0) {
    return toErrorResponse("empty_file", "Uploaded file is empty", 400);
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return toErrorResponse(
      "file_too_large",
      `Uploaded file exceeds ${MAX_UPLOAD_BYTES} bytes`,
      413,
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const contentType = resolveImageContentType(bytes, file.type || null);
  if (!contentType) {
    return toErrorResponse(
      "invalid_content_type",
      "Uploaded file is not a supported image (jpeg, png, webp, gif)",
      400,
    );
  }

  const r2Key = buildAvatarR2Key(name);

  await context.env.AVATAR_CACHE.put(r2Key, bytes, {
    httpMetadata: {
      contentType,
      cacheControl: AVATAR_CACHE_CONTROL,
    },
  });

  const payload: AvatarUploadSuccess = {
    ok: true,
    name,
    r2Key,
    contentType,
    size: bytes.byteLength,
  };

  console.log("[avatar-upload]", {
    event: "uploaded",
    name,
    r2Key,
    contentType,
    size: bytes.byteLength,
  });

  return Response.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
};
