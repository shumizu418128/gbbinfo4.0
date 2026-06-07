import { useCallback, useState } from "react";

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
 *   public/images 配下の webp 画像 URL。
 */
const toParticipantImageSrc = (name: string): string =>
  `/images/${escapePathSegment(name.toLowerCase())}.webp`;

const ParticipantAvatarInner = ({
  name,
  size,
}: Required<ParticipantAvatarProps>) => {
  const src = toParticipantImageSrc(name);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleImgRef = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  const showImage = !failed;

  return (
    <div
      className="shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: showImage && loaded ? undefined : "#000000",
      }}
    >
      {showImage ? (
        <img
          ref={handleImgRef}
          src={src}
          alt=""
          decoding="async"
          className="size-full object-contain"
          style={{ opacity: loaded ? 1 : 0 }}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setFailed(true);
          }}
        />
      ) : null}
    </div>
  );
};

/** 404 時は同サイズの空白を保ち、壊れた画像アイコンを出さない。 */
export const ParticipantAvatar = ({ name, size = 120 }: ParticipantAvatarProps) => (
  <ParticipantAvatarInner key={name} name={name} size={size} />
);
