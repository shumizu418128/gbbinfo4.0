const SNS_FETCH_USER_AGENT =
  "Mozilla/5.0 (compatible; GBBinfoBot/1.0; +https://gbbinfo.com)";

export type ImageFetchResult =
  | { ok: true; bytes: ArrayBuffer; contentType: string }
  | { ok: false; reason: string; detail: string };

export type OgImageFetchResult =
  | { ok: true; imageUrl: string }
  | { ok: false; reason: string; detail: string };

/**
 * HTML から og:image の URL を抽出する。
 *
 * Args:
 *   html: ページ HTML。
 *
 * Returns:
 *   画像 URL。見つからなければ null。
 */
export const extractOgImageUrl = (html: string): string | null => {
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1].replace(/&amp;/g, "&");
    }
  }

  return null;
};

/**
 * SNS アカウントページから og:image URL を解決する。
 *
 * Args:
 *   accountUrl: SNS アカウント URL。
 *
 * Returns:
 *   画像 URL または失敗理由。
 */
export const fetchOgImageUrl = async (
  accountUrl: string,
): Promise<OgImageFetchResult> => {
  try {
    const response = await fetch(accountUrl, {
      headers: {
        Accept: "text/html",
        "User-Agent": SNS_FETCH_USER_AGENT,
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return {
        ok: false,
        reason: "og_page_http_error",
        detail: `GET ${accountUrl} returned HTTP ${response.status}`,
      };
    }

    const html = await response.text();
    const imageUrl = extractOgImageUrl(html);
    if (!imageUrl) {
      return {
        ok: false,
        reason: "og_image_not_found",
        detail: `og:image not found in HTML from ${accountUrl}`,
      };
    }

    return { ok: true, imageUrl };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const reason = message.includes("timeout")
      ? "og_page_fetch_timeout"
      : "og_page_fetch_failed";
    return {
      ok: false,
      reason,
      detail: `GET ${accountUrl}: ${message}`,
    };
  }
};

/**
 * 画像 URL からバイナリと Content-Type を取得する。
 *
 * Args:
 *   imageUrl: 画像 URL。
 *
 * Returns:
 *   画像データまたは失敗理由。
 */
export const fetchImageBytes = async (
  imageUrl: string,
): Promise<ImageFetchResult> => {
  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": SNS_FETCH_USER_AGENT,
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return {
        ok: false,
        reason: "upstream_http_error",
        detail: `GET ${imageUrl} returned HTTP ${response.status}`,
      };
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    if (!contentType.startsWith("image/")) {
      return {
        ok: false,
        reason: "invalid_content_type",
        detail: `GET ${imageUrl} returned Content-Type: ${contentType}`,
      };
    }

    return {
      ok: true,
      bytes: await response.arrayBuffer(),
      contentType,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const reason = message.includes("timeout")
      ? "upstream_fetch_timeout"
      : "upstream_fetch_failed";
    return {
      ok: false,
      reason,
      detail: `GET ${imageUrl}: ${message}`,
    };
  }
};
