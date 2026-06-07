import type { Route } from "./+types/participants.js";
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
import * as m from '../../../paraglide/messages.js';
import { cache } from "~/constants/cache.js";
import type { Category } from "~/constants/participantLabels.js";
import { findParticipants } from "~/db/participant.js";
import { findCategoriesByIds } from "~/db/category.js";

const YEAR = 2026;

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const category: Category | null = url.searchParams.get("category") as Category | null;

  const env = envCheck();

  const locale = requireLocale(params.lang);
  const latestYear = new Date().getFullYear();

  const yearWithCountry = await findYearWithCountry(YEAR);
  const validCategories = await findCategoriesByIds(yearWithCountry.categories ?? []);

  // カテゴリが存在しない場合、デフォルト値を付与してリダイレクト
  if (!validCategories.some(c => c.name === category)) {
    return redirect(`${url.pathname}?category=${validCategories[0].name}`);
  }

  const selectedCategory = validCategories.find(c => c.name === category)!.name;
  const validCategoryNames = validCategories.map(c => c.name);

  const participants = await findParticipants(YEAR, selectedCategory, null, null);

  const returnData = { env, locale, yearWithCountry, participants, validCategoryNames, selectedCategory };

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

  const title = `GBB ${YEAR} ${m.wildcard_result_and_participants({ Wildcard: "Wildcard" })}`;
  return createMeta(env, title);
}

export const Participants = () => {
  const { env, locale, yearWithCountry, participants, validCategoryNames, selectedCategory, latestYearWithCountry } = useLoaderData<typeof loader>();
  setLocale(locale, { reload: false });

  return (
    <>
      <Dev env={env} />
      <HeaderMenu yearWithCountry={yearWithCountry} />
      <HeroImage yearWithCountry={yearWithCountry} subtitle={m.wildcard_result_and_participants({ Wildcard: "Wildcard" })} />
      <ParticipantsContent participants={participants} locale={locale} categoryNames={validCategoryNames} selectedCategory={selectedCategory} />
      <FooterMenu latestYearWithCountry={latestYearWithCountry} />
    </>
  );
}

export default Participants;
