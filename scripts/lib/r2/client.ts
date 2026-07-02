import { S3Client } from "@aws-sdk/client-s3";

/** wrangler.toml と一致するデフォルト R2 バケット名。 */
export const DEFAULT_R2_BUCKET_NAME = "gbbinfo-avatar-cache";

type R2ClientConfig = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
};

/**
 * Cloudflare R2 向け S3 互換クライアントを生成する。
 *
 * Args:
 *   config: アカウント ID と R2 API トークン。
 *
 * Returns:
 *   設定済み S3Client。
 */
export const createR2Client = (config: R2ClientConfig): S3Client =>
  new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

/**
 * 環境変数から R2 クライアントとバケット名を読み込む。
 *
 * Returns:
 *   S3Client と対象バケット名。
 *
 * Raises:
 *   Error: 必須環境変数が未設定のとき。
 */
export const loadR2ClientFromEnv = (): {
  client: S3Client;
  bucketName: string;
} => {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME ?? DEFAULT_R2_BUCKET_NAME;

  if (!accountId) {
    throw new Error("CLOUDFLARE_ACCOUNT_ID is required");
  }
  if (!accessKeyId) {
    throw new Error("R2_ACCESS_KEY_ID is required");
  }
  if (!secretAccessKey) {
    throw new Error("R2_SECRET_ACCESS_KEY is required");
  }

  return {
    client: createR2Client({ accountId, accessKeyId, secretAccessKey }),
    bucketName,
  };
};
