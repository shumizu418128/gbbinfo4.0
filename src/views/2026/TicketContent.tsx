import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { anchorClass } from "~/constants/linkStyle.js";
import { Table } from "~/components/Table.js";
import * as m from "../../../paraglide/messages.js";

type TicketContentProps = {
  locale: SupportedLanguage;
  year: number;
};

const VENUE_NAME = "COS Torwar";
const VENUE_MAP_URL = "https://maps.app.goo.gl/L9S927kARXL9dKJ78";
const TICKET_URL = "https://gbb.swissbeatbox.com";
const MAPS_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6121.336627009248!2d21.047471084987986!3d52.21967533280484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecd02df99729d%3A0x120bb57e07d1fd45!2sArena%20COS%20Torwar!5e0!3m2!1sen!2sjp!4v1776728225542!5m2!1sen!2sjp";

export const TicketContent = ({ locale, year }: TicketContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <ul className="list-disc pl-8 space-y-2 text-base">
          <li>{m.ticket_city()}</li>
          <li>
            {m.ticket_venue()}：
            <a
              href={VENUE_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={anchorClass}
            >
              {VENUE_NAME}
            </a>
          </li>
          <li>
            <a
              href={TICKET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={anchorClass}
            >
              {m.ticket_sales_page()}
            </a>
          </li>
        </ul>

        <div className="my-8 flex justify-center">
          <iframe
            src={MAPS_EMBED_SRC}
            width="400"
            height="300"
            style={{ border: 0, maxWidth: "100%" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={VENUE_NAME}
          />
        </div>
      </div>
    </main>
  );
};
