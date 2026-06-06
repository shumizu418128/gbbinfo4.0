# GBBINFO4.0

gbbinfo3.0 の Flask/Jinja 実装を、Render.com（Docker）上の React Router Data APIs（Remix移行互換）Node サーバーへ置き換える実装リポジトリです。

## 実装方針

- 言語状態は URL のみ（`/{lang}/...`）、cookie/session は不使用
- DB は Neon Postgres へ `DATABASE_URL` で接続（pooled 接続文字列を推奨）
- loader/action から `app/db` 層を利用してデータ取得

## 主なディレクトリ

- `app/routes.ts`: ルート定義
- `app/routes/`: 各ルートの loader・画面コンポーネント
- `app/db/`: DBアクセス層（Drizzle ORM）
- `app/components/`: 共通 UI コンポーネント
- `docs/schema.md`, `docs/schema.sql`: データベーススキーマ
- `public/`: 静的アセット

## 開発コマンド

```bash
# 依存関係のインストール
npm install

# ローカル開発
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動（ビルド後）
npm run start

# 型チェック
npm run typecheck
```

ローカルではプロジェクトルートの `.env` に `DATABASE_URL` を設定してください。

## デプロイ（Render.com）

1. [Render Dashboard](https://dashboard.render.com/) で **New → Web Service** から本リポジトリを接続
2. **Runtime** で **Docker** を選択（[`Dockerfile`](Dockerfile) が使用されます）
3. **Environment** に `DATABASE_URL` を設定（Neon の pooled URL を推奨）
4. main ブランチへの push で自動デプロイ

Render は `PORT` 環境変数を自動注入します。`react-router-serve` がこれを参照するため、ポート設定は不要です。

## 環境変数

| 変数名 | 説明 |
|--------|------|
| `DATABASE_URL` | Neon Postgres の接続文字列（必須） |
