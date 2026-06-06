"use client";

import { useMemo, useState } from "react";
import type { DashboardData } from "@/lib/types";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import { IndexedPressureCanvas, type IndexedRow } from "./IndexedPressureCanvas";

interface InsightsSectionProps {
  data: DashboardData["insights"];
}

function toIndexSeries(
  timeline: DashboardData["insights"]["combinedTimeline"]
): IndexedRow[] {
  if (timeline.length === 0) return [];
  const base = timeline[0];
  return timeline.map((row) => ({
    year: row.year,
    emergencyIndex: Math.round((row.emergencyIncidents / base.emergencyIncidents) * 100),
    ageIndex: Math.round((row.averageAge / base.averageAge) * 100),
    doctorsIndex: Math.round((row.doctorsPer1000 / base.doctorsPer1000) * 100),
  }));
}

export function InsightsSection({ data }: InsightsSectionProps) {
  const t = useTranslations();
  const [activeFinding, setActiveFinding] = useState<number | null>(null);

  const indexedData = useMemo(
    () => toIndexSeries(data.combinedTimeline),
    [data.combinedTimeline]
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="font-sans text-sm font-medium text-ink">{t("charts.insights.keyFindings")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.keyFindings.map((finding, index) => (
            <button
              key={finding.id}
              type="button"
              data-cursor-interactive
              onClick={() =>
                setActiveFinding((prev) => (prev === index ? null : index))
              }
              className={`card p-6 md:p-8 text-left transition-all hover:shadow-elevated ${
                activeFinding === index
                  ? "ring-2 ring-accent/30 border-accent/40"
                  : ""
              }`}
            >
              <p className="text-xs font-medium uppercase tracking-wider text-ink-muted mb-2">
                {t("charts.insights.finding")} {index + 1}
              </p>
              <h4 className="font-serif text-xl text-ink leading-snug mb-3">
                {finding.title}
              </h4>
              <p className="text-sm text-ink-muted leading-relaxed">{finding.body}</p>
            </button>
          ))}
        </div>
      </div>

      <IndexedPressureCanvas data={indexedData} />
    </div>
  );
}
