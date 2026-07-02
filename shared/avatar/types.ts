/** SNS アカウント向けアバター取得プラットフォーム。 */
export type AvatarSnsPlatform =
  | "spotify"
  | "youtube"
  | "soundcloud"
  | "x"
  | "facebook";

/** アバター proxy が受け付けるプラットフォーム。 */
export type AvatarPlatform = AvatarSnsPlatform | "youtube-video";

/** Cloudflare 側での画像取得方式。 */
export type AvatarFetchMethod = "ogImage" | "unavatar";

/** ビルド時に選定するアバター取得元。 */
export type AvatarSource =
  | {
      kind: "sns";
      platform: AvatarSnsPlatform;
      accountUrl: string;
      method: AvatarFetchMethod;
    }
  | {
      kind: "youtubeThumbnail";
      videoId: string;
      sourceUrl: string;
    };
