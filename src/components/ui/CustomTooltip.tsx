interface TooltipPayload {
  name: string;
  value: number;
  color: string;
  dataKey?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  formatter?: (value: number, name: string) => string;
  numberLocale?: string;
}

export function CustomTooltip({
  active,
  payload,
  label,
  formatter,
  numberLocale = "de-DE",
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-ink/95 backdrop-blur-sm text-white text-xs rounded-lg px-3.5 py-2.5 shadow-elevated border border-white/10 min-w-[140px]">
      <p className="font-semibold mb-2 text-white/90">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-white/70">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}
            </span>
            <span className="font-semibold tabular-nums">
              {formatter
                ? formatter(entry.value, entry.name)
                : entry.value.toLocaleString(numberLocale)}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-white/40 mt-2 pt-1.5 border-t border-white/10">
        Click to pin selection
      </p>
    </div>
  );
}
