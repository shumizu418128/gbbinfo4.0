import { useEffect, useRef, useState } from "react";

type ParticipantAvatarProps = {
  src: string;
  size?: number;
};

/** 404 時は同サイズの空白を保ち、壊れた画像アイコンを出さない。 */
export const ParticipantAvatar = ({ src, size = 120 }: ParticipantAvatarProps) => {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    const img = ref.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div className="shrink-0" style={{ width: size, height: size }}>
      <img
        ref={ref}
        src={src}
        alt=""
        decoding="async"
        className="size-full object-contain"
        style={{ opacity: loaded ? 1 : 0, color: "black" }}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
      />
    </div>
  );
};
