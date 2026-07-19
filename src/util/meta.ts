import * as m from "../../paraglide/messages.js";

export const createMeta = (env: string, title: string) => {
  let metaTitle = title + " - GBBinfo";
  if (env && env !== "production") {
    metaTitle = `[${env}] ${title} - GBBinfo`;
  }
  return [
    { title: metaTitle },
    { name: "description", content: m.site_description() },
  ];
};
