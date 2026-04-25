# GBBINFO4.0

gbbinfo3.0 の Flask/Jinja 実装を、Cloudflare Pages 前提の React Router Data APIs（Remix移行互換）へ置き換える実装リポジトリです。

## 実装方針

- 言語状態は URL のみ（`/{lang}/...`）、cookie/session は不使用
- DB は Supabase へ直接接続せず Hyperdrive 経由で接続
- サーバ責務を `services` 層に分離し、loader/action から利用
- world_map は Folium から JS 描画方式へ移行し、データは action で取得

## 主なディレクトリ

- `src/router.tsx`: 主要ルート、loader/action 定義
- `src/screens.tsx`: 各画面コンポーネント
- `src/services`: DBアクセス層・外部APIアダプタ
- `docs/migration-inventory.md`: gbbinfo3.0 のルート/環境変数棚卸し
- `public/`: `robots.txt`, `sitemap.xml`, `manifest.json`, `service-worker.js`

## 開発コマンド

```bash
npm run dev
npm run build
npm run cf:dev
npm run cf:deploy
```

## Hyperdrive設定

1. `wrangler.toml` の `[[hyperdrive]]` に binding/id を設定
2. `HYPERDRIVE` または `DATABASE_URL` を Worker 環境に設定
3. サーバ専用モジュール `src/services/hyperdrive.server.ts` で接続文字列を解決
