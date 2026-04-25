# GBBINFO4.0

## 概要
本プロジェクトは、GBBINFO3.0（Renderホスティング環境）を完全廃止し、フルサーバーレス・エッジネイティブな構成へ移行するためのリファクタリング計画および実装リポジトリです。
スパイク時の高負荷に耐えうるスケーラビリティの確保、グローバルなレスポンスタイムの向上、およびインフラ構成の単純化（帯域幅消費の削減）を目的としています。

## システムアーキテクチャ

* **Frontend & Backend Logic:** Cloudflare Pages / Workers
  * フレームワーク: Remix (React) / TypeScript
  * 旧来Renderで稼働していたバックエンド処理（ビジネスロジック）をすべてEdge Functionsに統合。
* **Database:** Neon または Supabase (PostgreSQL)
  * スパイク耐性とエッジ環境との親和性を考慮したRDB。
* **Connection Pooling & Cache:** Cloudflare Hyperdrive
  * EdgeからのDB直接アクセスのボトルネックとなる接続オーバーヘッドを排除。
  * コネクションの枯渇を防ぎ、読み取りクエリ（`SELECT`）をエッジでキャッシュ。

## 主要な移行ポイント

1. **バックエンドサーバー（Render）の廃止:**
   * Edge ↔ Render ↔ DB 間で発生していたネットワークの往復と帯域幅の無駄を解消。
   * 処理をV8ランタイム（Cloudflare Workers）に移植し、インフラをCloudflareに一本化。
2. **Hyperdriveによる専用通信ルートの確立:**
   * Edgeワーカーから直接DBへ接続する専用ルートをHyperdrive経由で構築。
   * トラフィック急増時もDB側のコネクション上限を気にせずスケーリング可能に。

## 処理の流れ
ユーザー
↓ （HTTPSリクエスト）
Cloudflare (Pages / Workers)
・静的ファイルの配信 (フロントエンド)
・ビジネスロジックの実行 (旧Renderで行っていたバックエンド処理)
↓ （Cloudflare内部ネットワーク）
Cloudflare Hyperdrive
・DBコネクションの維持・管理 (プーリング)
・読み取りクエリのキャッシュ
↓ （TCP / TLS通信）
データベース (Neon / Supabase)
・データの永続化
