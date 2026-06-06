import { AmbulanceIcon } from "@/components/emergency/AmbulanceIcon";
import { MedicalIcon } from "@/components/emergency/MedicalIcon";
import { PlaneIcon } from "@/components/emergency/PlaneIcon";
import { RescueIcon } from "@/components/emergency/RescueIcon";

export type PictogramIcon = "medical" | "ambulance" | "rescue" | "plane";

interface PictogramBarProps {
  value: number;
  max: number;
  color: string;
  delayMs?: number;
  icon?: PictogramIcon;
}

function PictogramThumbIcon({ icon }: { icon: PictogramIcon }) {
  switch (icon) {
    case "medical":
      return <MedicalIcon size={18} className="pictogram-icon-medical" />;
    case "ambulance":
      return <AmbulanceIcon size={18} className="pictogram-icon-ambulance" />;
    case "rescue":
      return <RescueIcon size={18} className="pictogram-icon-rescue" />;
    case "plane":
      return <PlaneIcon size={18} className="pictogram-icon-plane" />;
  }
}

export function PictogramBar({
  value,
  max,
  color,
  delayMs = 0,
  icon,
}: PictogramBarProps) {
  const ratio = max > 0 ? Math.min(value / max, 1) : 0;
  const fillRatio = ratio;
  const pct = Math.round(ratio * 100);

  return (
    <div className="flex items-center gap-3 w-full min-w-0" aria-hidden>
      <div className="relative flex-1 h-10 min-w-0">
        <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-border" />

        {fillRatio > 0 && (
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 h-1.5 rounded-full transition-all duration-500 ease-out pictogram-bar-fill"
            style={{
              width: `calc((100% - 1.5rem) * ${fillRatio})`,
              backgroundColor: color,
              transitionDelay: `${delayMs}ms`,
            }}
          />
        )}

        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-surface border-2"
          style={{ left: "0.75rem", borderColor: color, transform: "translate(-50%, -50%)" }}
        />

        {fillRatio > 0 &&
          (icon ? (
            <div
              className="absolute top-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-surface border-2 shadow-card transition-all duration-500 ease-out"
              style={{
                left: `calc(0.75rem + (100% - 1.5rem) * ${fillRatio})`,
                borderColor: color,
                transform: "translate(-50%, -50%)",
                transitionDelay: `${delayMs}ms`,
                color,
              }}
            >
              <PictogramThumbIcon icon={icon} />
            </div>
          ) : (
            <div
              className="absolute top-1/2 w-3.5 h-3.5 rounded-full bg-surface border-2 transition-all duration-500 ease-out"
              style={{
                left: `calc(0.75rem + (100% - 1.5rem) * ${fillRatio})`,
                borderColor: color,
                transform: "translate(-50%, -50%)",
                transitionDelay: `${delayMs}ms`,
              }}
            />
          ))}
      </div>
      <span className="text-xs tabular-nums text-ink-muted w-10 text-right shrink-0 font-medium">
        {pct}%
      </span>
    </div>
  );
}
