import path from "node:path";

/** ビルド用スナップショットのバージョン。スキーマ変更時にインクリメントする。 */
export const BUILD_CACHE_VERSION = 1;

/** ローカルビルドキャッシュ（gitignore）。 */
export const LOCAL_BUILD_CACHE_DIR = path.join(process.cwd(), ".cache/build");

/** スナップショット本体。 */
export const BUILD_SNAPSHOT_FILE = "snapshot.json";

/** メタ情報（生成日時・バージョン）。 */
export const BUILD_MANIFEST_FILE = "manifest.json";
