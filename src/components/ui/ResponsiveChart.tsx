"use client";

import { ReactElement } from "react";
import { ResponsiveContainer } from "recharts";

type ChartSize = "md" | "lg" | "xl";

const HEIGHTS: Record<ChartSize, { mobile: number; desktop: number }> = {
  md: { mobile: 300, desktop: 340 },
  lg: { mobile: 320, desktop: 380 },
  xl: { mobile: 360, desktop: 420 },
};

interface ResponsiveChartProps {
  size?: ChartSize;
  className?: string;
  children: ReactElement;
}

export function ResponsiveChart({ size = "md", className = "", children }: ResponsiveChartProps) {
  const h = HEIGHTS[size].desktop;

  return (
    <div
      className={`w-full min-w-0 ${className}`}
      style={{ height: h, minHeight: h }}
    >
      <ResponsiveContainer width="100%" height={h} debounce={50}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}
