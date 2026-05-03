import { isLocale } from "../../paraglide/runtime";

export const requireLocale = (lang: string | undefined) => {
  if (!lang || !isLocale(lang)) {
    throw new Response("Not Found", { status: 404 });
  }
  return lang;
};
