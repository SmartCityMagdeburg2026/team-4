"use client";

import { useMemo } from "react";

interface YearSliderProps {
  years: number[];
  value: number;
  onChange: (year: number) => void;
}

function labelYears(years: number[]): number[] {
  if (years.length <= 8) return years;
  const step = Math.ceil(years.length / 7);
  return years.filter(
    (year, i) => i % step === 0 || i === years.length - 1
  );
}

export function YearSlider({ years, value, onChange }: YearSliderProps) {
  const ticks = useMemo(() => labelYears(years), [years]);

  if (years.length === 0) return null;

  const min = years[0];
  const max = years[years.length - 1];
  const index = years.indexOf(value);
  const safeIndex = index >= 0 ? index : years.length - 1;

  return (
    <div className="pt-2" data-cursor-interactive>
      <input
        type="range"
        min={0}
        max={years.length - 1}
        value={safeIndex}
        onChange={(e) => onChange(years[Number(e.target.value)])}
        className="year-slider w-full"
        aria-label="Select year"
        data-cursor-interactive
      />
      <div className="relative h-5 mt-3 mx-[11px]">
        {ticks.map((year) => {
          const yearIndex = years.indexOf(year);
          const pct =
            years.length > 1 ? (yearIndex / (years.length - 1)) * 100 : 0;
          return (
            <button
              key={year}
              type="button"
              data-cursor-interactive
              onClick={() => onChange(year)}
              style={{ left: `${pct}%` }}
              className={`absolute -translate-x-1/2 text-xs tabular-nums transition-colors ${
                year === value
                  ? "text-accent font-medium"
                  : "text-ink-faint hover:text-ink-muted"
              }`}
            >
              {year}
            </button>
          );
        })}
      </div>
      <p className="sr-only">
        Showing data for {value}, range {min} to {max}
      </p>
    </div>
  );
}
