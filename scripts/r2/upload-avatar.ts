/*
 * 本番 Cloudflare Pages の /avatar/upload へアバター画像をアップロードする。
 *
 * Usage:
 *   npm run r2:upload-avatar -- --name SHAH --file ./avatar.jpg
 *
 * 環境変数:
 *   AVATAR_UPLOAD_SECRET（必須）
 *   PUBLIC_ASSET_BASE_URL（省略時: https://gbbinfo-assets.pages.dev）
 */

import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { loadDotEnv } from "../lib/load-dotenv.ts";

const DEFAULT_ASSET_BASE_URL = "https://gbbinfo-assets.pages.dev";

type UploadArgs = {
  name: string;
  filePath: string;
};

/**
 * CLI 引数から name と file パスを取得する。
 *
 * Returns:
 *   パース済み引数。
 *
 * Raises:
 *   Error: 必須引数が不足しているとき。
 */
const parseArgs = (): UploadArgs => {
  const args = process.argv.slice(2);
  let name: string | undefined;
  let filePath: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--name" && args[i + 1]) {
      name = args[++i];
      continue;
    }
    if (arg === "--file" && args[i + 1]) {
      filePath = args[++i];
    }
  }

  if (!name || !filePath) {
    throw new Error(
      "Usage: npm run r2:upload-avatar -- --name SHAH --file ./avatar.jpg",
    );
  }

  return { name, filePath };
};

/**
 * アップロード API を呼び出す。
 *
 * Args:
 *   baseUrl: Cloudflare Pages のベース URL。
 *   secret: Bearer トークン。
 *   name: 出場者名。
 *   filePath: ローカル画像パス。
 *
 * Raises:
 *   Error: API が失敗したとき。
 */
const uploadAvatar = async (
  baseUrl: string,
  secret: string,
  name: string,
  filePath: string,
): Promise<void> => {
  const fileBuffer = readFileSync(filePath);
  const formData = new FormData();
  formData.append("name", name);
  formData.append(
    "file",
    new Blob([fileBuffer]),
    basename(filePath),
  );

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/avatar/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
    },
    body: formData,
  });

  const rawBody = await response.text();
  let body: {
    ok?: boolean;
    reason?: string;
    detail?: string;
    r2Key?: string;
    contentType?: string;
    size?: number;
  } = {};

  if (rawBody) {
    try {
      body = JSON.parse(rawBody) as typeof body;
    } catch {
      body = { detail: rawBody };
    }
  }

  if (!response.ok) {
    throw new Error(
      `Upload failed (${response.status}): ${body.reason ?? "unknown"} — ${body.detail ?? response.statusText}`,
    );
  }

  console.log("Upload succeeded:", body);
};

loadDotEnv();

const { name, filePath } = parseArgs();
const secret = process.env.AVATAR_UPLOAD_SECRET;
if (!secret) {
  throw new Error("AVATAR_UPLOAD_SECRET is required in .env");
}

const baseUrl =
  process.env.PUBLIC_ASSET_BASE_URL?.trim() || DEFAULT_ASSET_BASE_URL;

await uploadAvatar(baseUrl, secret, name, filePath);
