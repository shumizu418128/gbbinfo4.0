import type { Route } from "../common/+types/participants.js";
import { ParticipantsContent } from "../../2026/ParticipantsContent.js";
import { HeaderMenu } from "../../components/HeaderMenu.js";
import { HeroImage } from "../../components/HeroImage.js";
import { FooterMenu } from "../../components/FooterMenu.js";
import { redirect, useLoaderData } from "react-router";
import { requireLocale } from "../../util/locale.js";
import { setLocale } from "../../../paraglide/runtime.js";
import { findYearWithCountry } from "../../db/year.js";
import { envCheck } from "~/util/dev.js";
import { Dev } from "../../components/Dev.js";
import { createMeta } from "~/util/meta.js";
import * as m from '../../../paraglide/messages';
import { cache } from "~/constants/cache.js";
import type { Category, TicketClass, CancelFilter } from "~/constants/participantLabels.js";
import { findParticipants } from "~/db/participant.js";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const category: Category | null = url.searchParams.get("category") as Category | null;

  // 値がない場合、デフォルト値を付与してリダイレクト
  if (!category) {
    return redirect(`${url.pathname}?category=Loopstation`);
  }

  const env = envCheck();

  const locale = requireLocale(params.lang);
  const year = Number(params.year);
  const latestYear = new Date().getFullYear();

  const yearWithCountry = await findYearWithCountry(year);
  const participants = await findParticipants(year, category, null, null);

  const returnData = { env, locale, yearWithCountry, participants };

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

  const title = `GBB ${yearWithCountry.year} ${m.wildcard_result_and_participants({ Wildcard: "Wildcard" })}`;
  return createMeta(env, title);
}

export const Participants = () => {
  const { env, locale, yearWithCountry, participants, latestYearWithCountry } = useLoaderData<typeof loader>();
  setLocale(locale, { reload: false });

  return (
    <>
      <Dev env={env} />
      <HeaderMenu yearWithCountry={yearWithCountry} />
      <HeroImage yearWithCountry={yearWithCountry} subtitle={m.wildcard_result_and_participants({ Wildcard: "Wildcard" })} />
      <ParticipantsContent participants={participants} locale={locale} />
      <FooterMenu latestYearWithCountry={latestYearWithCountry} />
    </>
  );
}

export default Participants;
