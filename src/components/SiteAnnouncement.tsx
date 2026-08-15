import { useEffect, useState, type ReactNode } from "react";
import { NoticeCallout } from "~/components/NoticeCallout.js";

type SiteAnnouncementData = {
  enabled?: boolean;
  message?: string;
  expiresAt?: string | null;
};

type SiteAnnouncementProps = {
  /** R2 公開 JSON の URL。 */
  announcementUrl: string;
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
 *
 * Returns:
 *   お知らせセクション、または非表示時は null。
 */
export const SiteAnnouncement = ({
  announcementUrl,
}: SiteAnnouncementProps): ReactNode => {
  const [message, setMessage] = useState<string | null>(null);

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
          setMessage(null);
          return;
        }
        setMessage(String(data.message).trim());
      })
      .catch(() => {
        if (!cancelled) {
          setMessage(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [announcementUrl]);

  if (!message) {
    return null;
  }

  return (
    <aside
      className="w-full bg-(--background-color) px-4 py-8"
      aria-live="polite"
    >
      <div className="mx-auto w-full max-w-4xl">
        <NoticeCallout title="お知らせ">
          <p className="whitespace-pre-wrap text-base leading-relaxed">
            {message}
          </p>
        </NoticeCallout>
      </div>
    </aside>
  );
};
