/**
 * R2 に保存するサイト臨時お知らせ。
 */
export type SiteAnnouncement = {
  enabled: boolean;
  message: string;
  updatedAt: string;
  expiresAt: string | null;
};

/**
 * お知らせ更新 API の成功レスポンス。
 */
export type SiteAnnouncementWriteSuccess = {
  ok: true;
  announcement: SiteAnnouncement;
};

/**
 * お知らせ更新 API の失敗レスポンス。
 */
export type SiteAnnouncementWriteError = {
  ok: false;
  reason: string;
  detail: string;
};
