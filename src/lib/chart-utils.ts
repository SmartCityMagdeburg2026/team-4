export type YearRange = "all" | "recent" | "decade";

export const YEAR_RANGES: { id: YearRange; label: string; from: number }[] = [
  { id: "all", label: "All years", from: 2010 },
  { id: "recent", label: "2020–2024", from: 2020 },
  { id: "decade", label: "2010–2019", from: 2010 },
];

export function filterByRange<T extends { year: number }>(
  data: T[],
  range: YearRange
): T[] {
  if (range === "all") return data;
  if (range === "recent") return data.filter((d) => d.year >= 2020);
  return data.filter((d) => d.year >= 2010 && d.year <= 2019);
}

export function findByYear<T extends { year: number }>(
  data: T[],
  year: number | null
): T | undefined {
  if (year === null) return undefined;
  return data.find((d) => d.year === year);
}

export function pctDelta(current: number, previous: number): string {
  if (!previous) return "—";
  const delta = ((current - previous) / previous) * 100;
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)}%`;
}
