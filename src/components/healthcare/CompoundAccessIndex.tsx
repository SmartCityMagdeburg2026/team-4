"use client";

import { useMemo } from "react";
import type { AccessLensDistrict, DistrictSummary, LensId } from "@/lib/types";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import { useFormatNumber } from "@/lib/i18n/useFormatNumber";
import {
  COMPOUND_GAP_COLOR,
  gapFraction,
  isCompoundGap,
  LENS_COLORS,
  weakActiveLensCount,
} from "@/lib/access-lens";
import { LensPrism } from "./LensPrism";

interface RankedRow {
  district: DistrictSummary;
  lens: AccessLensDistrict;
  rank: number;
  compound: boolean;
  weak: number;
}

interface CompoundAccessIndexProps {
  districts: DistrictSummary[];
  lensByDistrict: Map<string, AccessLensDistrict>;
  activeLenses: Set<LensId>;
  selectedDistrict: string | null;
  onSelect: (name: string) => void;
  footnote: string;
}

export function CompoundAccessIndex({
  districts,
  lensByDistrict,
  activeLenses,
  selectedDistrict,
  onSelect,
  footnote,
}: CompoundAccessIndexProps) {
  const t = useTranslations();
  const { formatDecimal } = useFormatNumber();

  const rows = useMemo(() => {
    const sorted = districts
      .map((district) => {
        const lens = lensByDistrict.get(district.district);
        if (!lens) return null;
        const compound = isCompoundGap(lens, activeLenses);
        const weak = weakActiveLensCount(lens, activeLenses);
        return { district, lens, compound, weak };
      })
      .filter((r): r is Omit<RankedRow, "rank"> => r !== null)
      .sort((a, b) => {
        const score = (r: Omit<RankedRow, "rank">) =>
          (r.compound ? 1000 : 0) + r.weak * 100 - r.district.ratioPer1000;
        return score(b) - score(a);
      });

    return sorted.map((r, i) => ({ ...r, rank: i + 1 }));
  }, [districts, lensByDistrict, activeLenses]);

  const spotlight = rows.filter((r) => r.compound || r.weak >= 2).slice(0, 4);
  const compoundCount = rows.filter((r) => r.compound).length;

  return (
    <div className="compound-access-index card overflow-hidden border-border">
      <div className="relative px-6 md:px-8 pt-7 pb-5 border-b border-border/80">
        <div className="compound-access-index-mesh absolute inset-0 pointer-events-none" aria-hidden />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-faint mb-2">
              {t("map.lens.indexEyebrow")}
            </p>
            <h3 className="font-serif text-2xl md:text-3xl text-ink tracking-tight">
              {t("map.lens.rankingTitle")}
            </h3>
            <p className="text-sm text-ink-muted mt-2 max-w-lg leading-relaxed">
              {t("map.lens.rankingHint")}
            </p>
          </div>
          <div className="text-right">
            <p className="font-serif text-4xl text-ink/90 tabular-nums leading-none">
              {String(rows.length).padStart(2, "0")}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-ink-faint mt-1">
              {t("map.lens.indexCount")}
            </p>
          </div>
        </div>
      </div>

      {spotlight.length > 0 && (
        <div className="px-4 md:px-6 py-5 border-b border-border/60 bg-canvas/40">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-ink-muted mb-3 px-2">
            {t("map.lens.convergence")}
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-thin">
            {spotlight.map(({ district, lens, compound }) => (
              <button
                key={district.district}
                type="button"
                data-cursor-interactive
                onClick={() => onSelect(district.district)}
                className={`convergence-card snap-start shrink-0 w-[min(100%,220px)] rounded-2xl border p-4 text-left transition-all duration-300 ${
                  selectedDistrict === district.district
                    ? "border-accent/50 shadow-elevated scale-[1.02]"
                    : "border-border hover:border-border-strong hover:shadow-card"
                } ${compound ? "convergence-card--triple" : ""}`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <LensPrism district={lens} activeLenses={activeLenses} size={48} />
                  {compound && (
                    <span
                      className="text-[9px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full"
                      style={{
                        color: COMPOUND_GAP_COLOR,
                        backgroundColor: `${COMPOUND_GAP_COLOR}14`,
                        border: `1px solid ${COMPOUND_GAP_COLOR}30`,
                      }}
                    >
                      {t("map.lens.tripleGap")}
                    </span>
                  )}
                </div>
                <p className="font-medium text-sm text-ink leading-tight">{district.district}</p>
                <p className="text-xs text-ink-faint mt-1 tabular-nums">
                  {formatDecimal(district.ratioPer1000, 2)} / 1k
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-3 md:px-4 py-3">
        <div className="hidden md:grid grid-cols-[2.5rem_1fr_3.5rem_4rem_5rem] gap-3 px-4 py-2 text-[9px] font-medium uppercase tracking-[0.14em] text-ink-faint">
          <span>#</span>
          <span>{t("map.lens.colDistrict")}</span>
          <span className="text-center">{t("map.lens.colPrism")}</span>
          <span className="text-right">{t("map.lens.colPhysicians")}</span>
          <span className="text-right">{t("map.lens.colGap")}</span>
        </div>

        <div className="compound-access-scroll max-h-[380px] overflow-y-auto">
          {rows.map(({ district, lens, rank, compound }) => {
            const { weak, total } = gapFraction(lens, activeLenses);
            const selected = selectedDistrict === district.district;

            return (
              <button
                key={district.district}
                type="button"
                data-cursor-interactive
                onClick={() => onSelect(district.district)}
                className={`access-index-row group w-full grid grid-cols-[auto_1fr_auto] md:grid-cols-[2.5rem_1fr_3.5rem_4rem_5rem] gap-3 items-center px-3 md:px-4 py-3.5 rounded-xl text-left transition-all duration-300 ${
                  selected
                    ? "bg-accent-muted/80 ring-1 ring-accent/25"
                    : "hover:bg-canvas/90"
                } ${compound ? "access-index-row--compound" : ""}`}
              >
                <span className="relative font-serif text-lg md:text-xl text-ink-faint/80 tabular-nums w-8 md:w-auto text-center md:text-left group-hover:text-ink-muted transition-colors">
                  {String(rank).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex items-center gap-3">
                  <LensPrism
                    district={lens}
                    activeLenses={activeLenses}
                    size={40}
                    className="md:hidden"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-ink truncate">{district.district}</p>
                    <p className="text-[10px] text-ink-faint mt-0.5 md:hidden tabular-nums">
                      {formatDecimal(district.ratioPer1000, 2)} / 1k
                    </p>
                  </div>
                  {compound && (
                    <span
                      className="hidden sm:inline text-[9px] font-semibold uppercase tracking-wider shrink-0"
                      style={{ color: COMPOUND_GAP_COLOR }}
                    >
                      {t("map.lens.tripleGap")}
                    </span>
                  )}
                </div>

                <div className="hidden md:flex justify-center">
                  <LensPrism district={lens} activeLenses={activeLenses} size={44} />
                </div>

                <span className="hidden md:block text-sm text-ink-muted text-right tabular-nums font-serif">
                  {formatDecimal(district.ratioPer1000, 2)}
                </span>

                <div className="flex flex-col items-end shrink-0">
                  <span
                    className="text-xs font-medium tabular-nums"
                    style={{
                      color:
                        weak === total
                          ? COMPOUND_GAP_COLOR
                          : weak >= 2
                            ? LENS_COLORS.weak
                            : weak === 1
                              ? LENS_COLORS.medium
                              : LENS_COLORS.strong,
                    }}
                  >
                    {weak}/{total}
                  </span>
                  <span className="text-[9px] text-ink-faint uppercase tracking-wide">
                    {t("map.lens.gapShort")}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 md:px-8 py-4 border-t border-border/80 flex flex-wrap items-center justify-between gap-3 bg-canvas/30">
        <p className="text-xs text-ink-faint leading-relaxed max-w-xl">{footnote}</p>
        {compoundCount > 0 && (
          <p
            className="text-xs font-medium shrink-0"
            style={{ color: COMPOUND_GAP_COLOR }}
          >
            {t("map.lens.compoundLegend").replace("{count}", String(compoundCount))}
          </p>
        )}
      </div>
    </div>
  );
}
