"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { DashboardData } from "@/lib/types";
import type { PictogramIcon } from "@/components/ui/PictogramBar";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { PictogramBar } from "@/components/ui/PictogramBar";
import { YearSlider } from "@/components/ui/YearSlider";
import { VEHICLE_COLORS } from "@/lib/chart-theme";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import { AmbulanceIcon } from "./AmbulanceIcon";
import { MedicalIcon } from "./MedicalIcon";
import { PlaneIcon } from "./PlaneIcon";
import { RescueIcon } from "./RescueIcon";

interface EmergencyPictogramProps {
  timeline: DashboardData["emergency"]["timeline"];
}

function CategoryLabelIcon({ icon, color }: { icon: PictogramIcon; color: string }) {
  const cls = "shrink-0";
  const wrap = (node: ReactNode) => (
    <span className="inline-flex" style={{ color }}>
      {node}
    </span>
  );
  switch (icon) {
    case "medical":
      return wrap(<MedicalIcon size={16} className={`pictogram-icon-medical ${cls}`} />);
    case "ambulance":
      return wrap(<AmbulanceIcon size={16} className={`pictogram-icon-ambulance ${cls}`} />);
    case "rescue":
      return wrap(<RescueIcon size={16} className={`pictogram-icon-rescue ${cls}`} />);
    case "plane":
      return wrap(<PlaneIcon size={16} className={`pictogram-icon-plane ${cls}`} />);
  }
}

export function EmergencyPictogram({ timeline }: EmergencyPictogramProps) {
  const t = useTranslations();
  const defaultYear = timeline[timeline.length - 1]?.year ?? 2024;
  const [year, setYear] = useState(defaultYear);
  const categories = useMemo(
    () =>
      [
        {
          key: "medicalVehicles" as const,
          label: t("charts.emergency.categories.medical"),
          color: VEHICLE_COLORS.medical,
          icon: "medical" as const,
        },
        {
          key: "rescueTransport" as const,
          label: t("charts.emergency.categories.transport"),
          color: VEHICLE_COLORS.transport,
          icon: "ambulance" as const,
        },
        {
          key: "ambulances" as const,
          label: t("charts.emergency.categories.rescue"),
          color: VEHICLE_COLORS.rescue,
          icon: "rescue" as const,
        },
        {
          key: "helicopter" as const,
          label: t("charts.emergency.categories.air"),
          color: VEHICLE_COLORS.air,
          icon: "plane" as const,
        },
      ] as const,
    [t]
  );

  const years = useMemo(() => timeline.map((d) => d.year), [timeline]);
  const row = timeline.find((d) => d.year === year) ?? timeline[timeline.length - 1];
  const total = row.total > 0 ? row.total : 1;

  return (
    <div className="card overflow-hidden" data-cursor-interactive>
      <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4 border-b border-border bg-canvas/40">
        <AnimatedNumber
          value={row.total}
          size="lg"
          className="text-accent block leading-tight"
        />
        <p className="text-sm text-ink-muted mt-1">
          {t("charts.emergency.pictogram.deploymentsIn")}{" "}
          <span className="font-medium text-ink">{year}</span>
        </p>
      </div>

      <div className="px-6 md:px-8 py-6 space-y-6">
        {categories.map((cat, index) => (
          <div
            key={cat.key}
            data-pictogram-row
            data-cursor-interactive
            className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5"
          >
            <div className="sm:w-44 shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <CategoryLabelIcon icon={cat.icon} color={cat.color} />
                <p className="text-sm font-medium text-ink-muted">{cat.label}</p>
              </div>
              <AnimatedNumber value={row[cat.key]} size="sm" className="text-ink block" />
            </div>
            <div className="flex-1 min-w-0 w-full">
              <PictogramBar
                value={row[cat.key]}
                max={total}
                color={cat.color}
                delayMs={140 + index * 60}
                icon={cat.icon}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2 border-t border-border bg-canvas/30">
        <p className="text-xs text-ink-faint mb-2">{t("charts.emergency.pictogram.slideYears")}</p>
        <YearSlider years={years} value={year} onChange={setYear} />
      </div>
    </div>
  );
}
