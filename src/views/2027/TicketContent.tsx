import * as m from "../../../paraglide/messages.js";

export const TicketContent = () => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <ul className="list-disc space-y-2 pl-8 text-base">
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
