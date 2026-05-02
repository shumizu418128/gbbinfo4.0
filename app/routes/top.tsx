import type { Route } from "./+types/top.tsx";
import { TopContent } from "../top/top";
import { HeaderMenu } from "../components/HeaderMenu";
import { HeroImage } from "../components/HeroImage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const Top = () => {
  return (
    <>
      <HeaderMenu />
      <HeroImage title="GBB 2026" subtitle="WE LOVE BEATBOX" />
      <TopContent />
    </>
  );
}

export default Top;
