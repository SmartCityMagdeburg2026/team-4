"use client";

import type { LensId } from "@/lib/types";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import { LENS_ACCENT, LENS_IDS } from "@/lib/access-lens";

interface LensFilterDeckProps {
  activeLenses: Set<LensId>;
  onToggle: (lens: LensId) => void;
}

export function LensFilterDeck({ activeLenses, onToggle }: LensFilterDeckProps) {
  const t = useTranslations();

  return (
    <div className="lens-filter-deck grid grid-cols-1 sm:grid-cols-3 gap-2">
      {LENS_IDS.map((lens) => {
        const on = activeLenses.has(lens);
        const accent = LENS_ACCENT[lens];
        return (
          <button
            key={lens}
            type="button"
            data-cursor-interactive
            onClick={() => onToggle(lens)}
            className={`lens-filter-pill group relative overflow-hidden rounded-xl border px-4 py-3 text-left transition-all duration-300 ${
              on
                ? "border-transparent shadow-card"
                : "border-border bg-canvas/80 opacity-60 hover:opacity-80"
            }`}
            style={
              on
                ? {
                    background: `linear-gradient(135deg, ${accent}12 0%, #FAF9F7 60%)`,
                    boxShadow: `inset 0 0 0 1px ${accent}30`,
                  }
                : undefined
            }
          >
            <span
              className="absolute top-0 left-0 w-1 h-full rounded-l-xl transition-opacity"
              style={{ backgroundColor: accent, opacity: on ? 1 : 0.2 }}
            />
            <span
              className="text-[10px] font-medium uppercase tracking-[0.14em] block mb-0.5"
              style={{ color: on ? accent : undefined }}
            >
              {on ? t("map.lens.filterOn") : t("map.lens.filterOff")}
            </span>
            <span className={`text-sm font-medium ${on ? "text-ink" : "text-ink-faint line-through"}`}>
              {t(`map.lens.toggles.${lens}`)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
