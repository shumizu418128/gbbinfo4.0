import { isUnknownParticipantName } from "~/util/participant.js";

type ParticipantAvatarProps = {
  name: string;
  size?: number;
  imageUrl?: string;
};

/**
 * 出場者アバター。
 *
 * SSG 配信のため JS なしで成立する。読み込み失敗時は Layout のグローバル
 * エラーハンドラ（`img.js-avatar`）が画像を非表示にし、黒背景のみを残す。
 */
export const ParticipantAvatar = ({
  name,
  size = 120,
  imageUrl,
}: ParticipantAvatarProps) => {
  if (isUnknownParticipantName(name) || !imageUrl) {
    return (
      <div
        className="shrink-0"
        style={{ width: size, height: size, backgroundColor: "#000000" }}
      />
    );
  }

  return (
    <div
      className="shrink-0"
      style={{ width: size, height: size, backgroundColor: "#000000" }}
    >
      <img
        src={imageUrl}
        alt=""
        decoding="async"
        loading="lazy"
        className="js-avatar size-full object-cover"
      />
    </div>
  );
};
