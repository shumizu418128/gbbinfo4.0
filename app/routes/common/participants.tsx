import type { Route } from "../common/+types/participants.js";
import { ParticipantsContent } from "../../2026/ParticipantsContent.js";
import { HeaderMenu } from "../../components/HeaderMenu.js";
import { HeroImage } from "../../components/HeroImage.js";
import { FooterMenu } from "../../components/FooterMenu.js";
import { useLoaderData } from "react-router";
import { requireLocale } from "../../util/locale.js";
import { setLocale } from "../../../paraglide/runtime.js";
import { getYearInfo } from "../../db/neon.js";

export const loader = async ({ params, context }: Route.LoaderArgs) => {
  const yearInfo = await getYearInfo(Number(params.year), context);
  const locale = requireLocale(params.lang);
  return { locale, yearInfo };
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GBB 2026 Wildcard結果 & 出場者一覧 - GBBinfo" },
    { name: "description", content: "Swissbeatboxが主催するHuman Beatboxの世界大会「Grand Beatbox Battle」の各種情報を、見やすくまとめたサイトです。" },
  ];
}

export const Participants = () => {
  const { locale, yearInfo } = useLoaderData<typeof loader>();
  setLocale(locale, { reload: false });

  return (
    <>
      <HeaderMenu />
      <HeroImage yearInfo={yearInfo} />
      <ParticipantsContent />
      <FooterMenu />
    </>
  );
}

export default Participants;
