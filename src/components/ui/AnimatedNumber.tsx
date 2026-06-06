"use client";

import { useEffect, useRef, useState } from "react";
import { useFormatNumber } from "@/lib/i18n/useFormatNumber";

interface AnimatedNumberProps {
  value: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "1.75rem",
  md: "2rem",
  lg: "2.25rem",
} as const;

export function AnimatedNumber({
  value,
  size = "md",
  className,
}: AnimatedNumberProps) {
  const { formatNumber } = useFormatNumber();
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;

    const duration = 700;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) requestAnimationFrame(tick);
      else fromRef.current = to;
    };

    requestAnimationFrame(tick);
  }, [value]);

  return (
    <span
      className={className}
      style={{
        fontSize: SIZES[size],
        fontFamily: "var(--font-newsreader), Georgia, serif",
        lineHeight: 1.1,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {formatNumber(display)}
    </span>
  );
}
