import type { SupportedLanguage } from "~/constants/languageLabels.js";
import type {
  TournamentResultWithRelations,
  RankingResultWithRelations,
} from "~/db/result.js";
import { SelectMenu } from "~/components/SelectMenu.js";
import { ParticipantCard } from "~/components/ParticipantCard.js";
import { ParticipantCountries } from "~/components/ParticipantCountries.js";
import { ResultCard } from "~/components/ResultCard.js";
import { categorySlug } from "~/util/category.js";
import { resolveParticipantCountries } from "~/util/country.js";
import { getParticipantDetailHref } from "~/util/participant.js";
import * as m from "../../../paraglide/messages.js";

const YEAR = 2017;

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

/**
 * ランキング1件を ParticipantCard で描画する。
 *
 * Args:
 *   entry: 順位エントリ。
 *   locale: 表示言語。
 *   avatarImageUrls: アバター URL マップ。
 *
 * Returns:
 *   順位カード。出場者が欠ける場合は null。
 */
const RankingResultCard = ({
  entry,
  locale,
  avatarImageUrls,
}: {
  entry: RankingResultWithRelations;
  locale: SupportedLanguage;
  avatarImageUrls: Record<string, string>;
}) => {
  const participant = entry.participantInfo;
  if (!participant?.country || !participant.categoryInfo) {
    return null;
  }

  const countries = resolveParticipantCountries(participant);

  return (
    <ParticipantCard
      name={participant.name}
      rank={entry.rank}
      isCancelled={participant.isCancelled}
      href={getParticipantDetailHref(locale, participant)}
      imageUrl={avatarImageUrls[participant.name]}
      primaryInfo={
        countries.length > 0 ? (
          <ParticipantCountries countries={countries} locale={locale} />
        ) : undefined
      }
      secondaryInfo={<span>{participant.ticketClass}</span>}
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
            {m.rule_update_pending()}
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
                <div className="space-y-8">
                  {entries.map((entry) => (
                    <RankingResultCard
                      key={entry.id}
                      entry={entry}
                      locale={locale}
                      avatarImageUrls={avatarImageUrls}
                    />
                  ))}
                </div>
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
