import type { Route } from "./+types/timetable.js";
import { TimetableContent } from "../../pages/2026/TimetableContent.js";
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

const YEAR = 2026;

export const loader = async ({ params }: Route.LoaderArgs) => {
  const env = envCheck();
  const locale = requireLocale(params.lang);
  const latestYear = new Date().getFullYear();

  const { yearWithCountry, years } = await findYearResources(YEAR);

  const returnData = { env, locale, yearWithCountry, years };

  if (YEAR !== latestYear) {
    const latestYearWithCountry = await findYearWithCountry(latestYear);
    return { ...returnData, latestYearWithCountry };
  }

  return { ...returnData, latestYearWithCountry: yearWithCountry };
};

export const headers: Route.HeadersFunction = () => cache;

export const meta = ({ data }: Route.MetaArgs) => {
  const env = data?.env;
  const title = `GBB ${YEAR} ${m.time_table()}`;
  return createMeta(env, title);
};

export const Timetable = () => {
  const { env, locale, yearWithCountry, years, latestYearWithCountry } =
    useLoaderData<typeof loader>();
  setLocale(locale, { reload: false });

  return (
    <>
      <Dev env={env} />
      <HeaderMenu yearWithCountry={yearWithCountry} years={years} />
      <HeroImage yearWithCountry={yearWithCountry} subtitle={m.time_table()} />
      <TimetableContent locale={locale} year={YEAR} />
      <FooterMenu latestYearWithCountry={latestYearWithCountry} />
    </>
  );
};

export default Timetable;
