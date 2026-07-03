import type { ReactNode } from "react";
import { Flag } from "~/components/Flag.js";
import { LinkCard } from "~/components/LinkCard.js";
import { ParticipantCard } from "~/components/ParticipantCard.js";
import { PostIt } from "~/components/PostIt.js";
import { Table } from "~/components/Table.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { anchorClass } from "~/constants/linkStyle.js";
import type {
  ParticipantDetailMember,
  ParticipantDetailParticipant,
  ParticipantWithRelations,
  PastParticipationEntry,
} from "~/db/participant.js";
import { getCountryName, resolveParticipantCountries } from "~/util/country.js";
import type { ProcessedBeatboxerSearch } from "~/util/tavily.js";
import {
  getParticipantDetailHref,
  getPastParticipationDetailHref,
} from "~/util/participant.js";
import * as m from "../../../paraglide/messages.js";

export type ParticipantMemberDetailContentProps = {
  locale: SupportedLanguage;
  displayName: string;
  year: number;
  categoryName: string;
  isCancelled: boolean;
  ticketClass: string;
  participant: ParticipantDetailParticipant;
  member: ParticipantDetailMember;
  pastParticipation: PastParticipationEntry[];
  pastYearParticipation: number[];
  sameYearCategoryPeers: ParticipantWithRelations[];
  tavily: ProcessedBeatboxerSearch;
};

/**
 * チームメンバー（member）の詳細ページ。
 */
export const ParticipantMemberDetailContent = ({
  locale,
  displayName,
  year,
  categoryName,
  isCancelled,
  ticketClass,
  participant,
  member,
  pastParticipation,
  pastYearParticipation,
  sameYearCategoryPeers,
  tavily,
}: ParticipantMemberDetailContentProps) => {
  const aiSearchQuery = encodeURIComponent(`${displayName} beatbox`);
  const searchAboutText = m.participant_search_about({ name: aiSearchQuery });
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchAboutText)}&udm=50`;
  const chatGptUrl = `https://chatgpt.com/?q=${encodeURIComponent(searchAboutText)}`;

  const teamHref = getParticipantDetailHref(locale, participant);
  const teamLink = teamHref ? (
    <a href={teamHref} className={anchorClass}>
      {participant.name}
    </a>
  ) : (
    participant.name
  );

  const profileRows: ReactNode[][] = [
    [
      "TEAM",
      isCancelled ? (
        <>
          <span className="text-white">{m.cancelled()}</span>
          <br />
          {teamLink}
        </>
      ) : (
        teamLink
      ),
    ],
  ];

  const pastRows: ReactNode[][] = [
    ["", m.rule_col_name(), m.rule_col_category()],
    ...pastParticipation.map((entry) => {
      const href = getPastParticipationDetailHref(locale, entry);
      const nameContent = href ? (
        <a href={href} className={anchorClass}>
          {entry.name}
        </a>
      ) : (
        entry.name
      );

      if (entry.isCancelled) {
        return [
          <span className="line-through">{entry.year}</span>,
          <>
            <span className="text-white">{m.cancelled()}</span>
            <br />
            {nameContent}
          </>,
          <span className="line-through">{entry.category}</span>,
        ];
      }

      return [entry.year, nameContent, entry.category];
    }),
  ];

  const peerRows: ReactNode[][] = [
    [m.participant_col_country(), m.rule_col_name(), m.participant_col_ticket()],
    ...sameYearCategoryPeers.map((peer) => {
      const countries = resolveParticipantCountries(peer);
      const countryLabel =
        countries.length > 1
          ? countries.map((c) => getCountryName(c, locale)).join(" / ")
          : getCountryName(peer.country, locale);
      const isoAlpha2 = peer.country.isoAlpha2?.toLowerCase() ?? null;
      const peerHref = getParticipantDetailHref(locale, peer);

      const nameCell = peerHref ? (
        <>
          {isoAlpha2 && !peer.isCancelled ? (
            <Flag isoAlpha2={isoAlpha2} className="mr-1" />
          ) : null}
          <a href={peerHref} className={anchorClass}>
            {peer.name}
          </a>
        </>
      ) : (
        peer.name
      );

      if (peer.isCancelled) {
        return [
          <span className="line-through">{countryLabel}</span>,
          <>
            <span className="text-white">{m.cancelled()}</span>
            <br />
            {nameCell}
          </>,
          <span className="line-through">{peer.ticketClass}</span>,
        ];
      }

      return [countryLabel, nameCell, peer.ticketClass];
    }),
  ];

  const pastYearButtonRows: number[][] = [];
  if (pastYearParticipation.length > 0) {
    pastYearButtonRows.push(pastYearParticipation.slice(0, 2));
    if (pastYearParticipation.length >= 3) {
      pastYearButtonRows.push(pastYearParticipation.slice(2));
    }
  }

  const accountUrlRows: ReactNode[][] = [
    ["", "SNS"],
    ...tavily.accountUrls.map((item) => [
      item.favicon ? (
        <img key={item.url} src={item.favicon} alt="" className="h-4 w-4" />
      ) : (
        ""
      ),
      <a
        key={item.url}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={anchorClass}
      >
        {item.title}
      </a>,
    ]),
  ];

  const finalUrlRows: ReactNode[][] = [
    ["", "WEB"],
    ...tavily.finalUrls.map((item) => [
      item.favicon ? (
        <img key={item.url} src={item.favicon} alt="" className="h-4 w-4" />
      ) : (
        ""
      ),
      <a
        key={item.url}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={anchorClass}
      >
        {item.title}
      </a>,
    ]),
  ];

  return (
    <main
      className="pt-16 pb-8 text-white"
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-8">
          <ParticipantCard
            name={displayName}
            isCancelled={isCancelled}
            imageUrl={tavily.avatarImageUrl || undefined}
            primaryInfo={
              <>
                {member.country.isoAlpha2 ? (
                  <Flag
                    isoAlpha2={member.country.isoAlpha2.toLowerCase()}
                    className="mr-1"
                  />
                ) : null}
                {getCountryName(member.country, locale)}
              </>
            }
            secondaryInfo={
              <span>
                {categoryName} / a member of {participant.name}
              </span>
            }
          />
        </div>

        {tavily.youtubeEmbedUrl ? (
          <div className="mb-8 flex justify-center">
            <div className="aspect-video w-full max-w-[560px]">
              <iframe
                src={tavily.youtubeEmbedUrl}
                title="YouTube video player"
                allow="autoplay; encrypted-media; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </div>
        ) : null}

        {tavily.answer ? (
          <PostIt>
            <p className="whitespace-pre-wrap text-balance">{tavily.answer}</p>
          </PostIt>
        ) : null}

        <h2 className="mb-4 text-center text-xl font-bold pt-36">
          {displayName} {m.participant_past_history()}
        </h2>
        {pastParticipation.length > 0 ? <Table data={pastRows} /> : null}

        {pastYearButtonRows.map((row, index) => (
          <div key={index} className="my-4 flex flex-wrap justify-center gap-2">
            {row.flatMap((pastYear) => [
              <LinkCard
                key={`${pastYear}-participants`}
                text={`GBB ${pastYear} ${m.participant_participants_list_year()}`}
                href={`/${locale}/${pastYear}/participants`}
              />,
              <LinkCard
                key={`${pastYear}-result`}
                text={`GBB ${pastYear} ${m.result()}`}
                href={`/${locale}/${pastYear}/result`}
              />,
            ])}
          </div>
        ))}

        <h2 className="mb-4 mt-8 text-center text-xl font-bold pt-36">
          {displayName} {m.participant_related_sites()}
        </h2>

        {tavily.accountUrls.length > 0 ? (
          <Table data={accountUrlRows} textCenter />
        ) : null}
        {tavily.finalUrls.length > 0 ? (
          <Table data={finalUrlRows} textCenter />
        ) : (
          <p className="my-8 text-center text-(--secondary-text-color)">
            {m.participant_no_related_sites()}
          </p>
        )}

        <PostIt>
          <p>
            {m.participant_related_disclaimer()}
            <br />
            {m.participant_related_disclaimer_note()}
          </p>
        </PostIt>

        <div className="my-4 flex flex-wrap justify-center gap-2">
          <LinkCard
            href={googleSearchUrl}
            text={`${m.participant_search_more()} - ${displayName}`}
            fullWidth
          />
        </div>
        <div className="my-4 flex flex-wrap justify-center gap-2">
          <LinkCard
            href={chatGptUrl}
            text={`${m.participant_ask_chatgpt({ ChatGPT: "ChatGPT" })} - ${displayName}`}
            fullWidth
          />
        </div>

        <h2 className="mb-4 mt-8 text-center text-xl font-bold pt-36">
          GBB {year} {categoryName} {m.participant_other_in_category()}
        </h2>
        {sameYearCategoryPeers.length > 0 ? (
          <Table data={peerRows} />
        ) : null}

        <div className="my-8 flex flex-wrap justify-center gap-2">
          <LinkCard
            href={`/${locale}/${year}/participants`}
            text={`GBB ${year} ${m.participant_all_participants()}`}
          />
          <LinkCard
            href={`/${locale}/${year}/result`}
            text={`GBB ${year} ${m.result()}`}
          />
        </div>
      </div>
    </main>
  );
};
