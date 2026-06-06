"use client";

import { useTranslations } from "@/lib/i18n/LocaleProvider";

interface FocusStat {
  label: string;
  value: string;
  delta?: string;
  tone?: "neutral" | "up" | "down";
}

interface ChartFocusPanelProps {
  year: number | null;
  stats: FocusStat[];
  hint?: string;
}

export function ChartFocusPanel({ year, stats, hint }: ChartFocusPanelProps) {
  const t = useTranslations();

  if (!year) {
    return (
      <div className="mt-4 rounded-md border border-dashed border-border bg-canvas/60 px-4 py-3">
        <p className="text-xs text-ink-muted">
          {hint ?? t("charts.common.hint")}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-md border border-border bg-canvas px-4 py-3 animate-fade-in">
      <p className="text-[11px] font-medium uppercase tracking-wider text-ink-muted mb-2">
        {year} · {t("charts.common.selected")}
      </p>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-[11px] text-ink-faint">{stat.label}</p>
            <p className="text-sm font-medium text-ink tabular-nums">
              {stat.value}
              {stat.delta && (
                <span
                  className={`ml-1.5 text-xs font-normal ${
                    stat.tone === "up"
                      ? "text-signal-emergency"
                      : stat.tone === "down"
                        ? "text-signal-birth"
                        : "text-ink-muted"
                  }`}
                >
                  {stat.delta}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
