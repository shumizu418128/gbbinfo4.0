import { useCallback, useState } from "react";

type ParticipantAvatarProps = {
  src: string;
  size?: number;
};

const ParticipantAvatarInner = ({ src, size }: Required<ParticipantAvatarProps>) => {
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
export const ParticipantAvatar = ({ src, size = 120 }: ParticipantAvatarProps) => (
  <ParticipantAvatarInner key={src} src={src} size={size} />
);
