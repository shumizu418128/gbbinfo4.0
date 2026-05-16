# GBBINFO4.0

gbbinfo3.0 の Flask/Jinja 実装を、Netlify 上の React Router Data APIs（Remix移行互換）へ置き換える実装リポジトリです。

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

# ローカル開発（Netlify プラットフォームエミュレーション付き）
npm run dev

# 本番ビルド
npm run build

# 型チェック
npm run typecheck
```

ローカルではプロジェクトルートの `.env` に `DATABASE_URL` を設定してください。

## デプロイ（Netlify）

1. [Netlify](https://app.netlify.com/) で **Add new site → Import an existing project** から本リポジトリを接続
2. ビルド設定は [`netlify.toml`](netlify.toml) が適用されます（`npm run build` / `build/client`）
3. **Site configuration → Environment variables** に `DATABASE_URL` を設定（Neon の pooled URL を推奨）
4. main ブランチへの push で自動デプロイ

## 環境変数

| 変数名 | 説明 |
|--------|------|
| `DATABASE_URL` | Neon Postgres の接続文字列（必須） |
