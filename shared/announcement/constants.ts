/** R2 上のサイトお知らせ JSON キー。 */
export const ANNOUNCEMENT_R2_KEY = "site/announcement.json";

/** 公開 GET のブラウザ・CDN キャッシュ（秒）。 */
export const ANNOUNCEMENT_CACHE_MAX_AGE_SECONDS = 60;

/** Cache-Control ヘッダー値。 */
export const ANNOUNCEMENT_CACHE_CONTROL = `public, max-age=${ANNOUNCEMENT_CACHE_MAX_AGE_SECONDS}`;

/** お知らせ本文の最大文字数。 */
export const ANNOUNCEMENT_MESSAGE_MAX_LENGTH = 2000;
