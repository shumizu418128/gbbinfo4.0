import type { ReactNode } from "react";
import { Flag } from "~/components/Flag.js";
import { ParticipantAvatar } from "~/components/ParticipantAvatar.js";
import { PostIt } from "~/components/PostIt.js";
import { Table } from "~/components/Table.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import type {
  ParticipantDetailMember,
  ParticipantDetailParticipant,
  ParticipantWithRelations,
  PastParticipationEntry,
} from "~/db/participant.js";
import { getCountryName, resolveParticipantCountries } from "~/util/country.js";
import type { ProcessedBeatboxerSearch } from "~/util/beatboxerSearchResults.js";
import { toParticipantDetailUrl, toParticipantUrl } from "~/util/participant.js";
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

type NavButtonProps = {
  href: string;
  children: ReactNode;
};

const NavButton = ({ href, children }: NavButtonProps) => (
  <a
    href={href}
    className="inline-flex min-h-16 flex-1 items-center justify-center bg-(--button-background-color) px-4 py-2 text-center text-sm font-bold text-white transition-colors duration-150 hover:bg-(--gbb-color)"
  >
    {children}
  </a>
);

const strikethrough = (cancelled: boolean, content: ReactNode): ReactNode =>
  cancelled ? <span className="line-through">{content}</span> : content;

const UrlResultTable = ({
  title,
  urls,
}: {
  title: string;
  urls: ProcessedBeatboxerSearch["accountUrls"];
}) => {
  if (urls.length === 0) {
    return null;
  }

  const rows: ReactNode[][] = [
    ["", title],
    ...urls.map((item) => [
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
        className="text-(--gbb-color) hover:underline"
      >
        {item.title}
      </a>,
    ]),
  ];

  return <Table data={rows} />;
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
  const countryRepHref =
    locale === "ko" ? `/${locale}/${year}/korea` : `/${locale}/${year}/japan`;
  const countryRepLabel =
    locale === "ko" ? m.team_korea() : m.team_japan();

  const teamLink = (
    <a
      href={toParticipantUrl(locale, {
        id: participant.id,
        isTeam: true,
      })}
      className="text-(--gbb-color) hover:underline"
    >
      {participant.name}
    </a>
  );

  const profileRows: ReactNode[][] = [
    [
      isCancelled ? `【${m.cancelled()}】` : "",
      strikethrough(isCancelled, displayName),
    ],
    [
      m.participant_team_label(),
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
    [m.rule_col_category(), strikethrough(isCancelled, categoryName)],
    [
      m.participant_col_country(),
      strikethrough(
        isCancelled,
        <>
          {member.country.isoAlpha2 ? (
            <Flag
              isoAlpha2={member.country.isoAlpha2.toLowerCase()}
              className="mr-1"
            />
          ) : null}
          {getCountryName(member.country, locale)}
        </>,
      ),
    ],
    [m.participant_col_ticket(), strikethrough(isCancelled, ticketClass)],
  ];

  const pastRows: ReactNode[][] = [
    ["", m.rule_col_name(), m.rule_col_category()],
    ...pastParticipation.map((entry) => {
      const link = (
        <a
          href={toParticipantDetailUrl(locale, entry)}
          className="text-(--gbb-color) hover:underline"
        >
          {entry.name}
        </a>
      );

      if (entry.isCancelled) {
        return [
          <span className="line-through">{entry.year}</span>,
          <>
            <span className="text-white">{m.cancelled()}</span>
            <br />
            {link}
          </>,
          <span className="line-through">{entry.category}</span>,
        ];
      }

      return [entry.year, link, entry.category];
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
      const peerHref = toParticipantUrl(locale, {
        id: peer.id,
        isTeam: peer.categoryInfo.isTeam,
      });

      const nameCell =
        peer.name === "???" ? (
          peer.name
        ) : (
          <>
            {isoAlpha2 && !peer.isCancelled ? (
              <Flag isoAlpha2={isoAlpha2} className="mr-1" />
            ) : null}
            <a href={peerHref} className="text-(--gbb-color) hover:underline">
              {peer.name}
            </a>
          </>
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

  return (
    <main
      className="pt-16 pb-8 text-white"
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <div className="mx-auto w-full max-w-2xl px-4">
        <h1 className="mb-8 text-center text-2xl font-bold">
          GBB {year} {displayName}
        </h1>

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
            <p className="whitespace-pre-wrap">{tavily.answer}</p>
          </PostIt>
        ) : null}

        <div className="mb-8 flex justify-center">
          <ParticipantAvatar name={displayName} size={120} />
        </div>

        <Table data={[["", displayName], ...profileRows]} />

        <div className="my-8 flex flex-wrap justify-center gap-2">
          <NavButton href={`/${locale}/${year}/participants`}>
            GBB {year} {m.participant_all_participants()}
          </NavButton>
          <NavButton href={`/${locale}/${year}/top`}>
            GBB {year} {m.participant_guide_only()}
          </NavButton>
        </div>

        <h2 className="mb-4 text-center text-xl font-bold">
          {displayName} {m.participant_past_history()}
        </h2>
        {pastParticipation.length > 0 ? <Table data={pastRows} /> : null}

        {pastYearButtonRows.map((row, index) => (
          <div key={index} className="my-4 flex flex-wrap justify-center gap-2">
            {row.flatMap((pastYear) => [
              <NavButton
                key={`${pastYear}-participants`}
                href={`/${locale}/${pastYear}/participants`}
              >
                GBB {pastYear} {m.participant_participants_list_year()}
              </NavButton>,
              <NavButton
                key={`${pastYear}-result`}
                href={`/${locale}/${pastYear}/result`}
              >
                GBB {pastYear} {m.result()}
              </NavButton>,
            ])}
          </div>
        ))}

        <h2 className="mb-4 mt-8 text-center text-xl font-bold">
          {displayName} {m.participant_related_sites()}
        </h2>

        <UrlResultTable title={m.participant_sns()} urls={tavily.accountUrls} />
        {tavily.finalUrls.length > 0 ? (
          <UrlResultTable title={m.participant_web()} urls={tavily.finalUrls} />
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
          <NavButton href={googleSearchUrl}>
            {m.participant_search_more()} - {displayName}
          </NavButton>
        </div>
        <div className="my-4 flex flex-wrap justify-center gap-2">
          <NavButton href={chatGptUrl}>
            {m.participant_ask_chatgpt()} - {displayName}
          </NavButton>
        </div>

        <h2 className="mb-4 mt-8 text-center text-xl font-bold">
          GBB {year} {categoryName} {m.participant_other_in_category()}
        </h2>
        {sameYearCategoryPeers.length > 0 ? (
          <Table data={peerRows} />
        ) : null}

        <div className="my-8 flex flex-wrap justify-center gap-2">
          <NavButton href={`/${locale}/${year}/participants`}>
            GBB {year} {m.participant_all_participants()}
          </NavButton>
          <NavButton href={countryRepHref}>
            GBB {year} {countryRepLabel}
          </NavButton>
          <NavButton href={`/${locale}/${year}/result`}>
            GBB {year} {m.result()}
          </NavButton>
        </div>
      </div>
    </main>
  );
};
