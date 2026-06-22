import { useLocation, useParams } from "react-router";
import { Dropdown } from "./Dropdown";
import { languageLabels, type SupportedLanguage } from "../constants/languageLabels";
import type { YearWithCountry } from "../db/year";
import * as m from "../../paraglide/messages";

const supportedLanguages = Object.keys(languageLabels) as SupportedLanguage[];

type HeaderMenuProps = {
  yearWithCountry: YearWithCountry;
  years: number[];
};

export const HeaderMenu = ({ yearWithCountry, years }: HeaderMenuProps) => {
  const location = useLocation();
  const { lang } = useParams();
  const currentLanguage = lang as SupportedLanguage;
  const currentPath = location.pathname;
  const { year } = yearWithCountry;

  const buildLanguagePath = (targetLanguage: SupportedLanguage) => {
    const segments = location.pathname.split("/").filter(Boolean);
    const path = currentPath.split("/").slice(0).join("/");

    if (segments.length === 0) {
      return `/${targetLanguage}${path}`;
    }

    segments[0] = targetLanguage;

    return `/${segments.join("/")}${location.search}${location.hash}`;
  };

  const languageItems = supportedLanguages.map((language) => ({
    key: language,
    href: buildLanguagePath(language),
    label: languageLabels[language],
    isActive: language === currentLanguage,
  }));

  const yearItems = years.map((y) => ({
    key: String(y),
    href: `/${lang}/${y}/top`,
    label: String(y),
    isActive: y === year,
  }));

  return (
    <>
      <div className="bg-black flex items-center justify-center p-4 space-x-4 h-16">
        <a href={`/${lang}/${year}/top`} className="text-white font-bold text-2xl">Home</a>
        <Dropdown
          trigger={<span className="text-white font-bold text-2xl">{m.select_year()}</span>}
          items={yearItems}
        />
        <Dropdown
          trigger={(
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z"/></svg>
          )}
          items={languageItems}
        />
      </div>
    </>
  );
};
