import type { MapOptions } from "maplibre-gl";
import {
  FLAG_ICON_SIZE,
  FLAG_IMAGE_PATH_PREFIX,
  MAP_CENTER,
  MAP_DEFAULT_ZOOM,
  MAP_LAND_FILL_COLOR,
  MAP_LAND_OUTLINE_COLOR,
  MAP_LAND_OUTLINE_WIDTH,
  MAP_MAX_ZOOM,
  MAP_MIN_ZOOM,
  MAP_OCEAN_COLOR,
  MAP_VECTOR_SOURCE_LAYER,
  MAP_VECTOR_TILES_URL,
  POPUP_FLAG_HEIGHT,
  POPUP_MAX_WIDTH,
  POPUP_OFFSET_PX,
  POPUP_SCROLL_THRESHOLD,
} from "~/constants/worldMap.js";
import { staticAssetUrl } from "~/util/staticAsset.js";
import type { WorldMapMarker } from "~/util/worldMapMarkers.js";

const ROOT_SELECTOR = "[data-participant-world-map]";

/**
 * HTML 特殊文字をエスケープする。
 */
const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * ローカル国旗画像の公開 URL を生成する。
 */
const getLocalFlagImageUrl = (countryEnName: string): string =>
  staticAssetUrl(
    `${FLAG_IMAGE_PATH_PREFIX}/${encodeURIComponent(countryEnName)}.webp`,
  );

/**
 * ポップアップ用の国旗 img タグを生成する。
 */
const renderFlagMarkup = (isoAlpha2: string | null): string => {
  if (!isoAlpha2) {
    return "";
  }

  const code = isoAlpha2.toLowerCase();
  return `<img src="https://flagcdn.com/h${POPUP_FLAG_HEIGHT}/${code}.png" height="${POPUP_FLAG_HEIGHT}" alt="" loading="eager">`;
};

/**
 * マーカーのポップアップ HTML を生成する。
 */
const buildPopupHtml = (marker: WorldMapMarker): string => {
  const scrollableClass =
    marker.participants.length > POPUP_SCROLL_THRESHOLD
      ? " participant-popup--scrollable"
      : "";

  const flagHtml = renderFlagMarkup(marker.isoAlpha2);
  const countryHeader = `<div class="participant-popup__header"><span class="participant-popup__flag">${flagHtml}</span><span class="participant-popup__country">${escapeHtml(marker.countryName)}</span></div>`;

  const participantsHtml = marker.participants
    .map((participant) => {
      const nameHtml = participant.href
        ? `<a href="${escapeHtml(participant.href)}" class="participant-popup__link">${escapeHtml(participant.name)}</a>`
        : escapeHtml(participant.name);

      return `<p class="participant-popup__name">${nameHtml}</p>`;
    })
    .join("");

  return `<div class="participant-popup${scrollableClass}">${countryHeader}<div class="participant-popup__names">${participantsHtml}</div></div>`;
};

/**
 * 国旗マーカー用の DOM 要素を生成する。
 */
const createFlagMarkerElement = (marker: WorldMapMarker): HTMLImageElement => {
  const element = document.createElement("img");
  element.src = getLocalFlagImageUrl(marker.countryEnName);
  element.alt = marker.countryName;
  element.width = FLAG_ICON_SIZE[0];
  element.height = FLAG_ICON_SIZE[1];
  element.decoding = "async";
  element.style.width = `${FLAG_ICON_SIZE[0]}px`;
  element.style.height = `${FLAG_ICON_SIZE[1]}px`;
  element.style.cursor = "pointer";
  element.style.display = "block";
  return element;
};

/**
 * data 属性からマーカー一覧を読む。
 */
const readMarkers = (root: HTMLElement): WorldMapMarker[] | null => {
  const raw = root.dataset.markers;
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as WorldMapMarker[];
  } catch {
    return null;
  }
};

type GlobeStyle = Exclude<NonNullable<MapOptions["style"]>, string>;

/**
 * 海を黒、陸の輪郭を GBB カラーにした地球儀スタイルを生成する。
 * 陸ジオメトリは globe 投影で実績のあるベクトルタイルを使う。
 */
const buildGlobeStyle = (): GlobeStyle => ({
  version: 8,
  projection: { type: "globe" },
  sources: {
    maplibre: {
      type: "vector",
      url: MAP_VECTOR_TILES_URL,
    },
  },
  layers: [
    {
      id: "ocean",
      type: "background",
      paint: {
        "background-color": MAP_OCEAN_COLOR,
      },
    },
    {
      id: "land-fill",
      type: "fill",
      source: "maplibre",
      "source-layer": MAP_VECTOR_SOURCE_LAYER,
      paint: {
        "fill-color": MAP_LAND_FILL_COLOR,
      },
    },
    {
      id: "land-outline",
      type: "line",
      source: "maplibre",
      "source-layer": MAP_VECTOR_SOURCE_LAYER,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": MAP_LAND_OUTLINE_COLOR,
        "line-width": MAP_LAND_OUTLINE_WIDTH,
      },
    },
  ],
  sky: {
    "atmosphere-blend": 0,
  },
});

/**
 * 可視になった地図コンテナへ MapLibre GL JS の地球儀を遅延初期化する。
 */
const mountMap = async (root: HTMLElement): Promise<void> => {
  const markers = readMarkers(root);
  const canvas = root.querySelector<HTMLElement>(
    "[data-participant-world-map-canvas]",
  );
  if (!markers || !canvas || markers.length === 0) {
    return;
  }

  const maplibregl = await import("maplibre-gl");
  const { default: maplibreWorkerUrl } = await import(
    "maplibre-gl/dist/maplibre-gl-worker.mjs?url"
  );
  await import("maplibre-gl/dist/maplibre-gl.css");
  // Vite の prebundle 先には worker が無いため、配布ファイルの URL を明示する。
  maplibregl.setWorkerUrl(maplibreWorkerUrl);

  const map = new maplibregl.Map({
    container: canvas,
    style: buildGlobeStyle(),
    center: MAP_CENTER,
    zoom: MAP_DEFAULT_ZOOM,
    minZoom: MAP_MIN_ZOOM,
    maxZoom: MAP_MAX_ZOOM,
    renderWorldCopies: false,
    maplibreLogo: false,
  });

  map.on("style.load", () => {
    map.setProjection({ type: "globe" });
    map.resize();
  });

  map.addControl(
    new maplibregl.NavigationControl({
      showCompass: true,
      visualizePitch: true,
    }),
    "top-right",
  );
  map.addControl(new maplibregl.GlobeControl(), "top-right");
  map.addControl(new maplibregl.ScaleControl(), "bottom-left");

  for (const marker of markers) {
    new maplibregl.Marker({
      element: createFlagMarkerElement(marker),
      anchor: "bottom",
    })
      .setLngLat([marker.lng, marker.lat])
      .setPopup(
        new maplibregl.Popup({
          maxWidth: `${POPUP_MAX_WIDTH}px`,
          offset: POPUP_OFFSET_PX,
          closeButton: true,
        }).setHTML(buildPopupHtml(marker)),
      )
      .addTo(map);
  }

  const resizeMap = (): void => {
    map.resize();
  };

  map.once("load", resizeMap);
  const resizeObserver = new ResizeObserver(resizeMap);
  resizeObserver.observe(canvas);
};

/**
 * ページ内の出場者世界地図を IntersectionObserver で遅延初期化する。
 */
export const initParticipantWorldMaps = (): void => {
  const roots = document.querySelectorAll<HTMLElement>(ROOT_SELECTOR);
  if (roots.length === 0) {
    return;
  }

  for (const root of roots) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }
        observer.disconnect();
        void mountMap(root);
      },
      { rootMargin: "200px" },
    );
    observer.observe(root);
  }
};
