import type { DashboardData } from "./types";
import dashboardData from "@/data/dashboard.json";

export function getDashboardData(): DashboardData {
  return dashboardData as DashboardData;
}

/** @deprecated Use useFormatNumber() in client components for locale-aware formatting */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("de-DE").format(value);
}

/** @deprecated Use useFormatNumber() in client components for locale-aware formatting */
export function formatChange(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}
