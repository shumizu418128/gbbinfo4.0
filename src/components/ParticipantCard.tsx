import type { ReactNode } from "react";
import { ParticipantAvatar } from "~/components/ParticipantAvatar.js";
import * as m from "../../paraglide/messages";

type ParticipantCardProps = {
  name: string;
  primaryInfo?: ReactNode;
  secondaryInfo?: ReactNode;
  isCancelled?: boolean;
  href?: string;
};

export const ParticipantCard = ({
  name,
  primaryInfo,
  secondaryInfo,
  isCancelled = false,
  href,
}: ParticipantCardProps) => {
  const nameContent = href ? (
    <a href={href} className="text-(--gbb-color) hover:underline">
      {name}
    </a>
  ) : (
    name
  );

  return (
  <div
    className="px-1 py-2 bg-opacity-10 max-w-lg mx-auto"
    style={{ backgroundColor: "var(--section-color)" }}
  >
    <div className="flex gap-2">
      <ParticipantAvatar name={name} />
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-xl">
          {isCancelled && (
            <>
              <span className="text-white">{m.cancelled()}</span>
              <br />
            </>
          )}
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
