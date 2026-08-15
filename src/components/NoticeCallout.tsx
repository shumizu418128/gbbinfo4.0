import type { ReactNode } from "react";

type NoticeCalloutProps = {
  children: ReactNode;
  /** 見出し（例: お知らせ）。省略可。 */
  title?: string;
};

const rootClass =
  "my-4 border-l-4 border-(--notice-border-color) bg-(--notice-background-color) p-4 text-(--notice-text-color)";

const titleRowClass = "mb-2 flex items-center gap-2";

const titleClass = "text-sm font-bold tracking-wide";

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    width="24"
    viewBox="0 -960 960 960"
    fill="currentColor"
    aria-hidden="true"
    className="shrink-0"
  >
    <path d="M508.5-291.5Q520-303 520-320t-11.5-28.5Q497-360 480-360t-28.5 11.5Q440-337 440-320t11.5 28.5Q463-280 480-280t28.5-11.5ZM440-440h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
  </svg>
);

/**
 * 臨時お知らせ向けのコールアウト。
 *
 * PostIt（オレンジ左線・半透明）とは別系統。
 * 黄色左線・白背景強め・info アイコン付き。
 *
 * Args:
 *   children: 本文。
 *   title: 見出し。
 *
 * Returns:
 *   コールアウト要素。
 */
export const NoticeCallout = ({
  children,
  title,
}: NoticeCalloutProps): ReactNode => (
  <div className={rootClass}>
    {title ? (
      <p className={titleRowClass}>
        <InfoIcon />
        <span className={titleClass}>{title}</span>
      </p>
    ) : (
      <div className="mb-2">
        <InfoIcon />
      </div>
    )}
    {children}
  </div>
);
