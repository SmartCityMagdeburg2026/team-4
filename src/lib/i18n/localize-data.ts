import type { DashboardData } from "@/lib/types";
import type { TFunction } from "./translations";

export function localizeDashboardData(data: DashboardData, t: TFunction): DashboardData {
  return {
    ...data,
    overview: data.overview.map((metric) => ({
      ...metric,
      label: t(`kpi.${metric.id}.label`),
      changeLabel: metric.changeLabel ? t(`kpi.${metric.id}.changeLabel`) : metric.changeLabel,
    })),
    narratives: {
      population: t("narratives.population"),
      emergency: t("narratives.emergency"),
      healthcare: t("narratives.healthcare"),
      insights: t("narratives.insights"),
      risk: t("narratives.risk"),
    },
    healthcare: {
      ...data.healthcare,
      excludedDistrictsNote: t("map.excludedNote"),
    },
    insights: {
      ...data.insights,
      keyFindings: data.insights.keyFindings.map((finding) => ({
        ...finding,
        title: t(`findings.${finding.id}.title`),
        body: t(`findings.${finding.id}.body`),
      })),
    },
    riskDistricts: data.riskDistricts.map((district) => ({
      ...district,
      riskLevel: district.riskLevel,
    })),
  };
}
