import type { CSSProperties, ReactNode } from "react";
import { staticAssetUrl } from "~/util/staticAsset.js";

const COMING_SOON_MESSAGE = "Coming soon...";

export const LinkCard = ({
  text,
  image,
  href,
  disabled = false,
  unavailable = false,
  fullWidth = false,
}: {
  text: string | ReactNode;
  image?: string;
  href: string;
  disabled?: boolean;
  unavailable?: boolean;
  fullWidth?: boolean;
}) => {
  const fontSize = "24px";
  const cardWidth = "calc((100% - 16px) / 2)";
  const disabledBackgroundColor = "rgba(0, 0, 0, 0.6)";
  const unavailableBackgroundColor = "rgba(0, 0, 0, 0.8)";
  const isBlocked = disabled || unavailable;
  const isInteractive = !isBlocked;
  const isLight = !image;
  const hoverBackgroundClass = isInteractive
    ? "transition-colors duration-150 hover:bg-(--gbb-color)"
    : "";
  const groupHoverBackgroundClass = isInteractive
    ? "transition-colors duration-150 group-hover:bg-(--gbb-color)"
    : "";

  const blockedWrapperProps = {
    "data-link-card-blocked": true,
    "data-coming-soon-message": COMING_SOON_MESSAGE,
    role: "button" as const,
    "aria-disabled": true,
    tabIndex: 0,
  };

  const interactiveWrapperProps = {
    href,
    tabIndex: 0,
    role: "button" as const,
  };

  if (image) {
    const imageHeight = 80;
    const imageWidth = 400;
    const textMinHeight = 32;
    const imageTextFontSize = textMinHeight - 12;

    const fontSizePx = `${imageTextFontSize}px`;
    const imageHeightPx = `${imageHeight}px`;
    const textMinHeightPx = `${textMinHeight}px`;

    const wrapperStyle: CSSProperties = {
      position: "relative",
      fontSize,
      textDecoration: "none",
      width: cardWidth,
      height: "auto",
      background: "none",
      padding: 0,
      cursor: isBlocked ? "not-allowed" : "pointer",
    };

    const content = (
      <>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: imageHeightPx,
            flexShrink: 0,
          }}
        >
          <img
            src={staticAssetUrl(image)}
            alt=""
            width={imageWidth}
            height={imageHeight}
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
          {isBlocked ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: disabled ? disabledBackgroundColor : unavailableBackgroundColor,
                pointerEvents: "none",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              {COMING_SOON_MESSAGE}
            </div>
          ) : null}
        </div>
        <div
          className={`bg-(--button-background-color) ${groupHoverBackgroundClass}`}
          style={{
            position: "relative",
            width: "100%",
            minHeight: textMinHeightPx,
            boxSizing: "border-box",
            padding: "0 4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontSize: fontSizePx,
          }}
        >
          {text}
          {isBlocked ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: disabledBackgroundColor,
                pointerEvents: "none",
              }}
            />
          ) : null}
        </div>
      </>
    );

    if (isBlocked) {
      return (
        <div
          className="inline-flex flex-col items-stretch justify-start font-bold text-white"
          style={wrapperStyle}
          {...blockedWrapperProps}
        >
          {content}
        </div>
      );
    }

    return (
      <a
        className="inline-flex flex-col items-stretch justify-start font-bold text-white group"
        style={wrapperStyle}
        {...interactiveWrapperProps}
      >
        {content}
      </a>
    );
  }

  const wrapperStyle: CSSProperties = {
    position: "relative",
    fontSize,
    width: fullWidth ? "100%" : cardWidth,
    minHeight: "80px",
    height: "auto",
    padding: "8px 16px",
    boxSizing: "border-box",
    textAlign: "center",
    lineHeight: 1.333,
    textDecorationColor: "var(--gbb-color)",
    cursor: isBlocked ? "not-allowed" : "pointer",
  };

  const content = (
    <>
      {text}
      {isBlocked ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: disabled ? disabledBackgroundColor : unavailableBackgroundColor,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </>
  );

  if (isBlocked) {
    return (
      <div
        className={`inline-flex items-center justify-center font-bold ${isLight ? "bg-white text-black" : "text-white bg-(--button-background-color)"}`}
        style={wrapperStyle}
        {...blockedWrapperProps}
      >
        {content}
      </div>
    );
  }

  return (
    <a
      className={`inline-flex items-center justify-center font-bold ${isLight ? "bg-white text-black hover:text-white" : "text-white bg-(--button-background-color)"} ${hoverBackgroundClass}`}
      style={wrapperStyle}
      {...interactiveWrapperProps}
    >
      {content}
    </a>
  );
};
