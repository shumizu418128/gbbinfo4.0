/** NASA GIBS VIIRS Earth at Night 2012 タイル URL。 */
export const NASA_GIBS_TILES =
  "https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_CityLights_2012/default//GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg";

/** NASA GIBS タイルの attribution HTML。 */
export const NASA_GIBS_ATTR =
  '<a href="https://earthdata.nasa.gov">NASA GIBS (Global Imagery Browse Services)</a>';

/** NASA GIBS タイルのサブドメイン。 */
export const NASA_GIBS_SUBDOMAINS = ["a", "b", "c"] as const;

/** 地図の初期中心座標 [緯度, 経度]。 */
export const MAP_CENTER: [number, number] = [20, 0];

/** 地図の初期ズームレベル。 */
export const MAP_DEFAULT_ZOOM = 2;

/** 地図の最小ズームレベル。 */
export const MAP_MIN_ZOOM = 1;

/** 地図の最大ズームレベル。 */
export const MAP_MAX_ZOOM = 8;

/** 地図の最大表示範囲。 */
export const MAP_MAX_BOUNDS: [[number, number], [number, number]] = [
  [-85, -180],
  [85, 180],
];

/** ズームスナップ間隔。 */
export const MAP_ZOOM_SNAP = 0.1;

/** ズーム増減量。 */
export const MAP_ZOOM_DELTA = 0.1;

/** 地図コンテナの高さ (px)。 */
export const MAP_HEIGHT_PX = 400;

/** 国旗マーカーアイコンのサイズ [幅, 高さ]。 */
export const FLAG_ICON_SIZE: [number, number] = [48, 48];

/** 国旗マーカーアイコンのアンカー位置 [x, y]。 */
export const FLAG_ICON_ANCHOR: [number, number] = [24, 48];

/** ポップアップ内 Flag コンポーネントの高さ (px)。FlagCDN の h 指定は 20 など対応値のみ。 */
export const POPUP_FLAG_HEIGHT = 20;

/** ポップアップの最大幅 (px)。 */
export const POPUP_MAX_WIDTH = 320;

/** ポップアップをスクロール表示に切り替える参加者数の閾値。 */
export const POPUP_SCROLL_THRESHOLD = 7;

/** ポップアップの最大高さ (px)。 */
export const POPUP_MAX_HEIGHT_PX = 200;

/** ポップアップ見出しの色。 */
export const POPUP_HEADER_COLOR = "#ff6417";

/** ポップアップのフォントファミリー。 */
export const POPUP_FONT_FAMILY =
  "'Averta ExtraBold', 'Noto Sans JP', 'Noto Sans KR'";

/** 国旗画像の公開パス prefix。 */
export const FLAG_IMAGE_PATH_PREFIX = "/images/flags";
