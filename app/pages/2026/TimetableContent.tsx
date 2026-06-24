import type { SupportedLanguage } from "~/constants/languageLabels.js";
import type { YearWithCountry } from "~/db/year.js";
import { Table } from "~/components/Table.js";
import * as m from "../../../paraglide/messages.js";

type TimetableContentProps = {
  locale: SupportedLanguage;
  year: number;
  yearWithCountry: YearWithCountry;
};

const formatDate = (date: Date | null | undefined, locale: string): string => {
  if (!date) return "-";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone: "Europe/Warsaw",
  }).format(date);
};

export const TimetableContent = ({ locale, year, yearWithCountry }: TimetableContentProps) => {
  const startsAt = yearWithCountry.startsAt ? new Date(yearWithCountry.startsAt) : null;
  const endsAt = yearWithCountry.endsAt ? new Date(yearWithCountry.endsAt) : null;
  const city = yearWithCountry.city ?? "-";

  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">

        <div className="mb-16 bg-(--section-color) p-8">
          <h2 className="mb-4 text-xl font-bold text-center">{m.time_table()}</h2>
          <Table
            data={[
              ["", ""],
              [m.venue_tickets(), city],
              ["Start", formatDate(startsAt, locale)],
              ["End", formatDate(endsAt, locale)],
            ]}
          />
        </div>

        <div className="text-center text-xl text-(--secondary-text-color) py-40">
          coming soon...
        </div>

      </div>
    </main>
  );
};
