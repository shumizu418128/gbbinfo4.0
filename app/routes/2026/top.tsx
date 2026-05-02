import type { Route } from "./+types/top.tsx";
import { TopContent } from "../../2026/top/top";
import { HeaderMenu } from "../../components/HeaderMenu.js";
import { HeroImage } from "../../components/HeroImage.js";

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
