"use client";

import { ReactNode } from "react";
import type { YearRange } from "@/lib/chart-utils";
import { YearRangePills } from "./YearRangePills";
import { SeriesToggle, type SeriesOption } from "./SeriesToggle";

interface InteractiveChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  yearRange?: YearRange;
  onYearRangeChange?: (range: YearRange) => void;
  series?: SeriesOption[];
  hiddenSeries?: Set<string>;
  onSeriesToggle?: (key: string) => void;
  footer?: ReactNode;
}

export function InteractiveChartCard({
  title,
  subtitle,
  children,
  className = "",
  yearRange,
  onYearRangeChange,
  series,
  hiddenSeries,
  onSeriesToggle,
  footer,
}: InteractiveChartCardProps) {
  return (
    <div className={`card p-6 md:p-8 transition-shadow hover:shadow-elevated ${className}`}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-sans text-sm font-medium text-ink">{title}</h3>
          {subtitle && (
            <p className="text-xs text-ink-muted mt-1">{subtitle}</p>
          )}
        </div>
        {yearRange !== undefined && onYearRangeChange && (
          <YearRangePills value={yearRange} onChange={onYearRangeChange} />
        )}
      </div>

      {series && hiddenSeries && onSeriesToggle && (
        <div className="mb-4">
          <SeriesToggle
            series={series}
            hidden={hiddenSeries}
            onToggle={onSeriesToggle}
          />
        </div>
      )}

      {children}
      {footer}
    </div>
  );
}
