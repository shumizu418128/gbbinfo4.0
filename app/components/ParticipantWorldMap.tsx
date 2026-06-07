import { useEffect, useMemo, useRef } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import type { ParticipantWithRelations } from "~/db/participant.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import type { Country } from "~/db/tables.js";
import { MULTI_NATIONAL_ISO_CODE } from "~/constants/country.js";
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
import { getCountryName } from "~/util/country.js";
type ParticipantWorldMapProps = {
  participants: ParticipantWithRelations[];
  locale: SupportedLanguage;
};

type MapMarker = {
  isoCode: number;
  lat: number;
  lng: number;
  countryName: string;
  countryEnName: string;
  isoAlpha2: string | null;
  participants: Array<{ name: string }>;
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
  `${FLAG_IMAGE_PATH_PREFIX}/${encodeURIComponent(countryEnName)}.webp`;

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
 * 参加者に紐づく国一覧（座標付き）を取得する。
 *
 * Args:
 *   participant: 参加者と関連国情報。
 *
 * Returns:
 *   座標を含む Country 一覧。
 */
const getParticipantCountriesWithCoords = (
  participant: ParticipantWithRelations,
): Country[] => {
  if (participant.isoCode !== MULTI_NATIONAL_ISO_CODE) {
    return [participant.country];
  }

  const seen = new Set<number>();
  const countries: Country[] = [];

  for (const member of participant.members) {
    if (!member.country || seen.has(member.country.isoCode)) {
      continue;
    }
    seen.add(member.country.isoCode);
    countries.push(member.country);
  }

  return countries;
};

/**
 * numeric 文字列の座標を number に変換する。
 *
 * Args:
 *   value: Country テーブルの latitude / longitude。
 *
 * Returns:
 *   変換後の数値。
 */
const toCoordinate = (value: string): number => Number(value);

/**
 * 地図表示に使える座標かどうかを判定する。
 *
 * Args:
 *   country: Country テーブルの行。
 *
 * Returns:
 *   緯度・経度が未設定 (0, 0) でなければ true。
 */
const hasValidCoordinates = (country: Country): boolean => {
  const lat = toCoordinate(country.latitude);
  const lng = toCoordinate(country.longitude);
  return lat !== 0 || lng !== 0;
};

/**
 * 参加者一覧から国別マーカーデータを生成する。
 *
 * Args:
 *   participants: 出場者一覧。
 *   locale: 表示言語。
 *
 * Returns:
 *   isoCode ごとに集約したマーカー一覧。
 */
const buildMapMarkers = (
  participants: ParticipantWithRelations[],
  locale: SupportedLanguage,
): MapMarker[] => {
  const markerMap = new Map<number, MapMarker>();

  for (const participant of participants) {
    if (participant.isCancelled || participant.isoCode === 0) {
      continue;
    }

    const countries = getParticipantCountriesWithCoords(participant);

    for (const country of countries) {
      if (!hasValidCoordinates(country)) {
        continue;
      }

      const countryEnName = country.names.en;
      if (!countryEnName) {
        continue;
      }

      const existingMarker = markerMap.get(country.isoCode);

      if (existingMarker) {
        existingMarker.participants.push({ name: participant.name });
        continue;
      }

      markerMap.set(country.isoCode, {
        isoCode: country.isoCode,
        lat: toCoordinate(country.latitude),
        lng: toCoordinate(country.longitude),
        countryName: getCountryName(country, locale),
        countryEnName,
        isoAlpha2: country.isoAlpha2,
        participants: [{ name: participant.name }],
      });
    }
  }

  return Array.from(markerMap.values());
};

/**
 * マーカーのポップアップ HTML を生成する。
 *
 * Args:
 *   marker: 国別マーカーデータ。
 *
 * Returns:
 *   Leaflet Popup 用 HTML 文字列。
 */
const buildPopupHtml = (marker: MapMarker): string => {
  const scrollableClass =
    marker.participants.length > POPUP_SCROLL_THRESHOLD
      ? " participant-popup--scrollable"
      : "";

  const flagHtml = renderFlagMarkup(marker.isoAlpha2);

  const countryHeader = `<div class="participant-popup__header"><span class="participant-popup__flag">${flagHtml}</span><span class="participant-popup__country">${escapeHtml(marker.countryName)}</span></div>`;

  const participantsHtml = marker.participants
    .map(
      (participant) =>
        `<p class="participant-popup__name">${escapeHtml(participant.name)}</p>`,
    )
    .join("");

  return `<div class="participant-popup${scrollableClass}">${countryHeader}<div class="participant-popup__names">${participantsHtml}</div></div>`;
};

/**
 * 国旗アイコン付き Leaflet マーカーを生成する。
 *
 * Args:
 *   L: Leaflet モジュール。
 *   marker: 国別マーカーデータ。
 *
 * Returns:
 *   国旗アイコンを持つ Leaflet Marker。
 */
const createFlagMarker = (
  L: typeof import("leaflet"),
  marker: MapMarker,
): ReturnType<typeof L.marker> => {
  const flagIcon = L.icon({
    iconUrl: getLocalFlagImageUrl(marker.countryEnName),
    iconSize: FLAG_ICON_SIZE,
    iconAnchor: FLAG_ICON_ANCHOR,
  });

  return L.marker([marker.lat, marker.lng], { icon: flagIcon }).bindPopup(
    buildPopupHtml(marker),
    { maxWidth: POPUP_MAX_WIDTH },
  );
};

export const ParticipantWorldMap = ({
  participants,
  locale,
}: ParticipantWorldMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null);
  const markers = useMemo(
    () => buildMapMarkers(participants, locale),
    [participants, locale],
  );

  useEffect(() => {
    if (!containerRef.current || markers.length === 0) {
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
        createFlagMarker(L, marker).addTo(markersLayerRef.current!);
      }
    };

    void renderMap();

    return () => {
      cancelled = true;
    };
  }, [markers]);

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
    <section className="relative z-0 mt-16 w-full px-4">
      <div
        className="participant-world-map mx-auto w-full max-w-5xl overflow-hidden border isolate [&_.leaflet-pane]:z-1 [&_.leaflet-top]:z-1 [&_.leaflet-bottom]:z-1 [&_.leaflet-control]:z-1 [&_.leaflet-marker-pane]:z-2 [&_.leaflet-popup-pane]:z-8"
        style={{
          height: MAP_HEIGHT_PX,
          borderColor: "var(--button-border-color)",
          backgroundColor: "var(--section-color)",
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
