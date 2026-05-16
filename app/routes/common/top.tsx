import type { Route } from "../common/+types/top.js";
import { TopContent } from "../../2026/TopContent.js";
import { HeaderMenu } from "../../components/HeaderMenu.js";
import { HeroImage } from "../../components/HeroImage.js";
import { FooterMenu } from "../../components/FooterMenu.js";
import { useLoaderData } from "react-router";
import { requireLocale } from "../../util/locale.js";
import { setLocale } from "../../../paraglide/runtime.js";
import { getYearInfo } from "../../db/neon.js";

export const loader = async ({ params, context }: Route.LoaderArgs) => {
  const locale = requireLocale(params.lang);
  const year = Number(params.year);
  const yearInfo = await getYearInfo(year, context);
  return { locale, yearInfo };
};

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "GBB 2026 - GBBinfo" },
    { name: "description", content: "Swissbeatboxが主催するHuman Beatboxの世界大会「Grand Beatbox Battle」の各種情報を、見やすくまとめたサイトです。" },
  ];
}

export const Top = () => {
  const { locale, yearInfo } = useLoaderData<typeof loader>();
  setLocale(locale, { reload: false });

  return (
    <>
      <HeaderMenu />
      <HeroImage yearInfo={yearInfo} />
      <TopContent locale={locale} yearInfo={yearInfo} />
      <FooterMenu />
    </>
  );
}

export default Top;
