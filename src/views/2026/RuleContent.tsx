import type { ReactNode } from "react";
import { LinkCard } from "~/components/LinkCard.js";
import { PostIt } from "~/components/PostIt.js";
import { RuleSeedTable } from "~/components/RuleSeedTable.js";
import { Table } from "~/components/Table.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { anchorClass } from "~/constants/linkStyle.js";
import type { ParticipantWithRelations } from "~/db/participant.js";
import * as m from "../../../paraglide/messages.js";

type RuleSeedData = {
  gbbSeed: ParticipantWithRelations[];
  otherSeed: ParticipantWithRelations[];
  cancelled: ParticipantWithRelations[];
};

type RuleContentProps = {
  locale: SupportedLanguage;
  year: number;
  seedData: RuleSeedData;
};

const WILDCARD = "Wildcard";
const SHOWCASE = "SHOWCASE";
const SWISSBEATBOX = "Swissbeatbox";
const GBB = "GBB";
const SOLO = "Solo";
const RC505 = "RC505";

const sectionClass = "mb-4 text-2xl font-bold";
const tocSectionClass = "mb-4 text-2xl font-bold";
const paragraphClass = "mb-4 leading-relaxed";
const subSectionClass = "mb-4 font-bold";
const ruleSubSectionClass = "mt-8 bg-(--section-color) px-4 py-8";
const ruleSectionClass = "bg-(--background-color) py-16 text-white";

const RuleSection = ({ children }: { children: ReactNode }) => (
  <section className={ruleSectionClass}>
    <div className="mx-auto w-full max-w-2xl px-4">{children}</div>
  </section>
);

const RuleSectionHeading = ({
  id,
  scrollKey,
  children,
  className = sectionClass,
}: {
  id: string;
  /** 3.0 互換の ?scroll= 値。id と異なるときのみ指定する。 */
  scrollKey?: string;
  children: ReactNode;
  className?: string;
}) => (
  <h2 id={id} data-scroll-key={scrollKey} className={className}>
    {children}
  </h2>
);

const RuleSubSection = ({ children }: { children: ReactNode }) => (
  <div className={ruleSubSectionClass}>{children}</div>
);

const RuleSubHeading = ({ children }: { children: ReactNode }) => (
  <h2 className={subSectionClass}>{children}</h2>
);

export const RuleContent = ({ locale, year, seedData }: RuleContentProps) => {
  const prevYear = year - 1;
  const nextYear = year + 1;
  const participantsPath = `/${locale}/${year}/participants`;

  return (
    <main className="bg-(--background-color) pt-16">
      <RuleSection>
        <RuleSectionHeading id="toc-section" className={tocSectionClass}>
          {m.rule_toc()}
        </RuleSectionHeading>
        <ol className="mb-8 list-decimal space-y-2 pl-8">
          <li>
            <a href="#notices-section" className={anchorClass}>
              {m.rule_toc_notices()}
            </a>
          </li>
          <li>
            <a href="#category-section" className={anchorClass}>
              {m.rule_toc_categories()}
            </a>
          </li>
          <li>
            <a href="#showcase-detail-section" className={anchorClass}>
              {m.rule_showcase_title({ SHOWCASE })}
            </a>
          </li>
          <li>
            <a href="#comeback-wildcard-section" className={anchorClass}>
              COMEBACK Wildcard
            </a>
          </li>
          <li>
            <a href="#seeds-section" className={anchorClass}>
              {m.rule_toc_challenger()}
            </a>
          </li>
          <li>
            <a href="#replacement-section" className={anchorClass}>
              {m.rule_toc_replacement()}
            </a>
          </li>
          <li>
            <a href="#wildcard-rules-section" className={anchorClass}>
              Wildcard {m.rule_wildcard_deadline()}
            </a>
          </li>
          <li>
            <a href="#main-judges-section" className={anchorClass}>
              GBB {year} {m.rule_main_judges()}
            </a>
          </li>
          <li>
            <a href="#wildcard-judges-section" className={anchorClass}>
              {m.rule_wildcard_judges({ Wildcard: WILDCARD })}
            </a>
          </li>
          <li>
            <a href="#second-league-section" className={anchorClass}>
              {m.rule_second_league()}
            </a>
          </li>
        </ol>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="notices-section">
          {m.rule_toc_notices()}
        </RuleSectionHeading>
        <p className={paragraphClass}>
          {m.rule_notices_p1({ Beatbox: "Beatbox" })}
          <br />
          {m.rule_notices_p1_note()}
          <strong>{m.rule_notices_p1_strong()}</strong>
        </p>
        <p className={paragraphClass}>
          {m.rule_notices_p2()}
          <br />
          {m.rule_notices_p2_prefix({ Wildcard: WILDCARD })}
          <strong className="text-red-500">{m.rule_notices_p2_strong()}</strong>
        </p>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="category-section">
          {m.rule_toc_categories()}
        </RuleSectionHeading>
        <p className={paragraphClass}>
          <span className="text-(--gbb-color)">CS</span> = {m.rule_cs_equals()}
        </p>
        <Table
          data={[
            [
              m.rule_col_category(),
              "Wildcard",
              "CS",
              `GBB\n${prevYear}`,
              m.rule_col_total(),
            ],
            [
              "Solo",
              <>
                9
                <br />+{" "}
                <a href="#comeback-wildcard-section" className={anchorClass}>
                  COMEBACK
                </a>
              </>,
              "7",
              "3",
              "20",
            ],
            ["Loopstation", "5", "2", "1", "8"],
            ["Tag Team", "6", "1", "1", "8"],
            ["Crew", "1", "1", "0", "2"],
            ["SHOWCASE\n(producer)", "2", "0", "0", "2"],
            [
              "SHOWCASE\n(loopstation)",
              <a href="#showcase-detail-section" className={anchorClass} key="sl">
                {m.rule_unknown()}
              </a>,
              "0",
              "0",
              <a href="#showcase-detail-section" className={anchorClass} key="sl-t">
                {m.rule_unknown()}
              </a>,
            ],
            [
              "SHOWCASE\n(solo)",
              <a href="#showcase-detail-section" className={anchorClass} key="ss">
                {m.rule_unknown()}
              </a>,
              "0",
              "0",
              <a href="#showcase-detail-section" className={anchorClass} key="ss-t">
                {m.rule_unknown()}
              </a>,
            ],
          ]}
          textCenter
        />
        <p className={paragraphClass}>
          {m.rule_forgotten_ttl({ TagTeamLoopstation: "Tag Team Loopstation" })}
          😭
        </p>
        <p className={paragraphClass}>{m.rule_category_note()}</p>

        <RuleSubSection>
          <RuleSubHeading>
            {m.rule_solo_final_title({ Solo: "Solo" })}
          </RuleSubHeading>
          <p className={paragraphClass}>
            {m.rule_solo_final_p1({ year: String(year), Solo: "Solo" })}
            <br />
            {m.rule_solo_final_p2()}
          </p>
        </RuleSubSection>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="showcase-detail-section">
          {m.rule_showcase_title({ SHOWCASE })}
        </RuleSectionHeading>
        <p className={paragraphClass}>
          {m.rule_showcase_p1({ SHOWCASE })}
          <br />
          {m.rule_showcase_p1_battle()}
          <br />
          {m.rule_showcase_p1_review({ Wildcard: WILDCARD })}
        </p>
        <p className={paragraphClass}>
          {m.rule_showcase_p2({
            SHOWCASE,
            Solo: "Solo",
            Loopstation: "Loopstation",
            Swissbeatbox: SWISSBEATBOX,
          })}
        </p>

        <div className="mb-8">
          <LinkCard
            text={
              <span>
                {m.wildcard_result_and_participants({ Wildcard: WILDCARD })}
              </span>
            }
            href={participantsPath}
            fullWidth

          />
        </div>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="comeback-wildcard-section">
          COMEBACK Wildcard
        </RuleSectionHeading>
        <p className={paragraphClass}>
          {m.rule_comeback_intro({
            ComebackWildcard: "COMEBACK Wildcard",
            SoloWildcard: "Solo Wildcard",
            Beatboxer: "Beatboxer",
          })}
        </p>
        <RuleSubSection>
          <RuleSubHeading>{m.rule_target()}</RuleSubHeading>
          <p className={paragraphClass}>
            {m.rule_comeback_target({
              year: String(year),
              GBB,
              Solo: SOLO,
              Wildcard: WILDCARD,
            })}
          </p>
        </RuleSubSection>
        <RuleSubSection>
          <RuleSubHeading>{m.rule_selection_flow()}</RuleSubHeading>
          <ol className="mb-8 list-decimal space-y-4 pl-8">
          <li>
            <strong>{m.rule_judge_nomination()}</strong>
            <br />
            {m.rule_judge_nomination_detail()}
            <PostIt>
              <p>{m.rule_judge_nomination_note({ Beatboxer: "Beatboxer" })}</p>
            </PostIt>
          </li>
          <li>
            <strong>
              {m.rule_revote({
                Swissbeatbox: SWISSBEATBOX,
                YouTube: "YouTube",
              })}
            </strong>
            <ul className="mt-2 list-disc space-y-2 pl-8">
              <li>{m.rule_judge_vote()}</li>
              <li>
                {m.rule_member_vote({
                  Swissbeatbox: SWISSBEATBOX,
                  YouTube: "YouTube",
                })}
              </li>
            </ul>
          </li>
          <li>
            <strong>{m.rule_winner_decision()}</strong>
            <br />
            {m.rule_winner_decision_detail({
              year: String(year),
              Swissbeatbox: SWISSBEATBOX,
              YouTube: "YouTube",
            })}
          </li>
          </ol>
        </RuleSubSection>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="seeds-section">
          {m.rule_seeds_title()}
        </RuleSectionHeading>
        <p className={paragraphClass}>{m.rule_seeds_intro()}</p>
        <ul className="mb-8 list-disc space-y-2 pl-8">
          <li>
            GBB {prevYear} {m.rule_top_winners()}
          </li>
          <li>
            {m.rule_toc_challenger()} {m.rule_challenger_winners_only()}
          </li>
          <li>Wildcard</li>
        </ul>

        <RuleSubSection>
          <RuleSubHeading>
            {m.rule_seeds_gbb_title({ prevYear: String(prevYear) })}
          </RuleSubHeading>
          <RuleSeedTable participants={seedData.gbbSeed} locale={locale} />
        </RuleSubSection>

        <RuleSubSection>
          <RuleSubHeading>{m.rule_seeds_cs_title()}</RuleSubHeading>
          <RuleSeedTable participants={seedData.otherSeed} locale={locale} />
          <PostIt>
            <p>
              {m.rule_seeds_cs_note()}
              <br />
              {m.rule_seeds_cs_example({ Wildcard: WILDCARD })}
            </p>
          </PostIt>
        </RuleSubSection>

        <RuleSubSection>
          <RuleSubHeading>{m.rule_seeds_cancelled()}</RuleSubHeading>
          <RuleSeedTable participants={seedData.cancelled} cancelled locale={locale} />
        </RuleSubSection>

        <div className="mb-8 mt-8">
          <LinkCard
            text={
              <span>
                {m.wildcard_result_and_participants({ Wildcard: WILDCARD })}
              </span>
            }
            href={participantsPath}
            fullWidth

          />
        </div>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="replacement-section">
          {m.rule_replacement_title()}
        </RuleSectionHeading>
        <p className={paragraphClass}>
          {m.rule_replacement_intro({ Wildcard: WILDCARD })}
        </p>

        <RuleSubSection>
          <RuleSubHeading>{m.rule_replacement_deadline()}</RuleSubHeading>
          <Table
            data={[
              [m.rule_deadline(), m.rule_response()],
              [m.rule_before_aug1(), m.rule_before_aug1_detail({ Wildcard: WILDCARD })],
              [m.rule_after_aug1(), m.rule_after_aug1_detail({ Swissbeatbox: SWISSBEATBOX })],
            ]}
            textCenter
          />
        </RuleSubSection>

        <RuleSubSection>
          <RuleSubHeading>{m.rule_replacement_target()}</RuleSubHeading>
          <p className={paragraphClass}>
            {m.rule_replacement_target_p1({ Wildcard: WILDCARD })}
            <br />
            {m.rule_replacement_target_p2()}
          </p>
          <Table
            data={[
              [m.rule_col_category(), m.rule_col_target(), ""],
              [
                "Solo",
                m.rule_rank_until({ rank: "15" }),
                m.rule_rank_no_replacement({ rank: "16" }),
              ],
              [
                "Loopstation",
                m.rule_rank_until({ rank: "20" }),
                m.rule_rank_swiss_decision({ rank: "21", Swissbeatbox: SWISSBEATBOX }),
              ],
              [
                "Tag Team",
                m.rule_rank_until({ rank: "10" }),
                m.rule_rank_no_replacement({ rank: "11" }),
              ],
              [
                "Crew",
                m.rule_rank_until({ rank: "5" }),
                m.rule_rank_no_replacement({ rank: "6" }),
              ],
            ]}
            textCenter
          />
        </RuleSubSection>

        <RuleSubSection>
          <RuleSubHeading>{m.rule_special_cases()}</RuleSubHeading>
          <Table
            data={[
              [m.rule_col_item(), m.rule_col_description()],
              [
                <strong key="solo">Solo</strong>,
                <ul key="solo-ul" className="list-disc space-y-2 pl-8 text-left">
                  <li>
                    {m.rule_special_solo_1({
                      prevYear: String(prevYear),
                      Wildcard: WILDCARD,
                    })}
                  </li>
                  <li>{m.rule_special_solo_2({ Wildcard: WILDCARD })}</li>
                  <li>
                    {m.rule_special_solo_3({
                      prevYear: String(prevYear),
                      SevenToSmoke: "7toSmoke",
                    })}
                  </li>
                </ul>,
              ],
              [
                <strong key="loop">Loopstation</strong>,
                <ul key="loop-ul" className="list-disc space-y-2 pl-8 text-left">
                  <li>
                    {m.rule_special_loop_1({
                      prevYear: String(prevYear),
                      Loopstation: "Loopstation",
                    })}
                  </li>
                  <li>{m.rule_special_loop_2({ Wildcard: WILDCARD })}</li>
                </ul>,
              ],
              [
                <strong key="crew">Crew</strong>,
                m.rule_special_crew({ Showcase: SHOWCASE }),
              ],
            ]}
          />
        </RuleSubSection>

      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="wildcard-rules-section" scrollKey="result_date">
          {m.rule_wildcard_deadline_title({ Wildcard: WILDCARD })}
        </RuleSectionHeading>
        <Table
          data={[
            [m.rule_col_category(), m.rule_col_deadline_rule()],
            [
              m.rule_all_categories(),
              <>
                {m.rule_submission_start()} 1/1 00:01 am CET
                <br />
                {m.rule_penalty_overtime()}
                <br />
                {m.rule_penalty_undertime()}
              </>,
            ],
            [
              "Solo",
              <>
                {m.rule_time_limit()} 2:00 (±10s)
                <br />
                {m.rule_penalty_duration({ m: "2", s: "11" })}
                <br />
                {m.rule_submission_deadline()} {m.rule_march1()} 23:59 CET
                <br />
                {m.rule_result_announcement()} {m.rule_march28_30()}
              </>,
            ],
            [
              "Tag Team",
              <>
                {m.rule_time_limit()} 2:00 (±10s)
                <br />
                {m.rule_penalty_duration({ m: "2", s: "11" })}
                <br />
                {m.rule_submission_deadline()} {m.rule_march14()} 23:59 CET
                <br />
                {m.rule_result_announcement()} {m.rule_march23_24()}
              </>,
            ],
            [
              "Loopstation",
              <>
                {m.rule_time_limit()} 3:00~3:30 (±0s)
                <br />
                {m.rule_penalty_duration({ m: "3", s: "31" })}
                <br />
                {m.rule_submission_deadline()} {m.rule_march1()} 23:59 CET
                <br />
                {m.rule_result_announcement()} {m.rule_march25_27()}
                <br />
                {m.rule_rc505_only({ RC505 })}
              </>,
            ],
            [
              "Crew",
              <>
                {m.rule_time_limit()} 3:00 (±10s)
                <br />
                {m.rule_penalty_duration({ m: "3", s: "11" })}
                <br />
                {m.rule_submission_deadline()} {m.rule_april12()} 23:59 CET
                <br />
                {m.rule_result_announcement()} {m.rule_may1_2()}
              </>,
            ],
            [
              "SHOWCASE\n(producer)",
              <>
                {m.rule_time_limit()} 3:30~5:00 (±0s)
                <br />
                {m.rule_penalty_duration({ m: "5", s: "01" })}
                <br />
                {m.rule_submission_deadline()} {m.rule_april12()} 23:59 CET
                <br />
                {m.rule_result_announcement()} {m.rule_may3_4()}
                <br />
                {m.rule_no_device_limit()}
              </>,
            ],
            [
              "SHOWCASE\n(loopstation)",
              <>
                {m.rule_showcase_loop_recording()}
                <br />
                {m.rule_submission_deadline()} {m.rule_unknown()}
                <br />
                {m.rule_result_announcement()} {m.rule_summer_announcement()}
                <br />
                {m.rule_no_device_limit()}
              </>,
            ],
            [
              "SHOWCASE\n(solo)",
              <>
                {m.rule_showcase_loop_recording()}
                <br />
                {m.rule_submission_deadline()} {m.rule_unknown()}
                <br />
                {m.rule_result_announcement()} {m.rule_summer_announcement()}
              </>,
            ],
          ]}
          textCenter
        />

        <RuleSubSection>
          <RuleSubHeading>
            Solo / Loopstation {m.rule_special_rules()}
          </RuleSubHeading>
          <p className={paragraphClass}>{m.rule_special_scoring()}</p>
        </RuleSubSection>

        <RuleSubSection>
          <RuleSubHeading>
            SHOWCASE (loopstation) / SHOWCASE (solo) {m.rule_showcase_eligibility()}
          </RuleSubHeading>
          <p className={paragraphClass}>{m.rule_showcase_eligibility_intro()}</p>
          <Table
            data={[
              [m.rule_eligibility_condition(), m.rule_eligibility_detail()],
              [
                m.rule_eligibility_past_gbb(),
                <ul key="past" className="list-disc space-y-2 pl-8 text-left">
                  <li>{m.rule_eligibility_gbb2019()}</li>
                  <li>{m.rule_eligibility_7tosmoke({ SevenToSmoke: "7toSmoke" })}</li>
                </ul>,
              ],
              [
                m.rule_eligibility_wildcard_rank({ Wildcard: WILDCARD }),
                <ul key="wc" className="list-disc space-y-2 pl-8 text-left">
                  <li>Solo: {m.rule_eligibility_solo_top30()}</li>
                  <li>Loopstation: {m.rule_eligibility_loop_top20()}</li>
                </ul>,
              ],
              [
                m.rule_eligibility_pro(),
                <ul key="pro" className="list-disc space-y-2 pl-8 text-left">
                  <li>{m.rule_eligibility_pro_show()}</li>
                  <li>{m.rule_eligibility_pro_performed()}</li>
                </ul>,
              ],
              [
                <>
                  {m.rule_eligibility_main_judge({ year: String(year) })}
                  <br />({m.rule_eligibility_main_judge_note({ Wildcard: WILDCARD })})
                </>,
                m.rule_eligibility_judge_ok(),
              ],
            ]}
          />
          <p className={paragraphClass}>
            {m.rule_showcase_cannot_apply({ year: String(year) })}
            <br />
            {m.rule_showcase_age_limit({ year: String(year) })}
          </p>
        </RuleSubSection>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="main-judges-section" scrollKey="judges">
          {m.rule_main_judges()}
        </RuleSectionHeading>
        <p className="mb-4 text-center">
          <a href="#wildcard-judges-section" className={anchorClass}>
            {m.rule_wildcard_judges_link({ Wildcard: WILDCARD })}
          </a>
        </p>
        <Table
          data={[
            [m.rule_col_category(), m.rule_col_judges()],
            ["Solo", m.rule_update_pending()],
            ["Tag Team", m.rule_update_pending()],
            ["Loopstation", m.rule_update_pending()],
            ["Crew", m.rule_update_pending()],
            ["SHOWCASE\n(producer)", m.rule_no_judges()],
            ["SHOWCASE\n(loopstation)", m.rule_no_judges()],
            ["SHOWCASE\n(solo)", m.rule_no_judges()],
            [
              "7toSmoke",
              <>
                {m.rule_judges_unknown()}
                <br />
                {m.rule_judges_not_announced()}
              </>,
            ],
            [m.rule_referee(), m.rule_update_pending()],
          ]}
          textCenter
        />
        <PostIt>
          <p>
            <strong>{m.rule_referee_about()}</strong>
            <br />
            {m.rule_referee_detail()}
          </p>
        </PostIt>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="wildcard-judges-section">
          {m.rule_wildcard_judges({ Wildcard: WILDCARD })}
        </RuleSectionHeading>
        <Table
          data={[
            [m.rule_col_category(), m.rule_col_judges()],
            [
              "Solo",
              <>
                COLAPS
                <br />
                ZEDE
                <br />
                NAPOM
                <br />
                SKILLER
                <br />
                WING
              </>,
            ],
            [
              "Tag Team",
              <>
                MAXO
                <br />
                JOHN-T
                <br />
                CHRIS CELIZ
              </>,
            ],
            [
              "Loopstation",
              <>
                ZHANG ZE
                <br />
                SYJO
                <br />
                YASWEDE
                <br />
                BIZKIT
                <br />
                SARO
              </>,
            ],
            [
              "Crew",
              <>
                CHRIS CELIZ
                <br />
                EPOCK
                <br />
                EON
              </>,
            ],
            [
              "SHOWCASE\n(producer)",
              <>
                FRIIDON
                <br />
                KRISTOF
                <br />
                KBA
                <br />
                KAOS
                <br />
                SYJO
                <br />
                LENNARD
                <br />
                (Loop Mayhem Team)
              </>,
            ],
            [
              "SHOWCASE\n(loopstation)",
              m.rule_swiss_private_review({ Swissbeatbox: SWISSBEATBOX }),
            ],
            [
              "SHOWCASE\n(solo)",
              m.rule_swiss_private_review({ Swissbeatbox: SWISSBEATBOX }),
            ],
          ]}
          textCenter
        />
        <p className="my-8 text-center">
          <a href="#main-judges-section" className={anchorClass}>
            {m.rule_main_judges_link({ year: String(year) })}
          </a>
        </p>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="second-league-section">
          {m.rule_second_league()}
        </RuleSectionHeading>
        <RuleSubSection>
          <RuleSubHeading>
            {m.rule_official_name()}：Off The Lips Beatbox Battle
          </RuleSubHeading>
          <p className={paragraphClass}>
            {m.rule_second_league_p1({ year: String(year), Solo: "Solo" })}
            <br />
            {m.rule_second_league_p2({ nextYear: String(nextYear), Solo: "Solo" })}
          </p>
          <PostIt>
            <p>
              {m.rule_runners_up({ Wildcard: WILDCARD })}
              <br />
              {m.rule_runners_up_example({ Wildcard: WILDCARD })}
            </p>
          </PostIt>
          <p className={paragraphClass}>{m.rule_second_league_policy()}</p>
          <p className={paragraphClass}>
            {m.rule_second_league_replacement({ year: String(year), Solo: "Solo" })}
          </p>
        </RuleSubSection>
      </RuleSection>

      <RuleSection>
        <RuleSectionHeading id="thanks-section">
          {m.rule_thanks_title()}
        </RuleSectionHeading>
        <p className={paragraphClass}>{m.rule_thanks_p1()}</p>
        <p className={paragraphClass}>{m.rule_thanks_p2()}</p>
        <p className={paragraphClass}>
          {m.rule_thanks_chat({ year: String(year) })}
        </p>
        <div className="mb-4">
          <LinkCard
            text={`GBB ${year} ${m.rule_chat_button()}`}
            href="https://notebooklm.google.com/notebook/7b384060-d2cd-4064-a57e-8b2b7d41571e"
            fullWidth
          />
        </div>
        <p className={paragraphClass}>{m.rule_thanks_use()}</p>
      </RuleSection>
    </main>
  );
};
