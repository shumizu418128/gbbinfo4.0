import type { Route } from "./+types/top.js";
import { TopContent } from "../../pages/2026/TopContent.js";
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

const YEAR = 2025;

export const loader = async ({ params }: Route.LoaderArgs) => {
  const env = envCheck();

  const locale = requireLocale(params.lang);
  const latestYear = new Date().getFullYear();

  const yearWithCountry = await findYearWithCountry(YEAR);

  const returnData = { env, locale, yearWithCountry };

  // 最新年以外を取得する場合は、最新年のデータも取得する
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

  const title = `GBB ${YEAR}`;
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
