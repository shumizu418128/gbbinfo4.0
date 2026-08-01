import { useEffect, useRef } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import {
  FLAG_ICON_ANCHOR,
  FLAG_ICON_SIZE,
  FLAG_IMAGE_PATH_PREFIX,
  MAP_CENTER,
  MAP_DEFAULT_ZOOM,
  MAP_HEIGHT_PX,
  MAP_MAX_BOUNDS,
  MAP_MAX_ZOOM,
  MAP_MIN_ZOOM,
  MAP_ZOOM_DELTA,
  MAP_ZOOM_SNAP,
  NASA_GIBS_ATTR,
  NASA_GIBS_SUBDOMAINS,
  NASA_GIBS_TILES,
  POPUP_FLAG_HEIGHT,
  POPUP_FLAG_RESERVED_WIDTH,
  POPUP_MAX_HEIGHT_PX,
  POPUP_MAX_WIDTH,
  POPUP_SCROLL_THRESHOLD,
} from "~/constants/worldMap.js";
import { getParticipantDetailHref } from "~/util/participant.js";
import { staticAssetUrl } from "~/util/staticAsset.js";
import type { WorldMapMarker } from "~/util/worldMapMarkers.js";

type ParticipantWorldMapProps = {
  markers: WorldMapMarker[];
  locale: SupportedLanguage;
};

/**
 * HTML 特殊文字をエスケープする。
 *
 * Args:
 *   value: エスケープ対象の文字列。
 *
 * Returns:
 *   エスケープ後の文字列。
 */
const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * ローカル国旗画像の公開 URL を生成する（マーカー用）。
 *
 * Args:
 *   countryEnName: Country.names.en の値。
 *
 * Returns:
 *   /images/flags/{enName}.webp 形式の URL。
 */
const getLocalFlagImageUrl = (countryEnName: string): string =>
  staticAssetUrl(`${FLAG_IMAGE_PATH_PREFIX}/${encodeURIComponent(countryEnName)}.webp`);

/**
 * ポップアップ用の国旗 img タグを生成する。
 *
 * FlagCDN は国旗ごとに横幅が異なるため、Leaflet の位置計算用に幅を大目に確保する。
 *
 * Args:
 *   isoAlpha2: ISO 3166-1 alpha-2 国コード。
 *
 * Returns:
 *   国旗 img の HTML 文字列。isoAlpha2 が無い場合は空文字。
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
 *
 * Args:
 *   marker: 国別マーカーデータ。
 *   locale: 表示言語。
 *
 * Returns:
 *   Leaflet Popup 用 HTML 文字列。
 */
const buildPopupHtml = (
  marker: WorldMapMarker,
  locale: SupportedLanguage,
): string => {
  const scrollableClass =
    marker.participants.length > POPUP_SCROLL_THRESHOLD
      ? " participant-popup--scrollable"
      : "";

  const flagHtml = renderFlagMarkup(marker.isoAlpha2);

  const countryHeader = `<div class="participant-popup__header"><span class="participant-popup__flag">${flagHtml}</span><span class="participant-popup__country">${escapeHtml(marker.countryName)}</span></div>`;

  const participantsHtml = marker.participants
    .map((participant) => {
      const href = getParticipantDetailHref(locale, {
        id: participant.id,
        name: participant.name,
        categoryInfo: { isTeam: participant.isTeam },
      });
      const nameHtml = href
        ? `<a href="${escapeHtml(href)}" class="participant-popup__link">${escapeHtml(participant.name)}</a>`
        : escapeHtml(participant.name);

      return `<p class="participant-popup__name">${nameHtml}</p>`;
    })
    .join("");

  return `<div class="participant-popup${scrollableClass}">${countryHeader}<div class="participant-popup__names">${participantsHtml}</div></div>`;
};

/**
 * 国旗アイコン付き Leaflet マーカーを生成する。
 *
 * Args:
 *   L: Leaflet モジュール。
 *   marker: 国別マーカーデータ。
 *   locale: 表示言語。
 *
 * Returns:
 *   国旗アイコンを持つ Leaflet Marker。
 */
const createFlagMarker = (
  L: typeof import("leaflet"),
  marker: WorldMapMarker,
  locale: SupportedLanguage,
): ReturnType<typeof L.marker> => {
  const flagIcon = L.icon({
    iconUrl: getLocalFlagImageUrl(marker.countryEnName),
    iconSize: FLAG_ICON_SIZE,
    iconAnchor: FLAG_ICON_ANCHOR,
  });

  return L.marker([marker.lat, marker.lng], { icon: flagIcon }).bindPopup(
    buildPopupHtml(marker, locale),
    { maxWidth: POPUP_MAX_WIDTH },
  );
};

export const ParticipantWorldMap = ({
  markers,
  locale,
}: ParticipantWorldMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || markers.length === 0) {
      return;
    }

    let cancelled = false;

    const renderMap = async () => {
      const { default: L } = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !containerRef.current) {
        return;
      }

      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current, {
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
        }).addTo(mapRef.current);

        L.control.scale().addTo(mapRef.current);
        markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
      }

      markersLayerRef.current?.clearLayers();

      for (const marker of markers) {
        createFlagMarker(L, marker, locale).addTo(markersLayerRef.current!);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }
        observer.disconnect();
        void renderMap();
      },
      { rootMargin: "200px" },
    );

    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [markers, locale]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  if (markers.length === 0) {
    return null;
  }

  return (
    <section
      className="relative z-0 w-full px-4 pt-16 pb-8 text-white"
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <div
        className="participant-world-map mx-auto w-full max-w-5xl overflow-hidden border isolate [&_.leaflet-pane]:z-1 [&_.leaflet-top]:z-1 [&_.leaflet-bottom]:z-1 [&_.leaflet-control]:z-1 [&_.leaflet-marker-pane]:z-2 [&_.leaflet-popup-pane]:z-8"
        style={{
          height: MAP_HEIGHT_PX,
          borderColor: "var(--button-border-color)",
          backgroundColor: "var(--background-color)",
          ["--popup-max-width" as string]: `${POPUP_MAX_WIDTH}px`,
          ["--popup-max-height" as string]: `${POPUP_MAX_HEIGHT_PX}px`,
          ["--popup-flag-width" as string]: `${POPUP_FLAG_RESERVED_WIDTH}px`,
        }}
      >
        <div ref={containerRef} className="h-full w-full" />
      </div>
    </section>
  );
};
