import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Route } from "./+types/font.js";

const FONT_DIR = path.join(process.cwd(), "font");

const FONT_MIME_TYPES: Record<string, string> = {
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

const FONT_CACHE_CONTROL = "public, max-age=31536000, immutable";

/**
 * /font/* へ到達したリクエストに font/ 配下のファイルを返す。
 */
export const loader = async ({ params }: Route.LoaderArgs) => {
  const filename = params["*"];
  if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    throw new Response(null, { status: 404 });
  }

  const ext = path.extname(filename).toLowerCase();
  const contentType = FONT_MIME_TYPES[ext];
  if (!contentType) {
    throw new Response(null, { status: 404 });
  }

  const filePath = path.join(FONT_DIR, filename);

  try {
    const data = await readFile(filePath);
    return new Response(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": FONT_CACHE_CONTROL,
      },
    });
  } catch {
    throw new Response(null, { status: 404 });
  }
};
