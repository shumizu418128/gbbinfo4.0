import type { AvatarFetchMethod, AvatarPlatform, AvatarSnsPlatform } from "./types.js";
import { SNS_AVATAR_PLATFORM_CONFIG } from "./platforms.js";

/** R2・HTTP レスポンス共通の Cache-Control（画像更新なし前提）。 */
export const AVATAR_CACHE_CONTROL = "public, max-age=31536000, immutable";

/** Cloudflare avatar proxy が受け付ける取得方式。 */
export const AVATAR_FETCH_METHODS: readonly AvatarFetchMethod[] = [
  "ogImage",
  "unavatar",
];

/** unavatar.io のベース URL。 */
export const UNAVATAR_BASE_URL = "https://unavatar.io";

/** SNS 以外のアバター取得プラットフォーム設定。 */
export const NON_SNS_AVATAR_PLATFORM_CONFIG = {
  "youtube-video": {
    isUrlConsistent: (url: string): boolean => {
      try {
        const hostname = new URL(url).hostname.toLowerCase();
        return hostname.includes("youtube") || hostname.includes("youtu.be");
      } catch {
        return false;
      }
    },
  },
} as const satisfies Record<
  Exclude<AvatarPlatform, AvatarSnsPlatform>,
  { isUrlConsistent: (url: string) => boolean }
>;

/** Cloudflare avatar proxy が受け付ける SNS プラットフォーム。 */
export const AVATAR_SNS_PLATFORMS = Object.keys(
  SNS_AVATAR_PLATFORM_CONFIG,
) as AvatarSnsPlatform[];

/** Cloudflare avatar proxy が受け付ける全プラットフォーム。 */
export const AVATAR_PLATFORMS: readonly AvatarPlatform[] = [
  ...AVATAR_SNS_PLATFORMS,
  ...Object.keys(NON_SNS_AVATAR_PLATFORM_CONFIG),
] as AvatarPlatform[];

export const ALLOWED_AVATAR_PLATFORMS: ReadonlySet<AvatarPlatform> = new Set(
  AVATAR_PLATFORMS,
);

export const ALLOWED_AVATAR_METHODS: ReadonlySet<AvatarFetchMethod> = new Set(
  AVATAR_FETCH_METHODS,
);
