import type { MouseEvent } from "react";

export const GeneralButton = ({
  text,
  image,
  href,
  disabled = false,
}: {
  text: string | React.ReactNode;
  image?: string;
  href: string;
  disabled?: boolean;
}) => {
  const fontSize = "24px";
  const buttonWidth = "calc((100% - 16px) / 2)";
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!disabled) {
      return;
    }

    event.preventDefault();
    window.alert("このコンテンツは未公開です");
  };

  if (image) {
    const imageHeight = 80;
    const textMinHeight = 32;
    const imageTextFontSize = textMinHeight - 8;

    const fontSizePx = `${imageTextFontSize}px`;
    const imageHeightPx = `${imageHeight}px`;
    const textMinHeightPx = `${textMinHeight}px`;

    return (
      <a
        className="inline-flex flex-col items-stretch justify-start font-bold text-white"
        style={{
          position: "relative",
          fontSize,
          textDecoration: "none",
          width: buttonWidth,
          height: "auto",
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
            flexShrink: 0,
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          style={{
            width: "100%",
            minHeight: textMinHeightPx,
            boxSizing: "border-box",
            padding: "0 4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            background: "var(--button-background-color)",
            fontSize: fontSizePx,
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
      className="inline-flex items-center justify-center font-bold text-white"
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
