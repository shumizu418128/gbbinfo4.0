import type { SupportedLanguage } from "~/constants/languageLabels.js";
import type { YearWithCountry } from "~/db/year.js";
import { Table } from "~/components/Table.js";
import * as m from "../../../paraglide/messages.js";

type TicketContentProps = {
  locale: SupportedLanguage;
  year: number;
  yearWithCountry: YearWithCountry;
};

const anchorClass =
  "text-(--gbb-color) underline transition-colors duration-150 hover:text-white";

export const TicketContent = ({ locale, year, yearWithCountry }: TicketContentProps) => {
  const city = yearWithCountry.city ?? "-";
  const countryName =
    yearWithCountry.country.names?.[locale as keyof typeof yearWithCountry.country.names] ??
    yearWithCountry.country.enName ??
    "-";

  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">

        <div className="mb-16 bg-(--section-color) p-8">
          <h2 className="mb-4 text-xl font-bold text-center">{m.venue_tickets()}</h2>
          <Table
            data={[
              ["", ""],
              ["City", city],
              ["Country", countryName],
            ]}
          />
        </div>

        <div className="mb-16 text-center text-xl text-(--secondary-text-color) py-16">
          coming soon...
        </div>

        <div className="mb-16 bg-(--section-color) p-8">
          <h2 className="mb-2 text-2xl font-bold text-center">{m.inquiry()}</h2>
          <hr className="border-(--gbb-color) mb-4" />
          <Table
            data={[
              ["", "email"],
              [m.inquiry_ticket(), <a key="ticket" href="mailto:gbb@swissbeatbox.com" className={anchorClass}>gbb@swissbeatbox.com</a>],
              [m.inquiry_event(), <a key="event" href="mailto:tickets@weeztix.com" className={anchorClass}>tickets@weeztix.com</a>],
            ]}
            textCenter
          />
        </div>

      </div>
    </main>
  );
};
