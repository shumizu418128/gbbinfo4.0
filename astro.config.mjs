import { paraglideVitePlugin } from "@inlang/paraglide-js";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { robotsTxt } from "./scripts/astro/robots-txt.mjs";
import inlangSettings from "./project.inlang/settings.json" with { type: "json" };

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// .env のサーバー専用変数（VITE_ 接頭辞なし）をビルド時の process.env に展開する。
// これらは getStaticPaths など SSG ビルド時のみで参照され、クライアントには出力されない。
const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");
process.env.DATABASE_URL = process.env.DATABASE_URL ?? env.DATABASE_URL;
process.env.DEPLOY_ENV = process.env.DEPLOY_ENV ?? env.DEPLOY_ENV;

/**
 * サイト絶対 URL を解決する。
 *
 * Flask は request.host_url で実行時にホストを取れたが、Astro SSG はビルド時に確定が必要。
 * 優先順: PUBLIC_SITE_URL（独自ドメイン上書き）→ RENDER_EXTERNAL_URL（Render 自動）→ 本番既定。
 *
 * Returns:
 *   末尾スラッシュなしの絶対 URL。
 */
const resolveSiteUrl = () => {
  const candidates = [
    process.env.PUBLIC_SITE_URL,
    env.PUBLIC_SITE_URL,
    process.env.RENDER_EXTERNAL_URL,
    env.RENDER_EXTERNAL_URL,
    "https://gbbinfo-jpn.onrender.com",
  ];
  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value.trim().replace(/\/+$/, "");
    }
  }
  return "https://gbbinfo-jpn.onrender.com";
};

const site = resolveSiteUrl();
process.env.PUBLIC_SITE_URL = site;

// languageLabels.ts → sync:locales → settings.json。sitemap の言語リストはここから取る。
const sitemapI18n = {
  defaultLocale: inlangSettings.baseLocale,
  locales: Object.fromEntries(
    inlangSettings.locales.map((locale) => [locale, locale]),
  ),
};

// https://astro.build/config
export default defineConfig({
  site,
  output: "static",
  trailingSlash: "never",
  integrations: [
    react(),
    sitemap({
      i18n: sitemapI18n,
      filter: (page) => {
        const normalized = page.replace(/\/+$/, "");
        const siteRoot = site.replace(/\/+$/, "");
        if (normalized === siteRoot) {
          return false;
        }
        if (normalized.endsWith("/404")) {
          return false;
        }
        // カテゴリ無しの index はリダイレクト専用のため除外
        if (/\/(participants|result)$/.test(normalized)) {
          return false;
        }
        return true;
      },
      serialize: (item) => {
        // 3.0 互換で末尾スラッシュ無しの URL に揃える
        item.url = item.url.replace(/\/+$/, "") || site;
        return item;
      },
    }),
    robotsTxt(site),
  ],
  vite: {
    resolve: {
      alias: {
        "@shared": path.join(rootDir, "shared"),
      },
    },
    plugins: [
      paraglideVitePlugin({
        project: "./project.inlang",
        outdir: "./paraglide",
        // SSG では setLocale() がビルド時にロケールを保持できるよう globalVariable を含める
        strategy: ["url", "globalVariable", "preferredLanguage", "baseLocale"],
      }),
      tailwindcss(),
    ],
  },
});
