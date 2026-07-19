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
      const body = [
        "User-agent: *",
        "Allow: /",
        "",
        `Sitemap: ${siteUrl}/sitemap-index.xml`,
        "",
      ].join("\n");
      await fs.writeFile(new URL("robots.txt", dir), body, "utf8");
    },
  },
});
