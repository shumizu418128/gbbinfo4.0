import fs from "node:fs/promises";

/**
 * ビルド成果物に robots.txt を書き出す Astro integration。
 * Sitemap URL はビルド時に解決した site を使う（Flask の request.host_url 相当を SSG で再現）。
 *
 * Args:
 *   siteUrl: 末尾スラッシュなしのサイト絶対 URL。
 *
 * Returns:
 *   Astro Integration。
 */
export const robotsTxt = (siteUrl) => ({
  name: "robots-txt",
  hooks: {
    "astro:build:done": async ({ dir }) => {
      // 出場者詳細（現行 /{lang}/participant/… と旧 /{lang}/participant_detail/…）は
      // クロール負荷の主因のためインデックス・巡回対象外とする。
      // /*/participants（年別一覧）は末尾 s があるためこの Disallow に含まれない。
      const body = [
        "User-agent: *",
        "Allow: /",
        "Disallow: /*/participant/",
        "Disallow: /*/participant_detail",
        "",
        "User-agent: GPTBot",
        "Disallow: /",
        "",
        "User-agent: CCBot",
        "Disallow: /",
        "User-agent: ClaudeBot",
        "Disallow: /",
        "User-agent: Bytespider",
        "Disallow: /",
        "User-agent: Amazonbot",
        "Disallow: /",
        "",
        `Sitemap: ${siteUrl}/sitemap-index.xml`,
        "",
      ].join("\n");
      await fs.writeFile(new URL("robots.txt", dir), body, "utf8");
    },
  },
});
