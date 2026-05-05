import type { Route } from "./+types/top.tsx";
import { TopContent } from "../../2026/TopContent.js";
import { HeaderMenu } from "../../components/HeaderMenu.js";
import { HeroImage } from "../../components/HeroImage.js";
import { FooterMenu } from "../../components/FooterMenu.js";
import { useLoaderData } from "react-router";
import { requireLocale } from "../../util/locale";
import { setLocale } from "../../../paraglide/runtime";
import { getNeonClient } from "~/util/neon";

export async function loader({ params, context }: Route.LoaderArgs) {
  // const neonConnectionCheck = await getNeonClient(context);
  const locale = requireLocale(params.lang);
  return { locale };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GBB 2026 - GBB.info" },
    { name: "description", content: "Swissbeatboxが主催するHuman Beatboxの世界大会「Grand Beatbox Battle」の各種情報を、見やすくまとめたサイトです。" },
  ];
}

export const Top = () => {
  const { locale } = useLoaderData<typeof loader>();
  setLocale(locale, { reload: false });

  return (
    <>
      <HeaderMenu />
      <HeroImage year={2026} />
      <TopContent locale={locale} />
      <FooterMenu />
    </>
  );
}

export default Top;
