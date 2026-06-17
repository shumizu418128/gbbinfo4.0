/** アプリサーバーへ到達した /images/* リクエストを 404 で返す（ルーターエラー回避）。 */
export const loader = () => {
  throw new Response(null, { status: 404 });
};
