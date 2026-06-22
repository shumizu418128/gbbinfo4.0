import type { Route } from "./+types/rule.js";
import { RuleContent } from "../../pages/2026/RuleContent.js";
import { HeaderMenu } from "../../components/HeaderMenu.js";
import { HeroImage } from "../../components/HeroImage.js";
import { FooterMenu } from "../../components/FooterMenu.js";
import { useLoaderData } from "react-router";
import { requireLocale } from "../../util/locale.js";
import { setLocale } from "../../../paraglide/runtime.js";
import { findYearResources, findYearWithCountry } from "../../db/year.js";
import { envCheck } from "~/util/dev.js";
import { Dev } from "~/components/Dev.js";
import { createMeta } from "~/util/meta.js";
import * as m from "../../../paraglide/messages.js";
import { cache } from "~/constants/cache.js";
import { findParticipants, type ParticipantWithRelations } from "~/db/participant.js";

const YEAR = 2026;

type RuleSeedData = {
  gbbSeed: ParticipantWithRelations[];
  otherSeed: ParticipantWithRelations[];
  cancelled: ParticipantWithRelations[];
};

const emptySeedData = (): RuleSeedData => ({
  gbbSeed: [],
  otherSeed: [],
  cancelled: [],
});

/** Wildcard 以外の Participant を rule.py と同様に分類する。 */
const classifySeedParticipants = (
  participants: ParticipantWithRelations[],
): RuleSeedData => {
  const seedData = emptySeedData();

  for (const participant of participants) {
    if (participant.ticketClass.includes("Wildcard")) {
      continue;
    }

    if (participant.isCancelled) {
      seedData.cancelled.push(participant);
    } else if (participant.ticketClass.includes("GBB")) {
      seedData.gbbSeed.push(participant);
    } else {
      seedData.otherSeed.push(participant);
    }
  }

  return seedData;
};

export const loader = async ({ params }: Route.LoaderArgs) => {
  const env = envCheck();
  const locale = requireLocale(params.lang);
  const latestYear = new Date().getFullYear();

  const { yearWithCountry, years } = await findYearResources(YEAR);

  let seedData = emptySeedData();
  try {
    const participants = await findParticipants(YEAR, null, null);
    seedData = classifySeedParticipants(participants);
  } catch {
    seedData = emptySeedData();
  }

  const returnData = { env, locale, yearWithCountry, years, seedData };

  if (YEAR !== latestYear) {
    const latestYearWithCountry = await findYearWithCountry(latestYear);
    return { ...returnData, latestYearWithCountry };
  }

  return { ...returnData, latestYearWithCountry: yearWithCountry };
};

export const headers: Route.HeadersFunction = () => {
  return cache;
};

export const meta = ({ data }: Route.MetaArgs) => {
  const env = data?.env;
  const title = `GBB ${YEAR} ${m.rules()}`;
  return createMeta(env, title);
};

export const Rule = () => {
  const { env, locale, yearWithCountry, years, seedData, latestYearWithCountry } =
    useLoaderData<typeof loader>();
  setLocale(locale, { reload: false });

  return (
    <>
      <Dev env={env} />
      <HeaderMenu yearWithCountry={yearWithCountry} years={years} />
      <HeroImage yearWithCountry={yearWithCountry} subtitle={m.rules()} />
      <RuleContent locale={locale} year={YEAR} seedData={seedData} />
      <FooterMenu latestYearWithCountry={latestYearWithCountry} />
    </>
  );
};

export default Rule;
