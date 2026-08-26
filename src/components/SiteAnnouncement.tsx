import { useEffect, useState, type ReactNode } from "react";
import { NoticeCallout } from "~/components/NoticeCallout.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { formatJstDateTime } from "~/util/formatJstDateTime.js";
import * as m from "../../paraglide/messages.js";

type SiteAnnouncementData = {
  enabled?: boolean;
  message?: string;
  updatedAt?: string;
  expiresAt?: string | null;
};

type VisibleAnnouncement = {
  message: string;
  updatedAtIso: string | null;
  updatedAtLabel: string | null;
};

type SiteAnnouncementProps = {
  /** R2 公開 JSON の URL。 */
  announcementUrl: string;
  /** 表示言語。 */
  locale: SupportedLanguage;
};

/**
 * お知らせが現時点で表示対象か判定する。
 *
 * Args:
 *   data: お知らせ JSON。
 *
 * Returns:
 *   表示すべきなら true。
 */
const isAnnouncementVisible = (data: SiteAnnouncementData): boolean => {
  if (data.enabled !== true) {
    return false;
  }

  const message = typeof data.message === "string" ? data.message.trim() : "";
  if (!message) {
    return false;
  }

  if (typeof data.expiresAt === "string" && data.expiresAt.length > 0) {
    const expiresMs = Date.parse(data.expiresAt);
    if (Number.isNaN(expiresMs) || expiresMs <= Date.now()) {
      return false;
    }
  }

  return true;
};

/**
 * 黒背景上に NoticeCallout で臨時お知らせを表示する。
 *
 * Args:
 *   announcementUrl: 公開 JSON URL。
 *   locale: 表示言語。
 *
 * Returns:
 *   お知らせセクション、または非表示時は null。
 */
export const SiteAnnouncement = ({
  announcementUrl,
  locale,
}: SiteAnnouncementProps): ReactNode => {
  const [announcement, setAnnouncement] = useState<VisibleAnnouncement | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    fetch(announcementUrl, {
      method: "GET",
      credentials: "omit",
      cache: "no-cache",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("announcement fetch failed");
        }
        return response.json() as Promise<SiteAnnouncementData>;
      })
      .then((data) => {
        if (cancelled) {
          return;
        }
        if (!isAnnouncementVisible(data)) {
          setAnnouncement(null);
          return;
        }

        const updatedAt =
          typeof data.updatedAt === "string" ? data.updatedAt : "";
        const datetime = updatedAt
          ? formatJstDateTime(updatedAt, locale)
          : null;

        setAnnouncement({
          message: String(data.message).trim(),
          updatedAtIso: datetime ? updatedAt : null,
          updatedAtLabel: datetime
            ? m.announcement_updated_at(
                {
                  datetime,
                  japanTime: m.timetable_japan_time({}, { locale }),
                },
                { locale },
              )
            : null,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setAnnouncement(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [announcementUrl, locale]);

  if (!announcement) {
    return null;
  }

  return (
    <aside
      className="w-full bg-(--background-color) px-4 py-8"
      aria-live="polite"
    >
      <div className="mx-auto w-full max-w-4xl">
        <NoticeCallout title={m.announcement({}, { locale })}>
          <p className="whitespace-pre-wrap text-base leading-relaxed">
            {announcement.message}
          </p>
        </NoticeCallout>
        {announcement.updatedAtLabel && announcement.updatedAtIso ? (
          <p className="text-sm text-(--secondary-text-color)">
            <time dateTime={announcement.updatedAtIso}>
              {announcement.updatedAtLabel}
            </time>
          </p>
        ) : null}
      </div>
    </aside>
  );
};
