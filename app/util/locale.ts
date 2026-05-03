import { isLocale, setLocale } from "../../paraglide/runtime";

export const requireAndSetLocale = (lang: string | undefined) => {
  if (!lang || !isLocale(lang)) {
    throw new Response("Not Found", { status: 404 });
  }

  setLocale(lang, { reload: false });
  return lang;
};
