# AGENTS.md

## Cursor Cloud specific instructions

GBBINFO4.0 は Astro 7（`output: "static"` / SSG）の多言語情報サイト。データは Supabase Postgres が唯一のソースで、ビルド時に `.cache/build/snapshot.json` へ取り込んでから静的生成する。コマンド一覧は `README.md` と `docs/BUILD_AND_SYNC.md` を参照（重複記載しない）。

### Node バージョン（重要・非自明）
- 本リポジトリは Node **>=24 <25**（`.nvmrc` = `24.10.0`、`.npmrc` の `engine-strict=true` により不一致だと `npm install` が失敗する）。
- ベースイメージの `/exec-daemon/node` は v22 で、PATH 上で nvm より優先されるため素の `node` が v22 になりうる。対策として v24.10.0 を nvm で導入し、`/usr/local/cargo/bin`（PATH 先頭かつ書き込み可）に `node`/`npm`/`npx` の symlink を張って解決済み（VM スナップショットに永続）。`node -v` が v22 を返す場合はこの symlink を張り直すこと。

### サービスと起動（非自明な注意点）
- **Astro dev（メインプロダクト）**: `npm run dev` → http://localhost:4321 。内部で `sync:build-cache -- --skip` を実行するため **DB に接続せず、既存の `.cache/build/snapshot.json` を再利用**する。
  - 新規チェックアウトでは snapshot が無いため、コンテンツページ（`/{lang}/{year}/...`）は `DATABASE_URL is required` で 500 になる。ルート `/`（クライアント側リダイレクト）のみデータ無しで描画可能。
  - 実データを描画するには `.env` の `DATABASE_URL`（Supabase Shared Pooler / Transaction mode, port 6543）を設定し、一度 `npm run sync:build-cache` を実行して snapshot を作る（または dev の DB フォールバックが同 URL を使う）。
- **本番ビルド**: ローカルの `npm run build` は常に `sync:build-cache`（全年 bulk SELECT）を走らせるため `DATABASE_URL` が必須。本番デプロイは GHA（`.github/workflows/deploy-site.yml`）がビルドして GHCR へ push し、Render は nginx イメージを配信する。`main` では不足 Tavily も GHA で作成する。
- **画像アセット**: `PUBLIC_ASSET_BASE_URL`（dev/build 双方で必須）。既定値は `.env.example` の Cloudflare Pages 公開 URL を使う。オフラインで使う場合のみ `npm run assets:dev`（Cloudflare Pages エミュレータ, http://localhost:8788）を併走。
- **型チェック**: `npm run typecheck`（`astro check`）。未使用変数などは hint 扱いで 0 errors なら成功。
