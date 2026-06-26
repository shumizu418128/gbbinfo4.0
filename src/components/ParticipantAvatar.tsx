import { staticAssetUrl } from "~/util/staticAsset.js";

type ParticipantAvatarProps = {
  name: string;
  size?: number;
};

/** パスセグメントとして安全な文字（英小文字・数字・アンダースコア・ハイフン）。 */
const PATH_SAFE_SEGMENT_PATTERN = /[^a-z0-9_-]/g;

/**
 * パスセグメントに使えない文字をアンダースコアに置き換える。
 *
 * Args:
 *   segment: ファイル名などのパスセグメント。
 *
 * Returns:
 *   置換済みの文字列。
 */
const escapePathSegment = (segment: string): string =>
  segment.replace(PATH_SAFE_SEGMENT_PATTERN, "_");

/**
 * 出場者名からアバター画像の URL を生成する。
 *
 * Args:
 *   name: 出場者名。
 *
 * Returns:
 *   R2 または public/images 配下の webp 画像 URL。
 */
const toParticipantImageSrc = (name: string): string =>
  staticAssetUrl(`/images/${escapePathSegment(name.toLowerCase())}.webp`);

/**
 * 出場者アバター。
 *
 * SSG 配信のため JS なしで成立する。読み込み失敗時は Layout のグローバル
 * エラーハンドラ（`img.js-avatar`）が画像を非表示にし、黒背景のみを残す。
 */
export const ParticipantAvatar = ({
  name,
  size = 120,
}: ParticipantAvatarProps) => {
  const src = toParticipantImageSrc(name);

  return (
    <div
      className="shrink-0"
      style={{ width: size, height: size, backgroundColor: "#000000" }}
    >
      <img
        src={src}
        alt=""
        decoding="async"
        loading="lazy"
        className="js-avatar size-full object-contain"
      />
    </div>
  );
};
