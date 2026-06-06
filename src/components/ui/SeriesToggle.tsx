"use client";

export interface SeriesOption {
  key: string;
  label: string;
  color: string;
}

interface SeriesToggleProps {
  series: SeriesOption[];
  hidden: Set<string>;
  onToggle: (key: string) => void;
}

export function SeriesToggle({ series, hidden, onToggle }: SeriesToggleProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {series.map((s) => {
        const active = !hidden.has(s.key);
        return (
          <button
            key={s.key}
            type="button"
            onClick={() => onToggle(s.key)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md border transition-all ${
              active
                ? "bg-surface text-ink border-border-strong"
                : "bg-canvas text-ink-faint border-border opacity-50"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: active ? s.color : "#9C9890" }}
            />
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
