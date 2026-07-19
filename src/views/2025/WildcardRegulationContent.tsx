import type { ReactNode } from "react";
import { LinkCard } from "~/components/LinkCard.js";
import { PostIt } from "~/components/PostIt.js";
import { Table } from "~/components/Table.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import {
  GBB,
  BEATBOX,
  BEATBOXER,
  CREW,
  LOOPSTATION,
  PRODUCER,
  RC505,
  SEVEN_TO_SMOKE,
  SOLO,
  SWISSBEATBOX,
  TAG_TEAM,
  WILDCARD,
  YOUTUBE,
} from "~/constants/i18nTerms.js";
import { anchorClass } from "~/constants/linkStyle.js";
import * as m from "../../../paraglide/messages.js";

type WildcardRegulationContentProps = {
  locale: SupportedLanguage;
  year: number;
};

const SWISSBEATBOX_SOURCE =
  "https://swissbeatbox.com/newsfeed/gbb-2025-wildcard-competition/";

const sectionClass = "mb-4 text-2xl font-bold";
const paragraphClass = "mb-4 leading-relaxed";
const ruleSectionClass = "bg-(--background-color) py-16 text-white";

const RuleSection = ({ children }: { children: ReactNode }) => (
  <section className={ruleSectionClass}>
    <div className="mx-auto w-full max-w-2xl px-4">{children}</div>
  </section>
);

const categoryRulesTableData: (string | ReactNode)[][] = [
  [m.rule_col_category(), m.rule_col_deadline_rule()],
  [
    m.rule_all_categories(),
    <>
      {m.rule_submission_start()} 2/15
      <br />
      {m.rule_penalty_overtime()}
      <br />
      {m.rule_penalty_undertime_3s()}
    </>,
  ],
  [
    SOLO,
    <>
      {m.rule_time_limit()} 2:10
      <br />
      {m.rule_submission_deadline()} 3/22 (23:59 CET)
      <br />
      {m.rule_result_announcement()} 4/16 (18:00 JST)
    </>,
  ],
  [
    TAG_TEAM,
    <>
      {m.rule_time_limit()} 2:10
      <br />
      {m.rule_submission_deadline()} 4/5 (23:59 CET)
      <br />
      {m.rule_result_announcement()} 4/24 {m.rule_time_undecided()}
    </>,
  ],
  [
    LOOPSTATION,
    <>
      {m.rule_time_limit()} 3:30
      <br />
      {m.rule_submission_deadline()} 3/22 (23:59 CET)
      <br />
      {m.rule_result_announcement()} 4/19 (18:00 JST)
      <br />
      {m.rule_rc505_only({ RC505 })}
    </>,
  ],
  [
    PRODUCER,
    <>
      {m.rule_time_limit()} 3:30
      <br />
      {m.rule_submission_deadline()} 3/29 (23:59 CET)
      <br />
      {m.rule_result_announcement()} 4/22 {m.rule_time_undecided()}
      <br />
      {m.rule_no_device_limit()}
    </>,
  ],
  [
    CREW,
    <>
      {m.rule_time_limit()} 3:10
      <br />
      {m.rule_submission_deadline()} 4/5 (23:59 CET)
      <br />
      {m.rule_result_announcement()} 4/26 {m.rule_time_undecided()}
    </>,
  ],
];

const guideLinkCards = (locale: SupportedLanguage, year: number) => (
  <div className="mb-8 flex flex-wrap gap-4">
    <LinkCard
      text={m.back_to_home()}
      href={`/${locale}/${year}/top`}
    />
    <LinkCard
      text={m.top7tosmoke_guide({ SevenToSmoke: SEVEN_TO_SMOKE })}
      href={`/${locale}/${year}/top_7tosmoke`}
    />
  </div>
);

export const WildcardRegulationContent = ({
  locale,
  year,
}: WildcardRegulationContentProps) => {
  return (
    <main className="bg-(--background-color) pt-16">
      <RuleSection>
        <p className="mb-8 text-center text-3xl font-bold">- For Beatboxers -</p>
        <hr className="mb-8 border-(--gbb-color)" />
        <p className={paragraphClass}>
          {m.rule_intro({
            year: String(year),
            Wildcard: WILDCARD,
            Swissbeatbox: SWISSBEATBOX,
          })}
          <br />
          {m.rule_source_site()}：
          <a
            href={SWISSBEATBOX_SOURCE}
            target="_blank"
            rel="noopener noreferrer"
            className={anchorClass}
          >
            {GBB} {year} {WILDCARD} Competition
          </a>
          <br />
          {m.wildcard_reg_intro({ Wildcard: WILDCARD })}
        </p>

        <div className="mb-8 flex flex-wrap gap-4">
          {guideLinkCards(locale, year)}
          <LinkCard
            text={
              <span>
                {m.rule_for_fans({ Beatbox: BEATBOX })}
                <br />
                GBB {year} {m.rules()}
              </span>
            }
            href={`/${locale}/${year}/rule`}
          />
        </div>

        <h2 className={sectionClass}>{m.rule_toc()}</h2>
        <ol className="mb-8 list-decimal space-y-2 pl-8">
          <li>
            <a href="#p01" className={anchorClass}>
              {m.rule_toc_notices()}
            </a>
          </li>
          <li>
            <a href="#p02" className={anchorClass}>
              {m.rule_toc_categories()}
            </a>
          </li>
          <li>
            <a href="#p03" className={anchorClass}>
              {m.wildcard_age_limit()}
            </a>
          </li>
          <li>
            <a href="#p04" className={anchorClass}>
              {m.wildcard_submission_about({ Wildcard: WILDCARD })}
            </a>
          </li>
          <li>
            <a href="#p05" className={anchorClass}>
              {m.wildcard_category_rules()}
            </a>
          </li>
          <li>
            <a href="#p06" className={anchorClass}>
              {m.wildcard_avoid_disqualification()}
            </a>
          </li>
        </ol>
        {guideLinkCards(locale, year)}
      </RuleSection>

      <RuleSection>
        <h2 id="p01" className={sectionClass}>
          {m.rule_toc_notices()}
        </h2>
        <p className={paragraphClass}>
          {m.wildcard_reg_notices_p1({ Wildcard: WILDCARD, Beatboxer: BEATBOXER })}
          <br />
          {m.wildcard_reg_notices_p1_note({ Beatboxer: BEATBOXER })}
        </p>
        <p className={paragraphClass}>
          {m.rule_notices_p2()}
          <br />
          {m.rule_notices_p2_prefix({ Wildcard: WILDCARD })}
          <strong className="text-red-500">{m.rule_notices_p2_strong()}</strong>
        </p>
        <p className={`${paragraphClass} text-(--secondary-text-color)`}>
          {m.rule_ai_translation_notice()}
        </p>
        {guideLinkCards(locale, year)}
      </RuleSection>

      <RuleSection>
        <h2 id="p02" className={sectionClass}>
          {m.rule_toc_categories()}
        </h2>
        <Table
          data={[
            [m.rule_col_category(), WILDCARD],
            [SOLO, "6"],
            [LOOPSTATION, "5"],
            [CREW, "2"],
            [PRODUCER, "2"],
            [TAG_TEAM, "5"],
          ]}
          textCenter
        />
        <p className={paragraphClass}>{m.rule_category_note()}</p>
        {guideLinkCards(locale, year)}
      </RuleSection>

      <RuleSection>
        <h2 id="p03" className={sectionClass}>
          {m.wildcard_age_limit()}
        </h2>
        <ul className="mb-8 list-disc space-y-2 pl-8">
          <li>{m.wildcard_reg_age_min()}</li>
          <li>
            {m.wildcard_reg_minor_title()}
            <ul className="mt-2 list-disc space-y-2 pl-8">
              <li>{m.wildcard_reg_minor_guardian()}</li>
              <li>{m.wildcard_reg_minor_cost()}</li>
              <li>{m.wildcard_reg_minor_disqualify({ Wildcard: WILDCARD })}</li>
            </ul>
          </li>
        </ul>
        {guideLinkCards(locale, year)}
      </RuleSection>

      <RuleSection>
        <h2 id="p04" className={sectionClass}>
          {m.wildcard_reg_submission_title({ Wildcard: WILDCARD })}
        </h2>

        <h3 className="mb-4 font-bold">
          {m.wildcard_reg_video_content_title({ Wildcard: WILDCARD })}
        </h3>
        <p className={paragraphClass}>{m.wildcard_reg_video_intro()}</p>
        <p className={`${paragraphClass} italic`}>
          {`"My name is 【${m.rule_col_name()}】, and this is my 【${m.rule_col_category()}】 wildcard for the GBB ${year} World League."`}
        </p>
        <PostIt>
          <p>
            {m.wildcard_reg_video_script_note()}
            <br />
            {m.wildcard_reg_video_script_note_2()}
          </p>
        </PostIt>

        <h3 className="mb-4 mt-8 font-bold">{m.wildcard_reg_recording_title()}</h3>
        <ul className="mb-8 list-disc space-y-2 pl-8">
          <li>{m.wildcard_reg_recording_1()}</li>
          <li>{m.wildcard_reg_recording_2()}</li>
          <li>{m.wildcard_reg_recording_3()}</li>
          <li>{m.wildcard_reg_recording_4()}</li>
          <li>{m.wildcard_reg_recording_5()}</li>
          <li>{m.wildcard_reg_recording_6()}</li>
          <li>{m.wildcard_reg_recording_7()}</li>
          <li className="font-bold text-red-500">
            {m.wildcard_reg_recording_fraud({ Wildcard: WILDCARD })}
          </li>
        </ul>

        <h3 className="mb-4 font-bold">{m.wildcard_reg_submit_title()}</h3>
        <ol className="mb-4 list-decimal space-y-2 pl-8">
          <li>{m.wildcard_reg_submit_step_1({ Wildcard: WILDCARD, YouTube: YOUTUBE })}</li>
          <li>{m.wildcard_submit_via_form({ Swissbeatbox: SWISSBEATBOX })}</li>
        </ol>
        <ul className="mb-4 list-disc space-y-2 pl-8">
          <li className="font-bold text-red-500">{m.wildcard_reg_submit_both_required()}</li>
        </ul>
        <ul className="mb-4 list-disc space-y-2 pl-8">
          <li className="font-bold text-red-500">{m.wildcard_reg_submit_form_warning()}</li>
        </ul>
        <p className={paragraphClass}>{m.wildcard_reg_submit_sns({ Beatboxer: BEATBOXER })}</p>
        <ul className="mb-8 list-disc space-y-2 pl-8">
          <li>{m.wildcard_reg_submit_raw_audio()}</li>
          <li>{m.wildcard_reg_submit_screen_capture({ Solo: SOLO })}</li>
          <li className="font-bold text-red-500">{m.wildcard_reg_submit_raw_required()}</li>
          <li>{m.wildcard_submit_once({ Wildcard: WILDCARD })}</li>
          <li className="font-bold text-red-500">
            {m.wildcard_reg_submit_delete({ Wildcard: WILDCARD })}
            <ul className="mt-2 list-disc pl-8 font-normal text-white">
              <li>{m.wildcard_reg_submit_delete_note()}</li>
            </ul>
          </li>
        </ul>
        {guideLinkCards(locale, year)}
      </RuleSection>

      <RuleSection>
        <h2 id="p05" className={sectionClass}>
          {m.wildcard_category_rules()}
        </h2>
        <Table data={categoryRulesTableData} textCenter />
        <PostIt>
          <p>
            {m.rule_dst_note({ year: String(year) })}
            <br />
            {m.rule_dst_tag_team_crew_note({ TagTeam: TAG_TEAM, Crew: CREW })}
          </p>
        </PostIt>

        <h3 className="mb-4 mt-8 font-bold">
          {m.wildcard_reg_loop_device_title({ Loopstation: LOOPSTATION })}
        </h3>
        <ul className="mb-8 list-disc space-y-2 pl-8">
          <li>{m.wildcard_reg_loop_device_1()}</li>
          <li>{m.wildcard_reg_loop_device_2()}</li>
        </ul>

        <h3 className="mb-4 font-bold">
          {m.wildcard_reg_producer_device_title({ Producer: PRODUCER })}
        </h3>
        <ul className="mb-8 list-disc space-y-2 pl-8">
          <li>{m.wildcard_reg_producer_device_1({ Loopstation: LOOPSTATION })}</li>
          <li className="font-bold text-red-500">{m.wildcard_reg_producer_device_2()}</li>
          <li>{m.wildcard_reg_producer_device_3()}</li>
          <li>{m.wildcard_reg_producer_device_4()}</li>
          <li>{m.wildcard_reg_producer_device_5()}</li>
        </ul>
        {guideLinkCards(locale, year)}
      </RuleSection>

      <RuleSection>
        <h2 id="p06" className={sectionClass}>
          {m.wildcard_avoid_disqualification()}
        </h2>
        <ol className="mb-8 list-decimal space-y-4 pl-8">
          <li>
            <strong>
              {m.wildcard_submit_via_form({ Swissbeatbox: SWISSBEATBOX })}
            </strong>
          </li>
          <li>
            <strong>{m.wildcard_reg_disqualify_2({ Wildcard: WILDCARD })}</strong>
          </li>
          <li>
            <strong>{m.wildcard_submit_once({ Wildcard: WILDCARD })}</strong>
          </li>
        </ol>
        <p className="mb-8 text-center">
          {m.wildcard_reg_closing({ Wildcard: WILDCARD })}
          <br />
          Good luck have fun!
        </p>
        <ul className="mb-8 list-disc space-y-2 pl-8">
          <li>
            <a
              href="https://twitter.com/TWlCER/status/1881662085576442197"
              target="_blank"
              rel="noopener noreferrer"
              className={anchorClass}
            >
              {m.wildcard_reg_credit_thumbnail({ Wildcard: WILDCARD })}
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/impedanceryuma/status/1894719533031784655"
              target="_blank"
              rel="noopener noreferrer"
              className={anchorClass}
            >
              {m.wildcard_reg_credit_mastering({ Wildcard: WILDCARD })}
            </a>
          </li>
        </ul>
      </RuleSection>
    </main>
  );
};
