---
name: render-health
description: Render(GBBinfo)の帯域幅とログを定期調査して要約する
---

# Render 帯域幅・ログ調査

本番 Render サービス **GBBinfo**（`gbbinfo-jpn.onrender.com`）の帯域幅とログを、読み取り専用で調査して要約する。

コード変更・デプロイ・設定変更は行わない。Cloudflare は対象外（ユーザーが明示した場合のみ）。

## 前提

- ローカルは Windows + PowerShell
- 認証: `render whoami` が成功すること。失敗時は `render login`（または `RENDER_API_KEY`）を案内して終了
- サービス ID: `srv-cpr2q6lumphs73bumjr0`
- API キーをチャットに出力しない（`~/.render/cli.yaml` を読み取る場合も同様）

## 手順

1. リポジトリルートで収集スクリプトを実行する:

```powershell
pwsh -File scripts/render-health.ps1
```

2. 出力 JSON を解釈し、下記フォーマットで日本語要約を返す。
3. スクリプト失敗時は、同等の手動調査にフォールバックする:
   - 帯域: `GET https://api.render.com/v1/metrics/bandwidth`（`startTime`/`endTime` は ISO8601。単位は **mb**）
   - 内訳: `GET https://api.render.com/v1/metrics/bandwidth-sources`
   - ログ: `render logs -r srv-cpr2q6lumphs73bumjr0 ... -o json`
   - デプロイ: Render API `GET /v1/services/{id}/deploys?limit=5`

## 解釈の目安

- Free プラン帯域の参考上限: **5 GB/月**（2026-08 以降。以前は 100 GB/月）
  - スクリプトの `month_to_date.freePlanUsedPercent` が旧 100GB 基準のままなら、当月 MB から **5GB 比を再計算**すること
- よくある error（多くは致命傷ではない）:
  - `directory index ... forbidden` … 言語ルート等への探査
  - `No such file` の `/_astro/*.css` … 古い hashed アセット参照
  - `limiting requests` / zone `participant` … レート制限が動作
- アクセスログの 403/404/410 は旧 URL・スラッシュ無し・ボットが多い。**5xx が無いこと**を優先確認

## 出力フォーマット

簡潔に（冗長な生ログは貼らない）:

### 結論
1〜2文。健全 / 注意 / 要対応。

### 帯域幅
| 期間 | 使用量 | 備考 |
| 直近24h / 7日 / 当月累計 | MB と GB | 当月は Free 5GB 比も |
| 日別（当月） | 表 | ピーク日を明示 |
| ソース（7日） | http/total 等 | |

### ログ
- 最新デプロイ（status / 時刻 / commit）
- アクセスサンプルのステータス内訳（200/301/403/404/410/5xx）
- error カテゴリ集計と件数
- 気になる Non-2xx パス（上位のみ）

### 次アクション
- 不要なら「対応不要」と明記
- あるなら優先度付きで 1〜3 件
