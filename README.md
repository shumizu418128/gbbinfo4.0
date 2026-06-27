# GBBINFO4.0

gbbinfo3.0 の Flask/Jinja 実装を、Render.com（Docker）上の **Astro 静的サイト（SSG）** へ置き換える実装リポジトリです。

## 技術スタック

- **フレームワーク**: Astro 7（`output: "static"`）
- **UI**: React 19（インタラクティブ部分のみ island として利用）
- **スタイル**: Tailwind CSS 4
- **i18n**: inlang + Paraglide JS（`messages/` → `paraglide/`）
- **DB**: Supabase Postgres + Drizzle ORM
- **本番配信**: nginx（Docker イメージ内で静的ファイルを配信）
- **静的アセット**: Cloudflare R2（本番）/ `public/`（ローカル）
- **Node.js**: 24.x（`.nvmrc` 参照）

## 実装方針

- 言語状態は URL のみ（`/{lang}/...`）、cookie / session は不使用
- 対応言語: `ja`（デフォルト）, `ko`, `en`, `de`（`src/constants/languageLabels.ts` が正）
- ビルド時（SSG）に Supabase Postgres へ接続し、全ページを静的 HTML として生成
- DB アクセスは `src/db/` 層（Drizzle ORM）を経由
- ページは Astro（`.astro`）、本文 UI は React コンポーネント（`src/views/`）に分離

## 主なディレクトリ

| パス | 説明 |
|------|------|
| `src/pages/` | Astro ルート（`[lang]/` プレフィックス、`getStaticPaths` で SSG） |
| `src/views/` | 各ページの React コンテンツコンポーネント |
| `src/components/` | 共通 UI（Astro / React） |
| `src/layouts/` | ページレイアウト（`SiteFrame.astro` など） |
| `src/db/` | DB アクセス層（Drizzle ORM） |
| `src/middleware.ts` | SSG ビルド時の Paraglide ロケール設定 |
| `messages/` | 翻訳 JSON（inlang ソース） |
| `paraglide/` | Paraglide 生成物（編集しない） |
| `shared/` | ページ・スクリプト共通の定数・型 |
| `scripts/` | ロケール同期・Tavily 同期などの補助スクリプト |
| `docs/DATABASE.md` | データベーススキーマ |
| `public/` | ローカル開発用の静的アセット（本番は Cloudflare R2 から配信） |

## 開発コマンド

```bash
# 依存関係のインストール
npm install

# ローカル開発（locales 同期 → astro dev）
npm run dev

# 本番ビルド（locales 同期 → astro build）
npm run build

# ビルド成果物のプレビュー
npm run preview

# 型チェック
npm run typecheck
```

### 補助スクリプト

```bash
# languageLabels.ts → project.inlang/settings.json へロケールを同期（dev / build で自動実行）
npm run sync:locales

# Tavily 検索結果を Supabase へ upsert（要 DATABASE_URL, Tavily / DeepL API キー）
npm run sync:tavily

# Supabase Tavily テーブル → ローカルキャッシュ（.cache/tavily/）へダウンロード
npm run sync:tavily:cache
```

## デプロイ（Render.com）

1. [Render Dashboard](https://dashboard.render.com/) で **New → Web Service** から本リポジトリを接続
2. **Runtime** で **Docker** を選択（[`Dockerfile`](Dockerfile) が使用されます）
3. **Environment**（または Docker build args）に `DATABASE_URL` と `VITE_ASSET_BASE_URL` を設定
4. main ブランチへの push で自動デプロイ

ビルドステージで `npm run build` が実行され、Supabase からデータを取得して静的 HTML を生成します。ランタイムは nginx が `dist/` を配信します（ポート 80）。

## 環境変数

| 変数名 | 説明 |
|--------|------|
| `DATABASE_URL` | Supabase Postgres の接続文字列（SSG ビルド時に必須） |
| `DEPLOY_ENV` | 実行環境（例: `development`） |
| `VITE_ASSET_BASE_URL` | Cloudflare R2 の r2.dev 公開 URL（本番ビルド必須。未設定時はローカル `public/` を参照） |

`.env.example` を `.env` にコピーし、Supabase Dashboard → Connect → Shared Pooler → Transaction mode の URI を設定してください。
