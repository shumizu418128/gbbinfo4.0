import type { Route } from "../common/+types/top.js";
import { TopContent } from "../../2026/TopContent.js";
import { HeaderMenu } from "../../components/HeaderMenu.js";
import { HeroImage } from "../../components/HeroImage.js";
import { FooterMenu } from "../../components/FooterMenu.js";
import { useLoaderData } from "react-router";
import { requireLocale } from "../../util/locale.js";
import { setLocale } from "../../../paraglide/runtime.js";
import { getYearWithCountry } from "../../db/neon.js";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const locale = requireLocale(params.lang);
  const year = Number(params.year);
  const yearWithCountry = await getYearWithCountry(year);
  return { locale, yearWithCountry };
};

export const headers: Route.HeadersFunction = () => {
  return {
    "Cache-Control": "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
  };
};

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "GBB 2026 - GBBinfo" },
    { name: "description", content: "Swissbeatboxが主催するHuman Beatboxの世界大会「Grand Beatbox Battle」の各種情報を、見やすくまとめたサイトです。" },
  ];
}

export const Top = () => {
  const { locale, yearWithCountry } = useLoaderData<typeof loader>();
  setLocale(locale, { reload: false });

  return (
    <>
      <HeaderMenu yearWithCountry={yearWithCountry} />
      <HeroImage yearWithCountry={yearWithCountry} />
      <TopContent locale={locale} yearWithCountry={yearWithCountry} />
      <FooterMenu yearWithCountry={yearWithCountry} />
    </>
  );
}

export default Top;
