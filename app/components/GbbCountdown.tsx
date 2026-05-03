import { useEffect, useState } from "react";

/** GBB 2026 開始（UTC） */
export const GBB_2026_TARGET_ISO = "2026-09-24T12:00:00+00:00";

type Remaining = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};

function parseRemaining(targetMs: number): Remaining {
  const totalMs = Math.max(0, targetMs - Date.now());
  const milliseconds = totalMs % 1000;
  const secondsTotal = Math.floor(totalMs / 1000);
  const days = Math.floor(secondsTotal / 86400);
  const hours = Math.floor((secondsTotal % 86400) / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = secondsTotal % 60;
  return { totalMs, days, hours, minutes, seconds, milliseconds };
}

type GbbCountdownProps = {
  /** カウントダウン終点の ISO 8601 文字列 */
  targetIso?: string;
};

/**
 * 指定日時までの残り時間を日・時・分・秒・ミリ秒で表示する。
 *
 * クライアントで ``requestAnimationFrame`` により更新する。ハイドレーションずれを避けるため、
 * マウント後に表示を開始する。
 *
 * Args:
 *   targetIso: カウントダウン終点。省略時は ``GBB_2026_TARGET_ISO``。
 */
export function GbbCountdown({ targetIso = GBB_2026_TARGET_ISO }: GbbCountdownProps) {
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

    let rafId = 0;
    let cancelled = false;

    const loop = () => {
      if (cancelled) {
        return;
      }
      setRemaining(parseRemaining(target));
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [mounted, targetIso]);

  if (!mounted || remaining === null) {
    return
  }

  if (remaining.totalMs === 0) {
    return
  }

  const segments: Array<{ label: string; value: number; format: (v: number) => string }> = [
    { label: "d", value: remaining.days, format: (v) => String(v) },
    { label: "h", value: remaining.hours, format: (v) => String(v).padStart(2, "0") },
    { label: "m", value: remaining.minutes, format: (v) => String(v).padStart(2, "0") },
    { label: "s", value: remaining.seconds, format: (v) => String(v).padStart(2, "0") },
    {
      label: "ms",
      value: remaining.milliseconds,
      format: (v) => String(v).padStart(3, "0"),
    },
  ];

  return (
    <div className="mt-8 z-10 w-full max-w-2xl px-4" aria-live="polite">
      <p className="mb-4 text-center text-white text-[24px]">
        GBB 2026
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
              style={{ fontSize: "clamp(24px, 5vw, 40px)" }}
            >
              {s.format(s.value)}
            </span>
            <span className="mt-2 text-[16px] text-white/80">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
