import type { SupportedLanguage } from "~/constants/languageLabels.js";
import type { Country } from "~/db/tables.js";

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
