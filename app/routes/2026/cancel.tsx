import type { Route } from "./+types/cancel.js";
import { CancelContent } from "../../pages/2026/CancelContent.js";
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
  const participants = await findParticipants(YEAR, null, "cancelled");

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
  const title = `GBB ${YEAR} ${m.withdrawn_list()}`;
  return createMeta(env, title);
};

export const Cancel = () => {
  const { env, locale, yearWithCountry, years, participants, latestYearWithCountry } =
    useLoaderData<typeof loader>();
  setLocale(locale, { reload: false });

  return (
    <>
      <Dev env={env} />
      <HeaderMenu yearWithCountry={yearWithCountry} years={years} />
      <HeroImage yearWithCountry={yearWithCountry} subtitle={m.withdrawn_list()} />
      <CancelContent participants={participants} locale={locale} />
      <FooterMenu latestYearWithCountry={latestYearWithCountry} />
    </>
  );
};

export default Cancel;
