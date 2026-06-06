import type { Route } from "../common/+types/top.js";
import { TopContent } from "../../2026/TopContent.js";
import { HeaderMenu } from "../../components/HeaderMenu.js";
import { HeroImage } from "../../components/HeroImage.js";
import { FooterMenu } from "../../components/FooterMenu.js";
import { useLoaderData } from "react-router";
import { requireLocale } from "../../util/locale.js";
import { setLocale } from "../../../paraglide/runtime.js";
import { findYearWithCountry } from "../../db/year.js";
import { envCheck } from "~/util/dev.js";
import { Dev } from "~/components/Dev.js";
import { createMeta } from "~/util/meta.js";
import { cache } from "~/constants/cache.js";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const env = envCheck();

  const locale = requireLocale(params.lang);
  const year = Number(params.year);
  const latestYear = new Date().getFullYear();

  const yearWithCountry = await findYearWithCountry(year);

  const returnData = { env, locale, yearWithCountry };

  // 最新年以外を取得する場合は、最新年のデータも取得する
  if (year !== latestYear) {
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
  const yearWithCountry = data?.yearWithCountry;

  const title = `GBB ${yearWithCountry.year}`;
  return createMeta(env, title);
}

export const Top = () => {
  const { env, locale, yearWithCountry, latestYearWithCountry } = useLoaderData<typeof loader>();
  setLocale(locale, { reload: false });

  return (
    <>
      <Dev env={env} />
      <HeaderMenu yearWithCountry={yearWithCountry} />
      <HeroImage yearWithCountry={yearWithCountry} />
      <TopContent locale={locale} yearWithCountry={yearWithCountry} />
      <FooterMenu latestYearWithCountry={latestYearWithCountry} />
    </>
  );
}

export default Top;
