# Cloudflare Pages 静的アセット + アバター proxy

本番サイト（Render.com）の HTML とは別に、静的画像と SNS アバターを Cloudflare Pages から配信する。

- **静的画像**: `cloudflare/public/`（git 管理）
- **SNS アバター**: Pages Function `/avatar` + R2 永続キャッシュ
- **本番 URL**: `https://gbbinfo-assets.pages.dev`（プロジェクト名変更時は各所を揃える）

## ディレクトリ

```
cloudflare/
  public/
    _headers          # 画像の Cache-Control
    images/           # webp 画像・国旗など
  functions/
    avatar.ts         # GET /avatar — R2 キャッシュ付きアバター取得
  lib/
    fetch-avatar.ts   # platform 別取得
    og-image.ts       # og:image 抽出
  package.json
  wrangler.toml
shared/avatar/        # Astro ビルドと Function で共有する型・URL ビルダー
```

Astro 側は `PUBLIC_ASSET_BASE_URL` + `staticAssetUrl()` / `buildAvatarProxyUrl()` で参照する。

## 初回セットアップ（Cloudflare ダッシュボード）

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Direct Upload**
2. プロジェクト名: `gbbinfo-assets`
3. **R2** → **Create bucket** → バケット名: `gbbinfo-avatar-cache`（非公開のまま）
4. **My Profile** → **API Tokens** → **Create Token** → **Edit Cloudflare Workers** テンプレート（Pages Edit・R2 Edit 権限を含む）
5. GitHub リポジトリの **Settings → Secrets and variables → Actions** に登録:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`（Dashboard 右サイドバー）

## アバター proxy（`/avatar`）

ビルド時に Astro が取得元 URL のみを埋め込み、ブラウザが Cloudflare に問い合わせる。

```
GET /avatar?name=SHAH&platform=youtube&url=https%3A%2F%2F...&method=ogImage
```

1. R2 にキャッシュがあれば返却（**出場者名のみ**でキー。platform / url は無視）
2. なければクエリの SNS / YouTube 情報から画像を取得して R2 に保存（以降 Tavily が変わっても更新しない）
3. 失敗時は `404`（サイト側で黒背景）

## 静的画像の追加・更新

1. `cloudflare/public/images/` に webp を配置（パスは `/images/foo.webp` 形式で参照される）
2. `main` へ push → GitHub Actions が自動デプロイ

手動デプロイ:

```bash
cd cloudflare
npm install
npm run deploy
```

ルートから:

```bash
npm run assets:deploy
```

## ローカル開発

**パターン A（推奨）**: `.env` に本番 Pages URL を設定して `npm run dev`

```env
PUBLIC_ASSET_BASE_URL=https://gbbinfo-assets.pages.dev
```

**パターン B（オフライン）**: ローカルで Pages + Functions を模擬

```bash
# terminal 1
npm run assets:dev    # http://127.0.0.1:8788（/avatar も利用可、R2 はローカルシミュレーション）

# terminal 2（.env）
PUBLIC_ASSET_BASE_URL=http://127.0.0.1:8788
npm run dev
```

## 関連

- [README.md](../README.md) — 環境変数・メインサイトのデプロイ
- [.github/workflows/deploy-assets.yml](../.github/workflows/deploy-assets.yml) — 自動デプロイ
