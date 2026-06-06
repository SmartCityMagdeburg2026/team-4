import type { AccessLensDistrict, LensId, LensLevel } from "@/lib/types";

export const LENS_IDS: LensId[] = ["physicians", "transport", "transit"];

const LENS_LEVEL_KEY: Record<LensId, keyof AccessLensDistrict> = {
  physicians: "physicianLevel",
  transport: "transportLevel",
  transit: "transitLevel",
};

export const LENS_COLORS: Record<LensLevel, string> = {
  weak: "#B83A32",
  medium: "#C9A227",
  strong: "#2D4A3E",
};

export const COMPOUND_GAP_COLOR = "#6B2D5C";

export function lensLevelFor(
  district: AccessLensDistrict,
  lens: LensId
): LensLevel {
  return district[LENS_LEVEL_KEY[lens]] as LensLevel;
}

export function isLensWeak(district: AccessLensDistrict, lens: LensId): boolean {
  return lensLevelFor(district, lens) === "weak";
}

export function weakActiveLensCount(
  district: AccessLensDistrict,
  activeLenses: Set<LensId>
): number {
  return LENS_IDS.filter((l) => activeLenses.has(l) && isLensWeak(district, l)).length;
}

export function isCompoundGap(
  district: AccessLensDistrict,
  activeLenses: Set<LensId>
): boolean {
  if (activeLenses.size === 0) return false;
  return weakActiveLensCount(district, activeLenses) === activeLenses.size;
}

export function districtLensColor(
  district: AccessLensDistrict,
  activeLenses: Set<LensId>
): string {
  if (isCompoundGap(district, activeLenses)) return COMPOUND_GAP_COLOR;
  const weak = weakActiveLensCount(district, activeLenses);
  if (weak >= 2) return LENS_COLORS.weak;
  if (weak === 1) return LENS_COLORS.medium;
  return LENS_COLORS.strong;
}

export function accessLensByDistrict(
  districts: AccessLensDistrict[]
): Map<string, AccessLensDistrict> {
  return new Map(districts.map((d) => [d.district, d]));
}

export function gapFraction(
  district: AccessLensDistrict,
  activeLenses: Set<LensId>
): { weak: number; total: number } {
  const total = activeLenses.size;
  const weak = weakActiveLensCount(district, activeLenses);
  return { weak, total };
}

export const LENS_ACCENT: Record<LensId, string> = {
  physicians: "#2D4A3E",
  transport: "#3D6B8E",
  transit: "#6B5B4A",
};
