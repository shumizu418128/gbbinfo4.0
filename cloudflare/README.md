# Cloudflare Pages 静的アセット

本番サイト（Render.com）の HTML とは別に、画像を Cloudflare Pages から配信する。

- **配信方式**: 静的ファイルのみ（Functions なし）
- **画像の正**: `cloudflare/public/`（git 管理）
- **本番 URL**: `https://gbbinfo-assets.pages.dev`（プロジェクト名変更時は各所を揃える）

## ディレクトリ

```
cloudflare/
  public/
    _headers          # 画像の Cache-Control
    images/           # webp 画像・国旗など
  package.json
  wrangler.toml
```

Astro 側は `PUBLIC_ASSET_BASE_URL` + `staticAssetUrl()` で参照する。ルート `public/` は使用しない。

## 初回セットアップ（Cloudflare ダッシュボード）

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Direct Upload**
2. プロジェクト名: `gbbinfo-assets`
3. **My Profile** → **API Tokens** → **Create Token** → **Edit Cloudflare Workers** テンプレート（Pages Edit 権限を含む）
4. GitHub リポジトリの **Settings → Secrets and variables → Actions** に登録:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`（Dashboard 右サイドバー）

## 画像の追加・更新

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

**パターン B（オフライン）**: ローカルで Pages を模擬

```bash
# terminal 1
npm run assets:dev    # http://127.0.0.1:8788

# terminal 2（.env）
PUBLIC_ASSET_BASE_URL=http://127.0.0.1:8788
npm run dev
```

## Render.com への切り替え

1. Pages 初回デプロイ後、`https://gbbinfo-assets.pages.dev/images/...` で画像が表示されることを確認
2. Render Dashboard → 対象 Web Service → **Environment**（または Docker build args）の `PUBLIC_ASSET_BASE_URL` を Pages URL に更新
3. Render を再デploy
4. 本番 HTML の `img src` が Pages を向いていることを確認

## R2 廃止

Cloudflare Pages への切り替え完了後:

1. R2 バケット → **Settings** → **Public access** → `r2.dev` を無効化
2. 不要ならバケットを削除
3. Render の `PUBLIC_ASSET_BASE_URL` が r2.dev を指していないことを再確認

## 関連

- [README.md](../README.md) — 環境変数・メインサイトのデプロイ
- [.github/workflows/deploy-assets.yml](../.github/workflows/deploy-assets.yml) — 自動デプロイ
