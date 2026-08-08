import {
  FLAG_ICON_ANCHOR,
  FLAG_ICON_SIZE,
  FLAG_IMAGE_PATH_PREFIX,
  MAP_CENTER,
  MAP_DEFAULT_ZOOM,
  MAP_MAX_BOUNDS,
  MAP_MAX_ZOOM,
  MAP_MIN_ZOOM,
  MAP_ZOOM_DELTA,
  MAP_ZOOM_SNAP,
  NASA_GIBS_ATTR,
  NASA_GIBS_SUBDOMAINS,
  NASA_GIBS_TILES,
  POPUP_FLAG_HEIGHT,
  POPUP_MAX_WIDTH,
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

/**
 * 可視になった地図コンテナへ Leaflet を遅延初期化する。
 */
const mountMap = async (root: HTMLElement): Promise<void> => {
  const markers = readMarkers(root);
  const canvas = root.querySelector<HTMLElement>(
    "[data-participant-world-map-canvas]",
  );
  if (!markers || !canvas || markers.length === 0) {
    return;
  }

  const { default: L } = await import("leaflet");
  await import("leaflet/dist/leaflet.css");

  const map = L.map(canvas, {
    center: MAP_CENTER,
    zoom: MAP_DEFAULT_ZOOM,
    zoomControl: true,
    minZoom: MAP_MIN_ZOOM,
    maxZoom: MAP_MAX_ZOOM,
    maxBounds: MAP_MAX_BOUNDS,
    maxBoundsViscosity: 1.0,
    zoomSnap: MAP_ZOOM_SNAP,
    zoomDelta: MAP_ZOOM_DELTA,
  });

  L.tileLayer(NASA_GIBS_TILES, {
    attribution: NASA_GIBS_ATTR,
    subdomains: [...NASA_GIBS_SUBDOMAINS],
    minZoom: MAP_MIN_ZOOM,
    maxZoom: MAP_MAX_ZOOM,
  }).addTo(map);

  L.control.scale().addTo(map);

  const markersLayer = L.layerGroup().addTo(map);

  for (const marker of markers) {
    const flagIcon = L.icon({
      iconUrl: getLocalFlagImageUrl(marker.countryEnName),
      iconSize: FLAG_ICON_SIZE,
      iconAnchor: FLAG_ICON_ANCHOR,
    });

    L.marker([marker.lat, marker.lng], { icon: flagIcon })
      .bindPopup(buildPopupHtml(marker), { maxWidth: POPUP_MAX_WIDTH })
      .addTo(markersLayer);
  }
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
