"use client";

import type { AccessLensDistrict, LensId, LensLevel } from "@/lib/types";
import { LENS_IDS, lensLevelFor, isCompoundGap } from "@/lib/access-lens";

const GRADIENT: Record<LensLevel, [string, string]> = {
  weak: ["#C44E45", "#8E2E28"],
  medium: ["#D4B84A", "#9A7A18"],
  strong: ["#3D6B58", "#1E3D32"],
};

interface LensPrismProps {
  district: AccessLensDistrict;
  activeLenses: Set<LensId>;
  size?: number;
  className?: string;
}

/** Fixed precision keeps SSR and client SVG paths identical (avoids hydration drift). */
function svgNum(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function wedgePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const x1 = svgNum(cx + r * Math.cos(toRad(startDeg - 90)));
  const y1 = svgNum(cy + r * Math.sin(toRad(startDeg - 90)));
  const x2 = svgNum(cx + r * Math.cos(toRad(endDeg - 90)));
  const y2 = svgNum(cy + r * Math.sin(toRad(endDeg - 90)));
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${svgNum(cx)} ${svgNum(cy)} L ${x1} ${y1} A ${svgNum(r)} ${svgNum(r)} 0 ${large} 1 ${x2} ${y2} Z`;
}

const WEDGE_START: Record<LensId, number> = {
  physicians: 330,
  transport: 90,
  transit: 210,
};

export function LensPrism({
  district,
  activeLenses,
  size = 52,
  className = "",
}: LensPrismProps) {
  const cx = svgNum(size / 2);
  const cy = svgNum(size / 2);
  const r = svgNum(size * 0.42);
  const compound = isCompoundGap(district, activeLenses);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`lens-prism shrink-0 ${compound ? "lens-prism--compound" : ""} ${className}`}
      aria-hidden
    >
      <defs>
        {LENS_IDS.map((id) => {
          const level = lensLevelFor(district, id);
          const [a, b] = GRADIENT[level];
          return (
            <linearGradient key={id} id={`prism-${district.districtCode}-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={a} />
              <stop offset="100%" stopColor={b} />
            </linearGradient>
          );
        })}
        <filter id="prism-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {compound && (
        <circle
          cx={cx}
          cy={cy}
          r={svgNum(r + 5)}
          fill="none"
          stroke="#6B2D5C"
          strokeWidth="1"
          strokeOpacity="0.35"
          className="lens-prism-ring"
        />
      )}

      <circle cx={cx} cy={cy} r={svgNum(r + 2)} fill="#F7F5F2" stroke="#E5E1DB" strokeWidth="0.5" />

      {LENS_IDS.map((id) => {
        const start = WEDGE_START[id];
        const active = activeLenses.has(id);
        const level = lensLevelFor(district, id);
        return (
          <path
            key={id}
            d={wedgePath(cx, cy, r, start, start + 120)}
            fill={active ? `url(#prism-${district.districtCode}-${id})` : "#E5E1DB"}
            fillOpacity={active ? 1 : 0.45}
            stroke="#FAF9F7"
            strokeWidth="1.2"
            filter={active && level === "weak" ? "url(#prism-glow)" : undefined}
          />
        );
      })}

      <circle cx={cx} cy={cy} r={svgNum(r * 0.22)} fill="#FAF9F7" stroke="#E5E1DB" strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={1.5} fill="#181614" fillOpacity="0.15" />
    </svg>
  );
}
