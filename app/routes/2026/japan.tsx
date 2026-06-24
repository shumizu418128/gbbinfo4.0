import type { Route } from "./+types/japan.js";
import { JapanContent } from "../../pages/2026/JapanContent.js";
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
import { findParticipants } from "~/db/participant.js";
import { getYearFromDir } from "../../util/year.js";

const YEAR = getYearFromDir(import.meta.url);

export const loader = async ({ params }: Route.LoaderArgs) => {
  const env = envCheck();
  const locale = requireLocale(params.lang);
  const latestYear = new Date().getFullYear();

  const { yearWithCountry, years } = await findYearResources(YEAR);
  const allParticipants = await findParticipants(YEAR, null, null);
  const participants = allParticipants.filter((p) => p.country.isoAlpha2 === "JP");

  const returnData = { env, locale, yearWithCountry, years, participants };

  if (YEAR !== latestYear) {
    const latestYearWithCountry = await findYearWithCountry(latestYear);
    return { ...returnData, latestYearWithCountry };
  }

  return { ...returnData, latestYearWithCountry: yearWithCountry };
};

export const headers: Route.HeadersFunction = () => cache;

export const meta = ({ data }: Route.MetaArgs) => {
  const env = data?.env;
  const title = `GBB ${YEAR} ${m.team_japan()}`;
  return createMeta(env, title);
};

export const Japan = () => {
  const { env, locale, yearWithCountry, years, participants, latestYearWithCountry } =
    useLoaderData<typeof loader>();
  setLocale(locale, { reload: false });

  return (
    <>
      <Dev env={env} />
      <HeaderMenu yearWithCountry={yearWithCountry} years={years} />
      <HeroImage yearWithCountry={yearWithCountry} subtitle={m.team_japan()} />
      <JapanContent participants={participants} locale={locale} />
      <FooterMenu latestYearWithCountry={latestYearWithCountry} />
    </>
  );
};

export default Japan;
