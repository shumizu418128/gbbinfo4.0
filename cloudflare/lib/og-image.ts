const SNS_FETCH_USER_AGENT =
  "Mozilla/5.0 (compatible; GBBInfoBot/1.0; +https://gbbinfo.com)";

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
 *   画像 URL。取得失敗時は null。
 */
export const fetchOgImageUrl = async (
  accountUrl: string,
): Promise<string | null> => {
  try {
    const response = await fetch(accountUrl, {
      headers: {
        Accept: "text/html",
        "User-Agent": SNS_FETCH_USER_AGENT,
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    return extractOgImageUrl(html);
  } catch {
    return null;
  }
};

/**
 * 画像 URL からバイナリと Content-Type を取得する。
 *
 * Args:
 *   imageUrl: 画像 URL。
 *
 * Returns:
 *   画像データ。取得失敗時は null。
 */
export const fetchImageBytes = async (
  imageUrl: string,
): Promise<{ bytes: ArrayBuffer; contentType: string } | null> => {
  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": SNS_FETCH_USER_AGENT,
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    if (!contentType.startsWith("image/")) {
      return null;
    }

    return {
      bytes: await response.arrayBuffer(),
      contentType,
    };
  } catch {
    return null;
  }
};
