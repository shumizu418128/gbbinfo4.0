import type { SupportedLanguage } from "~/constants/languageLabels.js";
import * as m from "../../../paraglide/messages.js";

type TicketContentProps = {
  locale: SupportedLanguage;
  year: number;
};

export const TicketContent = (_props: TicketContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <ul className="list-disc pl-8 space-y-2 text-base">
          <li>{m.event_date_undecided()}</li>
          <li>{m.ticket_city()}</li>
          <li>
            {m.ticket_venue()}：{m.rule_update_pending()}
          </li>
        </ul>
      </div>
    </main>
  );
};
