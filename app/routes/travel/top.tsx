import type { Route } from "./+types/top.js";
import { TopContent } from "../../pages/travel/TopContent.js";
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
import { cache } from "~/constants/cache.js";

const YEAR = new Date().getFullYear();

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
  return createMeta(env, "ワルシャワへ行こう");
};

export const TravelTop = () => {
  const { env, locale, yearWithCountry, years, latestYearWithCountry } =
    useLoaderData<typeof loader>();
  setLocale(locale, { reload: false });

  return (
    <>
      <Dev env={env} />
      <HeaderMenu yearWithCountry={yearWithCountry} years={years} />
      <HeroImage yearWithCountry={yearWithCountry} subtitle="ワルシャワへ行こう" />
      <TopContent locale={locale} />
      <FooterMenu latestYearWithCountry={latestYearWithCountry} />
    </>
  );
};

export default TravelTop;
