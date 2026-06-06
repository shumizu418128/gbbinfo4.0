/** public/images に無い画像 URL へのリクエストを 404 で返す（ルーターエラー回避）。 */
export const loader = () => {
  throw new Response(null, { status: 404 });
};
