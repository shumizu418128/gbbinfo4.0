import type { MouseEvent } from "react";
import * as m from "../../paraglide/messages";
import { staticAssetUrl } from "~/util/staticAsset.js";

export const LinkCard = ({
  text,
  image,
  href,
  disabled = false,
  unavailable = false,
  fullWidth = false,
}: {
  text: string | React.ReactNode;
  image?: string;
  href: string;
  disabled?: boolean;
  unavailable?: boolean;
  fullWidth?: boolean;
}) => {
  const comingSoonMessage = "Coming soon...";
  const unavailableMessage = m.unavailable();
  const fontSize = "24px";
  const cardWidth = "calc((100% - 16px) / 2)";
  const disabledBackgroundColor = "rgba(0, 0, 0, 0.6)";
  const unavailableBackgroundColor = "rgba(0, 0, 0, 0.8)";
  const isInteractive = !disabled && !unavailable;
  const hoverBackgroundClass = isInteractive
    ? "transition-colors duration-150 hover:bg-(--gbb-color)"
    : "";
  const groupHoverBackgroundClass = isInteractive
    ? "transition-colors duration-150 group-hover:bg-(--gbb-color)"
    : "";

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      window.alert(comingSoonMessage);
    }
    if (unavailable) {
      event.preventDefault();
      window.alert(unavailableMessage);
    }
  };

  if (image) {
    const imageHeight = 80;
    const imageWidth = 400;
    const textMinHeight = 32;
    const imageTextFontSize = textMinHeight - 12;

    const fontSizePx = `${imageTextFontSize}px`;
    const imageHeightPx = `${imageHeight}px`;
    const textMinHeightPx = `${textMinHeight}px`;

    return (
      <a
        className={`inline-flex flex-col items-stretch justify-start font-bold text-white ${isInteractive ? "group" : ""}`}
        style={{
          position: "relative",
          fontSize,
          textDecoration: "none",
          width: cardWidth,
          height: "auto",
          background: "none",
          padding: 0,
          cursor: disabled || unavailable ? "not-allowed" : "pointer",
        }}
        href={href}
        onClick={handleClick}
        aria-disabled={disabled || unavailable}
        tabIndex={0}
        role="button"
      >
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
          {(disabled || unavailable) ? (
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
              {disabled || unavailable ? comingSoonMessage : unavailableMessage}
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
          {disabled || unavailable ? (
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
      </a>
    );
  }

  return (
    <a
      className={`inline-flex items-center justify-center font-bold text-white bg-(--button-background-color) ${hoverBackgroundClass}`}
      style={{
        position: "relative",
        fontSize,
        width: fullWidth ? "100%" : cardWidth,
        minHeight: "48px",
        height: "auto",
        padding: "8px 16px",
        boxSizing: "border-box",
        textAlign: "center",
        lineHeight: 1.333,
        textDecorationColor: "var(--gbb-color)",
        cursor: disabled || unavailable ? "not-allowed" : "pointer",
      }}
      href={href}
      onClick={handleClick}
      aria-disabled={disabled || unavailable}
      tabIndex={0}
      role="button"
    >
      {text}
      {disabled || unavailable ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: disabled || unavailable ? disabledBackgroundColor : unavailableBackgroundColor,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </a>
  );
};
