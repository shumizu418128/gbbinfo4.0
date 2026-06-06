import { useEffect, useState } from "react";
import type { YearWithCountry } from "../db/year";
import { Flag } from "./Flag";

/** GBB 2026 開始（UTC） */
export const NEXT_GBB = "2026-09-24T12:00:00+00:00";
export const NEXT_GBB_YEAR = NEXT_GBB.split("-")[0];

export const MESSAGES = [
  "I say 3, y'all say 2 & 1.",
  "Are you ready?",
  "You know what to do.",
  "Esh?",
  "Sounds good?",
  "Oh-la-la!",
  "Beatbox is MUSIC.",
  "Do we have a crowd?",
  "#BbkForThePresident",
  "keep it strange...",
  "Next up to the stage..."
]
const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

type Remaining = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const parseRemaining = (targetMs: number): Remaining => {
  const totalMs = Math.max(0, targetMs - Date.now());
  const secondsTotal = Math.floor(totalMs / 1000);
  const days = Math.floor(secondsTotal / 86400);
  const hours = Math.floor((secondsTotal % 86400) / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = secondsTotal % 60;
  return { totalMs, days, hours, minutes, seconds };
};

type GbbCountdownProps = {
  latestYearWithCountry: YearWithCountry;
  /** カウントダウン終点の ISO 8601 文字列 */
  targetIso?: string;
};

/**
 * 指定日時までの残り時間を日・時・分・秒で表示する。
 *
 * クライアントで秒境界に合わせた ``setTimeout`` により更新する。ハイドレーションずれを避けるため、
 * マウント後に表示を開始する。
 *
 * Args:
 *   targetIso: カウントダウン終点。省略時は ``GBB_2026_TARGET_ISO``。
 */
export const GbbCountdown = ({ latestYearWithCountry, targetIso = NEXT_GBB }: GbbCountdownProps) => {
  const [mounted, setMounted] = useState(false);
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const target = Date.parse(targetIso);
    if (Number.isNaN(target)) {
      return;
    }

    let timeoutId: number | undefined;

    const tick = () => {
      const next = parseRemaining(target);
      setRemaining(next);
      if (next.totalMs === 0) {
        return;
      }
      const delay = 1000 - (Date.now() % 1000);
      timeoutId = window.setTimeout(tick, delay);
    };

    tick();
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [mounted, targetIso]);

  if (!mounted || remaining === null) {
    return null;
  }

  if (remaining.totalMs === 0) {
    return null;
  }

  const segments: Array<{ label: string; value: number; format: (v: number) => string }> = [
    { label: "d", value: remaining.days, format: (v) => String(v) },
    { label: "h", value: remaining.hours, format: (v) => String(v).padStart(2, "0") },
    { label: "m", value: remaining.minutes, format: (v) => String(v).padStart(2, "0") },
    { label: "s", value: remaining.seconds, format: (v) => String(v).padStart(2, "0") },
  ];

  const { isoAlpha2 } = latestYearWithCountry.country;
  const { city } = latestYearWithCountry;

  return (
    <div className="mt-8 z-10 w-full max-w-2xl px-4" aria-live="polite">
      <p className="mb-4 text-center text-white text-[24px]">
        GBB {NEXT_GBB_YEAR}<br /><Flag isoAlpha2={isoAlpha2} /> {city}
      </p>
      <div
        className="flex flex-wrap justify-center"
        style={{ gap: "32px" }}
        role="timer"
      >
        {segments.map((s) => (
          <div key={s.label} className="flex min-w-[32px] flex-col items-center">
            <span
              className="font-bold tabular-nums text-(--gbb-color)"
              style={{ fontSize: "clamp(24px, 6vw, 48px)" }}
            >
              {s.format(s.value)}
            </span>
            <span className="mt-2 text-[16px] text-(--secondary-text-color)">{s.label}</span>
          </div>
        ))}
      </div>
      <p className="mb-4 text-center text-white text-[16px] mt-10">
        {message}
      </p>
    </div>
  );
}
