import { MULTI_NATIONAL_ISO_CODE } from "~/constants/country.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import type { Country } from "~/db/tables.js";
import type { ParticipantWithRelations } from "~/db/participantTypes.js";
import { getCountryName } from "~/util/country.js";
import { getParticipantDetailHref } from "~/util/participant.js";

/** 地図マーカー上の出場者（詳細リンクは SSG 時に確定させる）。 */
export type WorldMapMarkerParticipant = {
  id: number;
  name: string;
  isTeam: boolean;
  href: string | null;
};

/** 国別マーカー。island props に載せるため最小フィールドのみ。 */
export type WorldMapMarker = {
  isoCode: number;
  lat: number;
  lng: number;
  countryName: string;
  countryEnName: string;
  isoAlpha2: string | null;
  participants: WorldMapMarkerParticipant[];
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
 * 参加者一覧から国別マーカーデータを生成する（SSG 時に呼び、island props を軽量化する）。
 *
 * Args:
 *   participants: 出場者一覧。
 *   locale: 表示言語。
 *
 * Returns:
 *   isoCode ごとに集約したマーカー一覧。
 */
export const buildWorldMapMarkers = (
  participants: ParticipantWithRelations[],
  locale: SupportedLanguage,
): WorldMapMarker[] => {
  const markerMap = new Map<number, WorldMapMarker>();

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

      const participantEntry: WorldMapMarkerParticipant = {
        id: participant.id,
        name: participant.name,
        isTeam: participant.categoryInfo.isTeam,
        href:
          getParticipantDetailHref(locale, {
            id: participant.id,
            name: participant.name,
            categoryInfo: { isTeam: participant.categoryInfo.isTeam },
          }) ?? null,
      };

      if (existingMarker) {
        existingMarker.participants.push(participantEntry);
        continue;
      }

      markerMap.set(country.isoCode, {
        isoCode: country.isoCode,
        lat: toCoordinate(country.latitude),
        lng: toCoordinate(country.longitude),
        countryName: getCountryName(country, locale),
        countryEnName,
        isoAlpha2: country.isoAlpha2,
        participants: [participantEntry],
      });
    }
  }

  return Array.from(markerMap.values());
};
