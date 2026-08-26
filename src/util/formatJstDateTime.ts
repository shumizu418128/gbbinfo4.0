const JST_TIME_ZONE = "Asia/Tokyo";

/**
 * ISO 日時を日本時間（分まで）のロケール表記にする。
 *
 * Args:
 *   iso: ISO 8601 日時。
 *   locale: 表示言語（Paraglide のロケールコード）。
 *
 * Returns:
 *   整形済み日時。不正または epoch 以下なら null。
 */
export const formatJstDateTime = (
  iso: string,
  locale: string,
): string | null => {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms) || ms <= 0) {
    return null;
  }

  try {
    return new Intl.DateTimeFormat(locale.replaceAll("_", "-"), {
      timeZone: JST_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(new Date(ms));
  } catch {
    return null;
  }
};
