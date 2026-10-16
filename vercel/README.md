# サイト内検索 API（Vercel）

Astro 静的サイトから `POST /api/search` を呼び、Cloudflare Workers AI の Clef-flash でハブページを選ぶ。

## セットアップ

```bash
cd vercel
npm install
npx vercel link
npx vercel env add CLOUDFLARE_ACCOUNT_ID
npx vercel env add CLOUDFLARE_API_TOKEN
npx vercel env add GOOGLE_SHEET_CREDENTIALS
npx vercel env add GOOGLE_SHEETS_URL
```

Root Directory は `vercel` にする。`GOOGLE_SHEET_CREDENTIALS` は gbbinfo3.0 と同じサービスアカウント JSON（`type` / `project_id` / `private_key` / `client_email` 一式）を **1 行の JSON 文字列** として貼る。`GOOGLE_SHEETS_URL` はブック `gbbinfo` のドキュメント URL（`https://docs.google.com/spreadsheets/d/...`）をそのまま貼る。ログはシート `typesafe` へ追記する。`CLOUDFLARE_API_TOKEN` は **Workers AI Read** が必要で、Pages デプロイ用の Edit Cloudflare Workers トークンとは別に作る。無料枠はアカウント共有で 1 日 10,000 Neurons。

## 環境変数

| 変数 | 用途 |
|------|------|
| `CLOUDFLARE_ACCOUNT_ID` | Workers AI のアカウント ID |
| `CLOUDFLARE_API_TOKEN` | Workers AI Read 権限の API トークン |
| `SLACK_WEBHOOK_URL` | 日次 Neurons 上限の通知（Incoming Webhook） |
| `GOOGLE_SHEET_CREDENTIALS` | サービスアカウント JSON（3.0 と同じ） |
| `GOOGLE_SHEETS_URL` | スプレッドシートの URL。ID は URL から抽出する |
| `CORS_ORIGIN` | 追加許可オリジン（カンマ区切り） |

スプレッドシートはサービスアカウントのメールに編集者で共有する。シート `typesafe` の 1 行目は次のヘッダーを置く。

`timestamp | query | lang | year | path | confidence | status | error`

## ローカル

```bash
cd vercel
npx vercel dev --listen 3000
```

Astro 側は `PUBLIC_SEARCH_API_URL=http://localhost:3000`。

カタログ更新:

```bash
npm run sync:search-catalog
```
