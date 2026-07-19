import * as m from "../../paraglide/messages.js";
import { SITE_NAME } from "~/util/seo.js";

export const createMeta = (env: string, title: string) => {
  let metaTitle = `${title} - ${SITE_NAME}`;
  if (env && env !== "production") {
    metaTitle = `[${env}] ${title} - ${SITE_NAME}`;
  }
  return [
    { title: metaTitle },
    { name: "description", content: m.site_description() },
  ];
};
