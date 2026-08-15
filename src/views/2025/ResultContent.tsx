import type { SupportedLanguage } from "~/constants/languageLabels.js";
import type {
  TournamentResultWithRelations,
  RankingResultWithRelations,
} from "~/db/result.js";
import { SelectMenu } from "~/components/SelectMenu.js";
import { ParticipantCountries } from "~/components/ParticipantCountries.js";
import { ResultCard } from "~/components/ResultCard.js";
import { Table } from "~/components/Table.js";
import { categorySlug } from "~/util/category.js";
import { resolveParticipantCountries } from "~/util/country.js";
import {
  getParticipantDetailHref,
  toParticipantUrl,
} from "~/util/participant.js";

const YEAR = 2025;

type ResultContentProps = {
  locale: SupportedLanguage;
  selectedCategory: { name: string; isTeam: boolean };
  categoryNames: string[];
  tournamentResults: TournamentResultWithRelations[];
  rankingResults: RankingResultWithRelations[];
  avatarImageUrls: Record<string, string>;
};

/**
 * ラウンド名 null を "Overall" に変換する。
 *
 * Args:
 *   round: DB の round 文字列（null 可）。
 *
 * Returns:
 *   表示用ラウンド名。
 */
const toRoundLabel = (round: string | null): string => round ?? "Overall";

/**
 * アイテムをラウンドごとにグループ化する。
 *
 * Args:
 *   items: round フィールドを持つアイテム配列。
 *
 * Returns:
 *   ラウンド名をキーとした Map。
 */
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

/**
 * ランキング結果の Table 用データを組み立てる。
 *
 * Args:
 *   entries: ラウンド内の順位一覧。
 *   locale: 表示言語。
 *   isTeam: チーム部門かどうか。
 *
 * Returns:
 *   Table コンポーネント用の二次元配列。
 */
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

  return [["Rank", "Name"], ...rows];
};

/**
 * トーナメント出場者を ResultCard 用のリンク付き人物データに変換する。
 *
 * Args:
 *   participant: 勝者または敗者の出場者。
 *   locale: 表示言語。
 *
 * Returns:
 *   ResultCard 用データ。不足時は null。
 */
const toResultCardPerson = (
  participant:
    | TournamentResultWithRelations["winnerParticipant"]
    | TournamentResultWithRelations["loserParticipant"],
  locale: SupportedLanguage,
) => {
  if (!participant) {
    return null;
  }

  return {
    name: participant.name,
    href: getParticipantDetailHref(locale, {
      id: participant.id,
      name: participant.name,
      categoryInfo: participant.categoryInfo ?? { isTeam: false },
    }),
    countries: resolveParticipantCountries(participant),
  };
};

/**
 * トーナメント1試合分を ResultCard で描画する。
 *
 * Args:
 *   match: 対戦結果。
 *   locale: 表示言語。
 *   avatarImageUrls: 勝者アバター URL マップ。
 *
 * Returns:
 *   試合カード。勝者/敗者が欠ける場合は null。
 */
const TournamentMatchRow = ({
  match,
  locale,
  avatarImageUrls,
}: {
  match: TournamentResultWithRelations;
  locale: SupportedLanguage;
  avatarImageUrls: Record<string, string>;
}) => {
  const winner = toResultCardPerson(match.winnerParticipant, locale);
  const loser = toResultCardPerson(match.loserParticipant, locale);
  if (!winner || !loser) {
    return null;
  }

  return (
    <ResultCard
      winner={{
        ...winner,
        imageUrl: avatarImageUrls[winner.name],
      }}
      loser={loser}
    />
  );
};

export const ResultContent = ({
  locale,
  selectedCategory,
  categoryNames,
  tournamentResults,
  rankingResults,
  avatarImageUrls,
}: ResultContentProps) => {
  const basePath = `/${locale}/${YEAR}/result`;
  const categoryItems = categoryNames.map((name) => ({
    key: name,
    href: `${basePath}/${categorySlug(name)}`,
    label: name,
    isActive: name === selectedCategory.name,
  }));

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

        {!hasResults ? (
          <div className="py-40 text-center text-2xl text-(--secondary-text-color)">
            coming soon...
          </div>
        ) : hasTournament && tournamentByRound ? (
          <div className="space-y-8">
            {Array.from(tournamentByRound.entries()).map(([round, matches]) => (
              <section key={round} className="mb-18">
                <h2 className="mb-4 text-xl font-bold">
                  {selectedCategory.name} - {round}
                </h2>
                <div className="space-y-8">
                  {matches.map((match) => (
                    <TournamentMatchRow
                      key={match.id}
                      match={match}
                      locale={locale}
                      avatarImageUrls={avatarImageUrls}
                    />
                  ))}
                </div>
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
