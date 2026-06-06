"use client";

import { useCallback } from "react";
import { useLocale } from "./LocaleProvider";
import { formatChange, formatDecimal, formatNumber } from "./format";

export function useFormatNumber() {
  const { locale } = useLocale();

  return {
    locale,
    formatNumber: useCallback((value: number) => formatNumber(value, locale), [locale]),
    formatDecimal: useCallback(
      (value: number, decimals = 1) => formatDecimal(value, locale, decimals),
      [locale]
    ),
    formatChange: useCallback((value: number) => formatChange(value, locale), [locale]),
  };
}
