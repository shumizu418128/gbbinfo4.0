import { LinkCard } from "~/components/LinkCard";
import { Table } from "~/components/Table";
import type { YearWithCountry } from "~/db/year.js";
import * as m from "../../../paraglide/messages.js";

type TopContentProps = {
  locale: string;
  yearWithCountry: YearWithCountry;
};

export const TopContent = ({ locale, yearWithCountry }: TopContentProps) => {
  const { year } = yearWithCountry;

  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-18 flex flex-wrap gap-4">
          <LinkCard
            text={m.participants()}
            image="/images/sora.webp"
            href={`/${locale}/${year}/participants`}
          />
          <LinkCard
            text={m.rules()}
            image="/images/mahiro.webp"
            href={`/${locale}/${year}/rule`}
          />
          <LinkCard
            text={m.venue_tickets()}
            image="/images/dice.webp"
            href={`/${locale}/${year}/ticket`}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mt-22 bg-(--section-color) p-8 text-white">
          <h2 className="mb-2 text-center text-2xl font-bold">{m.inquiry()}</h2>
          <hr className="mb-4 border-(--gbb-color)" />
          <Table
            data={[
              ["", "email"],
              [m.inquiry_ticket(), "tickets@weeztix.com"],
              [m.inquiry_event(), "gbb@swissbeatbox.com"],
            ]}
            textCenter
          />
        </div>
      </div>
    </main>
  );
};
