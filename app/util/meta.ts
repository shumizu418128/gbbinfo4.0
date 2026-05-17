export const createMeta = ( env: string, title: string ) => {
  let metaTitle = title;
  if (env && env !== "production") {
    metaTitle = `[${env}] ${title}`;
  }
  return [
    { title: metaTitle },
    { name: "description", content: "Swissbeatboxが主催するHuman Beatboxの世界大会「Grand Beatbox Battle」の各種情報を、見やすくまとめたサイトです。" },
  ];
}
