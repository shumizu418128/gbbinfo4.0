import { MULTI_NATIONAL_ISO_CODE } from "~/constants/country.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import type { Country } from "~/db/tables.js";

export type CountryDisplayInfo = Pick<
  Country,
  "isoCode" | "names" | "isoAlpha2"
>;

export type ParticipantCountrySource = {
  country: CountryDisplayInfo;
  isoCode: number;
  members: Array<{ country: CountryDisplayInfo | null }>;
};

/**
 * Country からロケールに応じた国名を取得する。
 *
 * Args:
 *   country: Country テーブルの行。
 *   locale: 表示言語。
 *
 * Returns:
 *   ロケールに対応する国名。
 *
 * Raises:
 *   Error: 指定ロケールの国名が存在しない場合。
 */
export const getCountryName = (
  country: Pick<Country, "isoCode" | "names">,
  locale: SupportedLanguage,
): string => {
  const fromNames = country.names[locale];
  if (!fromNames) {
    throw new Error(
      `Country name not found: isoCode=${country.isoCode}, locale=${locale}`,
    );
  }
  return fromNames;
};

/**
 * 参加者の表示用国一覧を解決する。
 *
 * isoCode が 9999 のときは ParticipantMember 全員の country から
 * isoCode 重複を除いた一覧を返す。
 *
 * Args:
 *   participant: 参加者とメンバー国情報。
 *
 * Returns:
 *   表示用の Country 一覧。
 *
 * Raises:
 *   Error: 多国籍参加者でメンバーまたは国データが不足している場合。
 */
export const resolveParticipantCountries = (
  participant: ParticipantCountrySource,
): CountryDisplayInfo[] => {
  if (participant.country.isoCode !== MULTI_NATIONAL_ISO_CODE) {
    return [participant.country];
  }

  if (participant.members.length === 0) {
    throw new Error(
      `Multi-national participant missing members: isoCode=${participant.isoCode}`,
    );
  }

  const seen = new Set<number>();
  const countries: CountryDisplayInfo[] = [];

  for (const member of participant.members) {
    if (!member.country) {
      throw new Error(
        `Participant member country missing: isoCode=${participant.isoCode}`,
      );
    }
    if (!seen.has(member.country.isoCode)) {
      seen.add(member.country.isoCode);
      countries.push(member.country);
    }
  }

  if (countries.length === 0) {
    throw new Error(
      `Multi-national participant has no valid member countries: isoCode=${participant.isoCode}`,
    );
  }

  return countries;
};
