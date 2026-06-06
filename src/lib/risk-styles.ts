import type { RiskDistrict } from "./types";
import { MAP_ACCESS_COLORS } from "./chart-theme";

export const RISK_MAP_COLORS: Record<RiskDistrict["riskLevel"], string> = {
  High: MAP_ACCESS_COLORS.low,
  Medium: MAP_ACCESS_COLORS.medium,
  Low: MAP_ACCESS_COLORS.high,
};

export const RISK_LEVEL_STYLES: Record<RiskDistrict["riskLevel"], string> = {
  High: "bg-[#B83A32]/10 text-[#B83A32] border-[#B83A32]/25",
  Medium: "bg-[#C9A227]/15 text-[#7A6210] border-[#C9A227]/40",
  Low: "bg-[#2D4A3E]/10 text-[#2D4A3E] border-[#2D4A3E]/25",
};
