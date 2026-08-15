import { buildAnnouncementAdminHtml } from "../../lib/announcement-admin-html.js";

/**
 * スマホ向けお知らせ編集ページ。
 *
 * API キーはレスポンスに含めない。クライアントが `#key=` から localStorage へ保存する。
 */
export const onRequestGet: PagesFunction = async () =>
  new Response(buildAnnouncementAdminHtml(), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
