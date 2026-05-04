import { GeneralButton } from "~/components/GeneralButton";
import { Table } from "~/components/Table";
import * as m from '../../paraglide/messages';

type TopContentProps = {
  locale: string;
};

export const TopContent = ({ locale }: TopContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-18 flex flex-wrap gap-4">
          <GeneralButton
            text={<span>{m.wildcard_result({ Wildcard: "Wildcard" })}<br />{m.participants()}</span>}
            image="/images/sora.webp"
            href={`/${locale}/2026/participants`}
          />
          <GeneralButton text={<span>{m.rules()}<br />{m.judges()}</span>} image="/images/mahiro.webp" href="#" />
          <GeneralButton text={m.time_table()} image="/images/scott_jackson.webp" href="#" disabled />
          <GeneralButton text={m.team_japan()} image="/images/team_japan.webp" href="#" />
        </div>
        <div className="mb-18 flex flex-wrap gap-4">
          <GeneralButton text={m.withdrawn_list()} image="/images/b4start.webp" href="#" />
          <GeneralButton text={m.venue_tickets()} image="/images/dice.webp" href="#" />
          <GeneralButton text={m.livestream()} image="/images/sinjo.webp" href="#" disabled />
          <GeneralButton text={m.result()} image="/images/winner.webp" href="#" disabled />
        </div>
      </div>

      <div className="flex justify-center w-full">
        <ul className="w-full max-w-md list-disc text-left px-12 gap-6 mb-18">
          <li>
            <a
              href="#"
              className="underline transition-colors duration-150 hover:text-(--gbb-color)"
            >
              {m.site_url_notice()}
            </a>
          </li>
          <li>
            <a
              href="#"
              className="underline transition-colors duration-150 hover:text-(--gbb-color)"
            >
              {m.wildcard_stream({ Wildcard: "Wildcard" })}
            </a>
          </li>
          <li>
            <a
              href="#"
              className="underline transition-colors duration-150 hover:text-(--gbb-color)"
            >
              {m.wildcard_list({ Wildcard: "Wildcard" })}
            </a>
          </li>
        </ul>
      </div>

      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-18 flex flex-wrap gap-4">
          <GeneralButton text={m.go_to_poland()} image="/images/zenhit.webp" href="#" />
          <GeneralButton text="7toSmoke" image="/images/afterparty.webp" href="#" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="bg-(--section-color) p-8 text-white mb-12">
          <h2 className="text-2xl font-bold mb-2 text-center">お問い合わせ</h2>
          <hr className="border-(--gbb-color) mb-4" />
          <Table data={[["", "email"], [m.inquiry_ticket(), "gbb@swissbeatbox.com"], [m.inquiry_event(), "tickets@weeztix.com"]]} textCenter />
        </div>
      </div>
    </main>
  );
}
