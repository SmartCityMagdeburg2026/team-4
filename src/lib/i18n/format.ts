import type { Locale } from "./types";

const NUMBER_LOCALE: Record<Locale, string> = {
  de: "de-DE",
  en: "en-US",
};

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(NUMBER_LOCALE[locale]).format(value);
}

export function formatDecimal(value: number, locale: Locale, decimals = 1): string {
  return new Intl.NumberFormat(NUMBER_LOCALE[locale], {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatChange(value: number, locale: Locale): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatDecimal(value, locale, 1)}%`;
}
