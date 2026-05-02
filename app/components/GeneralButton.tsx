import type { MouseEvent } from "react";

export const GeneralButton = ({
  text,
  image,
  href,
  disabled = false,
}: {
  text: string;
  image?: string;
  href: string;
  disabled?: boolean;
}) => {
  const fontSize = "24px";
  const buttonWidth = "calc((100% - 24px) / 2)";
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!disabled) {
      return;
    }

    event.preventDefault();
    window.alert("このコンテンツは未公開です");
  };

  if (image) {
    const imageHeight = 80;
    const textHeight = 32;
    const imageTextFontSize = textHeight - 8;

    const fontSizePx = `${imageTextFontSize}px`;
    const imageHeightPx = `${imageHeight}px`;
    const textHeightPx = `${textHeight}px`;
    const buttonHeight = `${imageHeight + textHeight}px`;

    return (
      <a
        className="inline-flex flex-col items-center justify-center text-white"
        style={{
          position: "relative",
          fontSize,
          textDecoration: "none",
          width: buttonWidth,
          height: buttonHeight,
          background: "none",
          padding: 0,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        href={href}
        onClick={handleClick}
        aria-disabled={disabled}
        tabIndex={0}
        role="button"
      >
        <div
          style={{
            width: "100%",
            height: imageHeightPx,
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          style={{
            width: "100%",
            height: textHeightPx,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--button-background-color)",
            fontSize: fontSizePx,
            textDecoration: "underline",
          }}
        >
          {text}
        </div>
        {disabled ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0, 0, 0, 0.5)",
              pointerEvents: "none",
            }}
          />
        ) : null}
      </a>
    );
  }

  return (
    <a
      className="text-white inline-flex items-center justify-center"
      style={{
        position: "relative",
        fontSize,
        width: buttonWidth,
        height: "48px",
        background: "var(--button-background-color)",
        textDecorationColor: "var(--gbb-color)",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      href={href}
      onClick={handleClick}
      aria-disabled={disabled}
      tabIndex={0}
      role="button"
    >
      {text}
      {disabled ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            pointerEvents: "none",
          }}
        />
      ) : null}
    </a>
  );
};
