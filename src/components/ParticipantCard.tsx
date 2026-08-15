import type { ReactNode } from "react";
import { ParticipantAvatar } from "~/components/ParticipantAvatar.js";
import { anchorClass } from "~/constants/linkStyle.js";
import * as m from "../../paraglide/messages";

type ParticipantCardProps = {
  name: string;
  primaryInfo?: ReactNode;
  secondaryInfo?: ReactNode;
  isCancelled?: boolean;
  href?: string;
  imageUrl?: string;
  /** 指定時は名前の前に「{rank}. 」を付ける。 */
  rank?: number;
};

export const ParticipantCard = ({
  name,
  primaryInfo,
  secondaryInfo,
  isCancelled = false,
  href,
  imageUrl,
  rank,
}: ParticipantCardProps) => {
  const nameContent = href ? (
    <a href={href} className={anchorClass}>
      {name}
    </a>
  ) : (
    name
  );

  return (
    <div
      className="relative px-1 py-2 bg-opacity-10 max-w-lg mx-auto"
      style={{ backgroundColor: "var(--section-color)" }}
    >
      {isCancelled && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: "var(--table-border-color)" }}
          aria-hidden="true"
        />
      )}
      <div className="flex gap-2">
        <ParticipantAvatar name={name} imageUrl={imageUrl} />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-xl text-white">
            {isCancelled && (
              <>
                <span>{m.cancelled()}</span>
                <br />
              </>
            )}
            {rank != null ? <span>{rank}. </span> : null}
            {nameContent}
          </div>
          {primaryInfo && <div className="pt-2">{primaryInfo}</div>}
          {secondaryInfo && (
            <div className="text-sm pt-2 text-(--secondary-text-color)">
              {secondaryInfo}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
