import type { SupportedLanguage } from "~/constants/languageLabels.js";
import type {
  TournamentResultWithRelations,
  RankingResultWithRelations,
} from "~/db/result.js";
import { SelectMenu } from "~/components/SelectMenu.js";
import { Flag } from "~/components/Flag.js";
import { ParticipantCountries } from "~/components/ParticipantCountries.js";
import { Table } from "~/components/Table.js";
import { categorySlug } from "~/util/category.js";
import { resolveParticipantCountries } from "~/util/country.js";
import { toParticipantUrl } from "~/util/participant.js";
import * as m from "../../../paraglide/messages.js";

const YEAR = 2023;

type ResultContentProps = {
  locale: SupportedLanguage;
  selectedCategory: { name: string; isTeam: boolean };
  categoryNames: string[];
  tournamentResults: TournamentResultWithRelations[];
  rankingResults: RankingResultWithRelations[];
};

const toRoundLabel = (round: string | null): string => round ?? "Overall";

const groupByRound = <T extends { round: string | null }>(
  items: T[],
): Map<string, T[]> => {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const label = toRoundLabel(item.round);
    const existing = map.get(label);
    if (existing) {
      existing.push(item);
    } else {
      map.set(label, [item]);
    }
  }
  return map;
};

const RESULT_TABLE_CLASS = "w-full border-collapse";
const TOURNAMENT_COLUMN_WIDTHS = [5, 1, 4] as const;

const buildTournamentTableData = (
  matches: TournamentResultWithRelations[],
  locale: SupportedLanguage,
  isTeam: boolean,
) => {
  const rows = matches.flatMap((match) => {
    const { winnerParticipant, loserParticipant } = match;
    if (!winnerParticipant || !loserParticipant) return [];

    const winnerCountries = resolveParticipantCountries(winnerParticipant);
    const loserCountries = resolveParticipantCountries(loserParticipant);
    const winnerHref = toParticipantUrl(locale, {
      id: winnerParticipant.id,
      isTeam,
    });
    const loserHref = toParticipantUrl(locale, {
      id: loserParticipant.id,
      isTeam,
    });

    return [
      [
        <a
          key={`${match.id}-winner`}
          href={winnerHref}
          className="inline-flex items-center gap-2 text-(--gbb-color) hover:underline"
        >
          {winnerCountries.map((country) => (
            <Flag key={country.isoCode} isoAlpha2={country.isoAlpha2} />
          ))}
          <span>{winnerParticipant.name.toUpperCase()}</span>
        </a>,
        <span
          key={`${match.id}-vs`}
          className="block text-center text-(--secondary-text-color)"
        >
          vs
        </span>,
        <a
          key={`${match.id}-loser`}
          href={loserHref}
          className="inline-flex items-center gap-2 hover:underline"
        >
          {loserCountries.map((country) => (
            <Flag key={country.isoCode} isoAlpha2={country.isoAlpha2} />
          ))}
          <span>{loserParticipant.name.toUpperCase()}</span>
        </a>,
      ],
    ];
  });

  return [
    [
      <span key="winner-header" className="text-(--gbb-color)">
        {m.result_win()}
      </span>,
      "",
      m.result_lose(),
    ],
    ...rows,
  ];
};

const buildRankingTableData = (
  entries: RankingResultWithRelations[],
  locale: SupportedLanguage,
  isTeam: boolean,
) => {
  const rows = entries.flatMap((entry) => {
    const participant = entry.participantInfo;
    if (!participant) return [];

    const countries = resolveParticipantCountries(participant);
    const href = toParticipantUrl(locale, {
      id: participant.id,
      isTeam,
    });

    return [
      [
        <span
          key={`${entry.id}-rank`}
          className="block text-center text-(--secondary-text-color)"
        >
          {entry.rank}
        </span>,
        <a
          key={`${entry.id}-name`}
          href={href}
          className="inline-flex items-center gap-2 hover:underline"
        >
          <ParticipantCountries countries={countries} locale={locale} />
          <span>{participant.name.toUpperCase()}</span>
        </a>,
      ],
    ];
  });

  return [[m.result_rank(), m.result_name()], ...rows];
};

export const ResultContent = ({
  locale,
  selectedCategory,
  categoryNames,
  tournamentResults,
  rankingResults,
}: ResultContentProps) => {
  const basePath = `/${locale}/${YEAR}/result`;
  const categoryItems = categoryNames.map((name) => ({
    key: name,
    href: `${basePath}/${categorySlug(name)}`,
    label: name,
    isActive: name === selectedCategory.name,
  }));

  const isShowcaseCategory = selectedCategory.name
    .toUpperCase()
    .startsWith("SHOWCASE");
  const hasTournament = tournamentResults.length > 0;
  const hasRanking = rankingResults.length > 0;
  const hasResults = hasTournament || hasRanking;

  const tournamentByRound = hasTournament ? groupByRound(tournamentResults) : null;
  const rankingByRound = hasRanking ? groupByRound(rankingResults) : null;

  return (
    <main
      className="pt-16 pb-8 text-white"
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-10 flex justify-center">
          <SelectMenu label={selectedCategory.name} items={categoryItems} />
        </div>

        {isShowcaseCategory ? (
          <div className="py-40 text-center text-2xl text-(--secondary-text-color) text-balance">
            {m.result_showcase_no_results({ SHOWCASE: "SHOWCASE" })}
          </div>
        ) : !hasResults ? (
          <div className="py-40 text-center text-2xl text-(--secondary-text-color)">
            {m.rule_update_pending()}
          </div>
        ) : hasTournament && tournamentByRound ? (
          <div className="space-y-8">
            {Array.from(tournamentByRound.entries()).map(([round, matches]) => (
              <section key={round} className="mb-18">
                <h2 className="mb-4 text-xl font-bold">
                  {selectedCategory.name} - {round}
                </h2>
                <Table
                  data={buildTournamentTableData(
                    matches,
                    locale,
                    selectedCategory.isTeam,
                  )}
                  columnWidths={[...TOURNAMENT_COLUMN_WIDTHS]}
                  className={RESULT_TABLE_CLASS}
                />
              </section>
            ))}
          </div>
        ) : rankingByRound ? (
          <div className="space-y-8">
            {Array.from(rankingByRound.entries()).map(([round, entries]) => (
              <section key={round} className="mb-18">
                <h2 className="mb-4 text-xl font-bold">
                  {selectedCategory.name} - {round}
                </h2>
                <Table
                  data={buildRankingTableData(
                    entries,
                    locale,
                    selectedCategory.isTeam,
                  )}
                  className={RESULT_TABLE_CLASS}
                />
              </section>
            ))}
          </div>
        ) : null}

        <div className="mt-10 flex justify-center">
          <SelectMenu label={selectedCategory.name} items={categoryItems} />
        </div>
      </div>
    </main>
  );
};
