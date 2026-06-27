import { LinkCard } from "~/components/LinkCard";
import type { SupportedLanguage } from "~/constants/languageLabels.js";

type NotFoundContentProps = {
  locale: SupportedLanguage;
  year: number;
};

export const NotFoundContent = ({ locale, year }: NotFoundContentProps) => {
  return (
    <main
      className="pt-16 pb-8 text-white"
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 text-center">
        <p className="mb-16 text-8xl font-bold text-(--secondary-text-color)">
          404
        </p>
        <LinkCard text="Home" href={`/${locale}/${year}/top`} />
      </div>
    </main>
  );
};

export default NotFoundContent;
