/** 海（背景）の塗り色。 */
export const MAP_OCEAN_COLOR = "#000000";

/** 陸の塗り色。 */
export const MAP_LAND_FILL_COLOR = "#000000";

/** 陸の輪郭色（`--gbb-color` / GBB_COLOR と一致。MapLibre 向け hex）。 */
export const MAP_LAND_OUTLINE_COLOR = "#ff6414";

/** 陸の輪郭幅。 */
export const MAP_LAND_OUTLINE_WIDTH = 2;

/** 地球儀用ベクトルタイル（MapLibre 公式デモ。globe 投影で GeoJSON より安定）。 */
export const MAP_VECTOR_TILES_URL =
  "https://demotiles.maplibre.org/tiles/tiles.json";

/** ベクトルタイル内の陸ポリゴン layer 名。 */
export const MAP_VECTOR_SOURCE_LAYER = "countries";

/** 地図の初期中心座標 [経度, 緯度]。 */
export const MAP_CENTER: [number, number] = [0, 20];

/** 地図の初期ズームレベル。 */
export const MAP_DEFAULT_ZOOM = 1.5;

/** 地図の最小ズームレベル。 */
export const MAP_MIN_ZOOM = 0;

/** 地図の最大ズームレベル。 */
export const MAP_MAX_ZOOM = 8;

/** 地図コンテナの高さ (px)。 */
export const MAP_HEIGHT_PX = 480;

/** 国旗マーカーアイコンのサイズ [幅, 高さ]。 */
export const FLAG_ICON_SIZE: [number, number] = [48, 48];

/** ポップアップ内国旗の表示高さ (px)。FlagCDN の h 指定は 20 など対応値のみ。 */
export const POPUP_FLAG_HEIGHT = 20;

/** ポップアップ内国旗スロットの予約幅 (px)。FlagCDN の実幅差を計測前に吸収する。 */
export const POPUP_FLAG_RESERVED_WIDTH = 48;

/** ポップアップの最大幅 (px)。 */
export const POPUP_MAX_WIDTH = 320;

/** マーカーとポップアップの間隔 (px)。 */
export const POPUP_OFFSET_PX = 8;

/** ポップアップをスクロール表示に切り替える参加者数の閾値。 */
export const POPUP_SCROLL_THRESHOLD = 7;

/** ポップアップの最大高さ (px)。 */
export const POPUP_MAX_HEIGHT_PX = 200;

/** ポップアップのフォントファミリー。 */
export const POPUP_FONT_FAMILY = "'Averta ExtraBold', 'Meiryo'";

/** 国旗画像の公開パス prefix。 */
export const FLAG_IMAGE_PATH_PREFIX = "/images/flags";
