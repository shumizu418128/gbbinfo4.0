import { ParticipantCard } from "~/components/ParticipantCard.js";
import { ParticipantCountries } from "~/components/ParticipantCountries.js";
import { WILDCARD } from "~/constants/i18nTerms.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import type { JudgeWithRelations } from "~/db/judge.js";
import * as m from "../../../paraglide/messages.js";

const REFEREE_CATEGORY_NAME = "Referee";
const UNKNOWN_ISO_CODE = 0;

type JudgesContentProps = {
  judges: JudgeWithRelations[];
  locale: SupportedLanguage;
  categoryOrder: number[];
  avatarImageUrls: Record<string, string>;
};

type JudgeGroup = {
  id: number;
  name: string;
  main: JudgeWithRelations[];
  wildcard: JudgeWithRelations[];
};

const groupJudges = (
  judges: JudgeWithRelations[],
  categoryOrder: number[],
): JudgeGroup[] => {
  const byCategory = new Map<number, JudgeWithRelations[]>();
  for (const judge of judges) {
    const list = byCategory.get(judge.category) ?? [];
    list.push(judge);
    byCategory.set(judge.category, list);
  }

  const orderedIds = [
    ...categoryOrder.filter((id) => byCategory.has(id)),
    ...[...byCategory.keys()]
      .filter((id) => !categoryOrder.includes(id))
      .sort((left, right) => left - right),
  ];

  return orderedIds.map((id) => {
    const rows = byCategory.get(id) ?? [];
    return {
      id,
      name: rows[0]?.categoryInfo.name ?? "",
      main: rows.filter((row) => row.panel === "main"),
      wildcard: rows.filter((row) => row.panel === "wildcard"),
    };
  });
};

const JudgeCards = ({
  judges,
  locale,
  avatarImageUrls,
}: {
  judges: JudgeWithRelations[];
  locale: SupportedLanguage;
  avatarImageUrls: Record<string, string>;
}) => (
  <div className="space-y-4">
    {judges.map((judge) => (
      <ParticipantCard
        key={judge.id}
        name={judge.name}
        imageUrl={avatarImageUrls[judge.name]}
        primaryInfo={
          judge.isoCode !== UNKNOWN_ISO_CODE ? (
            <ParticipantCountries
              countries={[judge.country]}
              locale={locale}
            />
          ) : undefined
        }
      />
    ))}
  </div>
);

export const JudgesContent = ({
  judges,
  locale,
  categoryOrder,
  avatarImageUrls,
}: JudgesContentProps) => {
  const groups = groupJudges(judges, categoryOrder);

  return (
    <main
      className="pt-16 pb-8 text-white"
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <div className="mx-auto w-full max-w-2xl px-4">
        {groups.length === 0 ? (
          <div className="py-40 text-center text-2xl text-(--secondary-text-color)">
            coming soon...
          </div>
        ) : (
          <div className="space-y-8">
            {groups.map((group) => (
              <section key={group.id}>
                <h2 className="mb-4 text-center text-2xl font-bold">{group.name}</h2>
                {group.name === REFEREE_CATEGORY_NAME ? (
                  <JudgeCards
                    judges={[...group.main, ...group.wildcard]}
                    locale={locale}
                    avatarImageUrls={avatarImageUrls}
                  />
                ) : (
                  <div className="space-y-8">
                    {group.main.length > 0 ? (
                      <div>
                        <h3 className="mb-4 text-center text-xl font-bold">
                          {m.rule_main_judges()}
                        </h3>
                        <JudgeCards
                          judges={group.main}
                          locale={locale}
                          avatarImageUrls={avatarImageUrls}
                        />
                      </div>
                    ) : null}
                    {group.wildcard.length > 0 ? (
                      <div>
                        <h3 className="mb-4 text-center text-xl font-bold">
                          {m.rule_wildcard_judges({ Wildcard: WILDCARD })}
                        </h3>
                        <JudgeCards
                          judges={group.wildcard}
                          locale={locale}
                          avatarImageUrls={avatarImageUrls}
                        />
                      </div>
                    ) : null}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
