import type { Route } from "../common/+types/participants.js";
import { ParticipantsContent } from "../../2026/ParticipantsContent.js";
import { HeaderMenu } from "../../components/HeaderMenu.js";
import { HeroImage } from "../../components/HeroImage.js";
import { FooterMenu } from "../../components/FooterMenu.js";
import { useLoaderData } from "react-router";
import { requireLocale } from "../../util/locale.js";
import { setLocale } from "../../../paraglide/runtime.js";
import { getYearWithCountry } from "../../db/neon.js";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const year = Number(params.year);
  const yearWithCountry = await getYearWithCountry(year);
  const locale = requireLocale(params.lang);

  const now = new Date();
  const nowYear = now.getFullYear();
  if (nowYear !== year) {
    const latestYearWithCountry = await getYearWithCountry(nowYear);
    return { locale, yearWithCountry, latestYearWithCountry };
  }
  return { locale, yearWithCountry, latestYearWithCountry: yearWithCountry };
};

export const headers: Route.HeadersFunction = () => {
  return {
    "Cache-Control": "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
  };
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GBB 2026 Wildcard結果 & 出場者一覧 - GBBinfo" },
    { name: "description", content: "Swissbeatboxが主催するHuman Beatboxの世界大会「Grand Beatbox Battle」の各種情報を、見やすくまとめたサイトです。" },
  ];
}

export const Participants = () => {
  const { locale, yearWithCountry, latestYearWithCountry } = useLoaderData<typeof loader>();
  setLocale(locale, { reload: false });

  return (
    <>
      <HeaderMenu yearWithCountry={yearWithCountry} />
      <HeroImage yearWithCountry={yearWithCountry} />
      <ParticipantsContent />
      <FooterMenu latestYearWithCountry={latestYearWithCountry} />
    </>
  );
}

export default Participants;
