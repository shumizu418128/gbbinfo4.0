import type { Route } from "../common/+types/participants.js";
import { ParticipantsContent } from "../../2026/ParticipantsContent.js";
import { HeaderMenu } from "../../components/HeaderMenu.js";
import { HeroImage } from "../../components/HeroImage.js";
import { FooterMenu } from "../../components/FooterMenu.js";
import { useLoaderData } from "react-router";
import { requireLocale } from "../../util/locale.js";
import { setLocale } from "../../../paraglide/runtime.js";
import { getYearWithCountry } from "../../db/neon.js";
import { envCheck } from "~/util/dev.js";
import { Dev } from "../../components/Dev.js";
import { createMeta } from "~/util/meta.js";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const env = envCheck();

  const year = Number(params.year);
  const yearWithCountry = await getYearWithCountry(year);
  const locale = requireLocale(params.lang);

  const now = new Date();
  const nowYear = now.getFullYear();
  if (nowYear !== year) {
    const latestYearWithCountry = await getYearWithCountry(nowYear);
    return { locale, yearWithCountry, latestYearWithCountry, env };
  }
  return { locale, yearWithCountry, latestYearWithCountry: yearWithCountry, env };
};

export const headers: Route.HeadersFunction = () => {
  return {
    "Cache-Control": "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
  };
};

export function meta({ data }: Route.MetaArgs) {
  const env = data?.env;
  const yearWithCountry = data?.yearWithCountry;

  const title = `GBB ${yearWithCountry.year} Wildcard結果 & 出場者一覧 - GBBinfo`;
  return createMeta(env, title);
}

export const Participants = () => {
  const { locale, yearWithCountry, latestYearWithCountry, env } = useLoaderData<typeof loader>();
  setLocale(locale, { reload: false });

  return (
    <>
      <Dev env={env} />
      <HeaderMenu yearWithCountry={yearWithCountry} />
      <HeroImage yearWithCountry={yearWithCountry} />
      <ParticipantsContent />
      <FooterMenu latestYearWithCountry={latestYearWithCountry} />
    </>
  );
}

export default Participants;
