export const MAP_ACCESS_COLORS = {
  high: "#2D4A3E",
  medium: "#C9A227",
  low: "#B83A32",
} as const;

/** Optimistic, clear palette for emergency vehicle charts */
export const VEHICLE_COLORS = {
  medical: "#3D9B82",
  transport: "#5B9FE8",
  rescue: "#8BCB7A",
  air: "#F4B860",
} as const;

export const CHART_COLORS = {
  primary: "#3D9B82",
  secondary: "#5B9FE8",
  tertiary: "#8BCB7A",
  accent: "#F4B860",
  birth: "#5B9FE8",
  death: "#C97B84",
  migrationIn: "#8BCB7A",
  migrationOut: "#B8B4AC",
  migrationNet: "#3D9B82",
  grid: "#E5E1DB",
  axis: "#9C9890",
  tooltip: "#181614",
  cursor: "#2D4A3E",
} as const;

export const chartMargin = { top: 12, right: 20, left: 4, bottom: 4 };

export const axisStyle = {
  fontSize: 11,
  fill: CHART_COLORS.axis,
  fontFamily: "var(--font-ibm-plex)",
};

export const gridStyle = {
  stroke: CHART_COLORS.grid,
  strokeDasharray: "3 3",
};

export const cursorStyle = {
  stroke: CHART_COLORS.cursor,
  strokeWidth: 1,
  strokeDasharray: "4 4",
  strokeOpacity: 0.35,
};

export const CHART_ANIMATION_DELAY_MS = 140;

export const chartAnimation = {
  isAnimationActive: true,
  animationDuration: 500,
  animationEasing: "ease-out" as const,
};

export const chartAnimationDelayed = {
  ...chartAnimation,
  animationBegin: CHART_ANIMATION_DELAY_MS,
};

export function staggeredChartAnimation(index: number) {
  return {
    ...chartAnimation,
    animationBegin: CHART_ANIMATION_DELAY_MS + index * 70,
  };
}

export const activeDotStyle = {
  r: 6,
  stroke: "#FFFFFF",
  strokeWidth: 2,
};
