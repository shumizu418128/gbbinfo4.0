import { paraglideVitePlugin } from "@inlang/paraglide-js";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

// .env のサーバー専用変数（VITE_ 接頭辞なし）をビルド時の process.env に展開する。
// これらは getStaticPaths など SSG ビルド時のみで参照され、クライアントには出力されない。
const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");
process.env.DATABASE_URL = process.env.DATABASE_URL ?? env.DATABASE_URL;
process.env.DEPLOY_ENV = process.env.DEPLOY_ENV ?? env.DEPLOY_ENV;

// https://astro.build/config
export default defineConfig({
  output: "static",
  integrations: [react()],
  vite: {
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
