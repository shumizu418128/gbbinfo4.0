import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { Flag } from "~/components/Flag.js";
import {
  getCountryName,
  type CountryDisplayInfo,
} from "~/util/country.js";

type ParticipantCountriesProps = {
  countries: CountryDisplayInfo[];
  locale: SupportedLanguage;
};

export const ParticipantCountries = ({
  countries,
  locale,
}: ParticipantCountriesProps) => (
  <span className="inline-flex flex-wrap items-center gap-2">
    <span className="inline-flex items-center gap-2">
      {countries.map((country) => (
        <Flag key={country.isoCode} isoAlpha2={country.isoAlpha2} />
      ))}
    </span>
    <span>
      {countries.map((country, index) => (
        <span key={country.isoCode}>
          {index > 0 && " "}
          {getCountryName(country, locale)}
        </span>
      ))}
    </span>
  </span>
);
