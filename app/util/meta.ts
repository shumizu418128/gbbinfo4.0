export const createMeta = ( env: string, title: string ) => {
  let metaTitle = title + " - GBBinfo";
  if (env && env !== "production") {
    metaTitle = `[${env}] ${title} - GBBinfo`;
  }
  return [
    { title: metaTitle },
    { name: "description", content: "Swissbeatboxが主催するHuman Beatboxの世界大会「Grand Beatbox Battle」の各種情報を、見やすくまとめたサイトです。" },
  ];
}
