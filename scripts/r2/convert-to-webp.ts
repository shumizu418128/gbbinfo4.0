/*
 * R2 バケット内の非 WebP 画像を WebP に変換して同一キーで上書きする。
 *
 * Usage:
 *   npm run r2:convert-webp
 *
 * 環境変数:
 *   CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY
 *   R2_BUCKET_NAME（省略時: gbbinfo-avatar-cache）
 */

import {
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  type S3Client,
} from "@aws-sdk/client-s3";
import { AVATAR_CACHE_CONTROL } from "../../shared/avatar/constants.ts";
import sharp from "sharp";
import { loadDotEnv } from "../lib/load-dotenv.ts";
import { loadR2ClientFromEnv } from "./lib/client.ts";

const WEBP_CONTENT_TYPE = "image/webp";
const WEBP_QUALITY = 80;

type ConvertStats = {
  converted: number;
  skipped: number;
  failed: number;
};

/**
 * Content-Type が WebP かどうか判定する。
 *
 * Args:
 *   contentType: オブジェクトの Content-Type。
 *
 * Returns:
 *   WebP なら true。
 */
const isWebpContentType = (contentType: string | undefined): boolean =>
  (contentType?.toLowerCase().startsWith(WEBP_CONTENT_TYPE) ?? false);

type SdkStreamBody = {
  transformToByteArray: () => Promise<Uint8Array>;
};

/**
 * S3 GetObject の Body を Buffer に変換する。
 *
 * Args:
 *   body: GetObject のレスポンス Body。
 *
 * Returns:
 *   画像バイナリ。
 *
 * Raises:
 *   Error: Body が空または未対応形式のとき。
 */
const toBuffer = async (body: unknown): Promise<Buffer> => {
  if (!body) {
    throw new Error("Empty object body");
  }

  if (body instanceof Uint8Array) {
    return Buffer.from(body);
  }

  if (
    typeof body === "object" &&
    "transformToByteArray" in body &&
    typeof (body as SdkStreamBody).transformToByteArray === "function"
  ) {
    const bytes = await (body as SdkStreamBody).transformToByteArray();
    return Buffer.from(bytes);
  }

  throw new Error("Unsupported object body type");
};

/**
 * バケット内の全オブジェクトキーを列挙する。
 *
 * Args:
 *   client: R2 クライアント。
 *   bucketName: 対象バケット名。
 *
 * Returns:
 *   オブジェクトキーの配列。
 */
const listAllObjectKeys = async (
  client: S3Client,
  bucketName: string,
): Promise<string[]> => {
  const keys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        ContinuationToken: continuationToken,
      }),
    );

    for (const object of response.Contents ?? []) {
      if (object.Key) {
        keys.push(object.Key);
      }
    }

    continuationToken = response.IsTruncated
      ? response.NextContinuationToken
      : undefined;
  } while (continuationToken);

  return keys;
};

/**
 * 1 オブジェクトを WebP に変換して上書きする。
 *
 * Args:
 *   client: R2 クライアント。
 *   bucketName: 対象バケット名。
 *   key: オブジェクトキー。
 *
 * Returns:
 *   `"converted"` | `"skipped"` | `"failed"`。
 */
const convertObjectToWebp = async (
  client: S3Client,
  bucketName: string,
  key: string,
): Promise<"converted" | "skipped" | "failed"> => {
  try {
    const head = await client.send(
      new HeadObjectCommand({ Bucket: bucketName, Key: key }),
    );

    if (isWebpContentType(head.ContentType)) {
      return "skipped";
    }

    const getResponse = await client.send(
      new GetObjectCommand({ Bucket: bucketName, Key: key }),
    );
    const sourceBuffer = await toBuffer(getResponse.Body);
    const webpBuffer = await sharp(sourceBuffer)
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: webpBuffer,
        ContentType: WEBP_CONTENT_TYPE,
        CacheControl: head.CacheControl ?? AVATAR_CACHE_CONTROL,
      }),
    );

    console.log(`Converted: ${key}`);
    return "converted";
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed: ${key} — ${message}`);
    return "failed";
  }
};

const main = async (): Promise<void> => {
  loadDotEnv();

  const { client, bucketName } = loadR2ClientFromEnv();
  const keys = await listAllObjectKeys(client, bucketName);

  console.log(`Bucket: ${bucketName}`);
  console.log(`Objects: ${keys.length}`);

  const stats: ConvertStats = {
    converted: 0,
    skipped: 0,
    failed: 0,
  };

  for (const key of keys) {
    const result = await convertObjectToWebp(client, bucketName, key);
    if (result === "converted") {
      stats.converted += 1;
    } else if (result === "skipped") {
      stats.skipped += 1;
    } else {
      stats.failed += 1;
    }
  }

  console.log(
    `Done — converted: ${stats.converted}, skipped: ${stats.skipped}, failed: ${stats.failed}`,
  );

  if (stats.failed > 0) {
    process.exitCode = 1;
  }
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
