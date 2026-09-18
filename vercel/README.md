# サイト内検索 API（Vercel）

Astro 静的サイトから `POST /api/search` を呼び、TypeSafe（Jev）でハブページを選ぶ。

## セットアップ

```bash
cd vercel
npm install
npx vercel link
npx vercel env add TYPESAFE_API_KEY
npx vercel env add GOOGLE_SHEET_CREDENTIALS
npx vercel env add GOOGLE_SHEETS_URL
```

Root Directory は `vercel` にする。`GOOGLE_SHEET_CREDENTIALS` は gbbinfo3.0 と同じサービスアカウント JSON（`type` / `project_id` / `private_key` / `client_email` 一式）を **1 行の JSON 文字列** として貼る。`GOOGLE_SHEETS_URL` はブック `gbbinfo` のドキュメント URL（`https://docs.google.com/spreadsheets/d/...`）をそのまま貼る。ログはシート `typesafe` へ追記する。

## 環境変数

| 変数 | 用途 |
|------|------|
| `TYPESAFE_API_KEY` | TypeSafe API |
| `SLACK_WEBHOOK_URL` | クレジット切れ通知（Incoming Webhook） |
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
