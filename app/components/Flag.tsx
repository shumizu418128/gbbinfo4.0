import React from "react";

type FlagProps = {
  isoAlpha2: string | null; // ISO 3166-1 alpha-2 国コード（小文字2文字で渡す）
  width?: number; // デフォルトは20
  height?: number; // デフォルトは15
  alt?: string;
  className?: string;
};

export const Flag: React.FC<FlagProps> = ({
  isoAlpha2,
  width = 32,
  height = 24,
  alt = "",
  className = "",
}) => {
  if (!isoAlpha2) {
    return null;
  }
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={
          `https://flagcdn.com/${width}x${height}/${isoAlpha2}.webp,` +
          ` https://flagcdn.com/${width * 2}x${height * 2}/${isoAlpha2}.webp 2x,` +
          ` https://flagcdn.com/${width * 3}x${height * 3}/${isoAlpha2}.webp 3x`
        }
      />
      <source
        type="image/png"
        srcSet={
          `https://flagcdn.com/${width}x${height}/${isoAlpha2}.png,` +
          ` https://flagcdn.com/${width * 2}x${height * 2}/${isoAlpha2}.png 2x,` +
          ` https://flagcdn.com/${width * 3}x${height * 3}/${isoAlpha2}.png 3x`
        }
      />
      <img
        src={`https://flagcdn.com/${width}x${height}/${isoAlpha2}.png`}
        width={width}
        height={height}
        alt={alt}
        className={className}
        loading="lazy"
        style={{ display: "inline-block", verticalAlign: "middle" }}
      />
    </picture>
  );
};
