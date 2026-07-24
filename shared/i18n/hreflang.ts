/**
 * URL / inlang ロケールキー → HTML / sitemap 用 hreflang。
 * キーはパス用のまま、値だけ英字とハイフンに正規化する。
 * `_` 付き値は @astrojs/sitemap のバリデーションで弾かれ、sitemap 全体がスキップされる。
 */
export const sitemapHreflangByLocale: Readonly<Record<string, string>> = {
  zh_Hans_CN: "zh-CN",
  zh_Hant_TW: "zh-TW",
};

/**
 * ロケールを sitemap / HTML hreflang 用の値へ変換する。
 * マップに無いロケールはそのまま返す。
 *
 * Args:
 *   locale: URL / inlang ロケールキー。
 *
 * Returns:
 *   hreflang 属性・sitemap i18n 用の値。
 */
export const toSitemapHreflang = (locale: string): string =>
  sitemapHreflangByLocale[locale] ?? locale;
