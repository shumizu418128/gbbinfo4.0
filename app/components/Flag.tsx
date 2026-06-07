import React from "react";

type FlagProps = {
  isoAlpha2: string | null; // ISO 3166-1 alpha-2 国コード（小文字2文字で渡す）
  height?: number; // デフォルトは20
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
};

const buildFlagSrcSet = (
  isoAlpha2: string,
  height: number,
  ext: "webp" | "png",
) =>
  `https://flagcdn.com/h${height}/${isoAlpha2}.${ext},` +
  ` https://flagcdn.com/h${height * 2}/${isoAlpha2}.${ext} 2x,` +
  ` https://flagcdn.com/h${height * 3}/${isoAlpha2}.${ext} 3x`;

export const Flag: React.FC<FlagProps> = ({
  isoAlpha2,
  height = 20,
  alt = "",
  className = "",
  loading = "lazy",
}) => {
  if (!isoAlpha2) {
    return null;
  }
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={buildFlagSrcSet(isoAlpha2, height, "webp")}
      />
      <source
        type="image/png"
        srcSet={buildFlagSrcSet(isoAlpha2, height, "png")}
      />
      <img
        src={`https://flagcdn.com/h${height}/${isoAlpha2}.png`}
        height={height}
        alt={alt}
        className={className}
        loading={loading}
        style={{ display: "inline-block", verticalAlign: "middle", paddingBottom: "2px" }}
      />
    </picture>
  );
};
