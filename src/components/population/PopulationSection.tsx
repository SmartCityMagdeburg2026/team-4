"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Brush,
  Cell,
} from "recharts";
import type { DashboardData } from "@/lib/types";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import { InteractiveChartCard } from "@/components/ui/InteractiveChartCard";
import { ResponsiveChart } from "@/components/ui/ResponsiveChart";
import { CustomTooltip } from "@/components/ui/CustomTooltip";
import { ChartFocusPanel } from "@/components/ui/ChartFocusPanel";
import {
  CHART_COLORS,
  chartMargin,
  axisStyle,
  gridStyle,
  cursorStyle,
  chartAnimation,
  activeDotStyle,
} from "@/lib/chart-theme";
import { useFormatNumber } from "@/lib/i18n/useFormatNumber";
import {
  filterByRange,
  findByYear,
  pctDelta,
  type YearRange,
} from "@/lib/chart-utils";
interface PopulationSectionProps {
  data: DashboardData["population"];
}

function toggleSet(prev: Set<string>, key: string): Set<string> {
  const next = new Set(prev);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

export function PopulationSection({ data }: PopulationSectionProps) {
  const t = useTranslations();
  const { formatNumber, formatDecimal, locale } = useFormatNumber();
  const numberLocale = locale === "de" ? "de-DE" : "en-US";
  const [yearRange, setYearRange] = useState<YearRange>("all");
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [pinnedYear, setPinnedYear] = useState<number | null>(null);
  const [hiddenBirthDeath, setHiddenBirthDeath] = useState<Set<string>>(new Set());
  const [showNetMigration, setShowNetMigration] = useState(false);

  const focusYear = pinnedYear ?? activeYear;

  const growth = useMemo(() => filterByRange(data.growth, yearRange), [data.growth, yearRange]);
  const averageAge = useMemo(() => filterByRange(data.averageAge, yearRange), [data.averageAge, yearRange]);
  const birthsDeaths = useMemo(() => filterByRange(data.birthsDeaths, yearRange), [data.birthsDeaths, yearRange]);
  const migration = useMemo(() => filterByRange(data.migration, yearRange), [data.migration, yearRange]);

  const handleYearInteract = (year: number) => {
    setActiveYear(year);
    setPinnedYear((prev) => (prev === year ? null : year));
  };

  const growthFocus = findByYear(data.growth, focusYear);
  const growthPrev = growthFocus
    ? findByYear(data.growth, focusYear! - 1)
    : undefined;

  const bdFocus = findByYear(data.birthsDeaths, focusYear);
  const bdPrev = bdFocus ? findByYear(data.birthsDeaths, focusYear! - 1) : undefined;

  const chartEvents = {
    onMouseMove: (state: { activeLabel?: string | number }) => {
      if (state?.activeLabel) setActiveYear(Number(state.activeLabel));
    },
    onMouseLeave: () => {
      if (!pinnedYear) setActiveYear(null);
    },
    onClick: (state: { activeLabel?: string | number }) => {
      if (state?.activeLabel) handleYearInteract(Number(state.activeLabel));
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InteractiveChartCard
          title={t("charts.population.growth.title")}
          subtitle={t("charts.population.growth.subtitle")}
          yearRange={yearRange}
          onYearRangeChange={setYearRange}
          footer={
            <ChartFocusPanel
              year={focusYear}
              stats={
                growthFocus
                  ? [
                      {
                        label: t("charts.population.growth.label"),
                        value: formatNumber(growthFocus.value),
                        delta: growthPrev
                          ? pctDelta(growthFocus.value, growthPrev.value)
                          : undefined,
                        tone:
                          growthPrev && growthFocus.value > growthPrev.value
                            ? "up"
                            : "down",
                      },
                    ]
                  : []
              }
            />
          }
        >
          <ResponsiveChart size="lg">
              <AreaChart data={growth} margin={chartMargin} {...chartEvents}>
                <defs>
                  <linearGradient id="popGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...gridStyle} vertical={false} />
                <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis
                  tick={axisStyle}
                  axisLine={false}
                  tickLine={false}
                  domain={["dataMin - 5000", "dataMax + 2000"]}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  width={45}
                />
                <Tooltip
                  cursor={cursorStyle}
                  content={<CustomTooltip formatter={(v) => formatNumber(v)} numberLocale={numberLocale} />}
                />
                {focusYear && (
                  <ReferenceLine
                    x={focusYear}
                    stroke={CHART_COLORS.primary}
                    strokeDasharray="4 4"
                    strokeOpacity={0.6}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Population"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2.5}
                  fill="url(#popGradient)"
                  activeDot={activeDotStyle}
                  {...chartAnimation}
                />
                <Brush
                  dataKey="year"
                  height={22}
                  stroke={CHART_COLORS.primary}
                  fill={CHART_COLORS.grid}
                  travellerWidth={8}
                />
              </AreaChart>
          </ResponsiveChart>
        </InteractiveChartCard>

        <InteractiveChartCard
          title={t("charts.population.age.title")}
          subtitle={t("charts.population.age.subtitle")}
          yearRange={yearRange}
          onYearRangeChange={setYearRange}
          footer={
            <ChartFocusPanel
              year={focusYear}
              stats={
                findByYear(data.averageAge, focusYear)
                  ? [
                      {
                        label: t("charts.population.age.label"),
                        value: `${formatDecimal(findByYear(data.averageAge, focusYear)!.value, 1)} yrs`,
                      },
                    ]
                  : []
              }
            />
          }
        >
          <ResponsiveChart size="lg">
              <LineChart data={averageAge} margin={chartMargin} {...chartEvents}>
                <CartesianGrid {...gridStyle} vertical={false} />
                <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis
                  tick={axisStyle}
                  axisLine={false}
                  tickLine={false}
                  domain={["dataMin - 0.8", "dataMax + 0.3"]}
                  tickFormatter={(v) => formatDecimal(v, 1)}
                  width={40}
                />
                <Tooltip
                  cursor={cursorStyle}
                  content={
                    <CustomTooltip
                      formatter={(v) => `${formatDecimal(v, 1)} years`}
                      numberLocale={numberLocale}
                    />
                  }
                />
                {focusYear && (
                  <ReferenceLine x={focusYear} stroke={CHART_COLORS.accent} strokeDasharray="4 4" />
                )}
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Average Age"
                  stroke={CHART_COLORS.accent}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: CHART_COLORS.accent, strokeWidth: 0 }}
                  activeDot={activeDotStyle}
                  {...chartAnimation}
                />
              </LineChart>
          </ResponsiveChart>
        </InteractiveChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InteractiveChartCard
          title={t("charts.population.birthsDeaths.title")}
          subtitle={t("charts.population.birthsDeaths.subtitle")}
          yearRange={yearRange}
          onYearRangeChange={setYearRange}
          series={[
            { key: "births", label: t("charts.population.birthsDeaths.births"), color: CHART_COLORS.birth },
            { key: "deaths", label: t("charts.population.birthsDeaths.deaths"), color: CHART_COLORS.death },
          ]}
          hiddenSeries={hiddenBirthDeath}
          onSeriesToggle={(k) => setHiddenBirthDeath((p) => toggleSet(p, k))}
          footer={
            <ChartFocusPanel
              year={focusYear}
              stats={
                bdFocus
                  ? [
                      {
                        label: t("charts.population.birthsDeaths.births"),
                        value: formatNumber(bdFocus.births),
                        delta: bdPrev ? pctDelta(bdFocus.births, bdPrev.births) : undefined,
                      },
                      {
                        label: t("charts.population.birthsDeaths.deaths"),
                        value: formatNumber(bdFocus.deaths),
                        delta: bdPrev ? pctDelta(bdFocus.deaths, bdPrev.deaths) : undefined,
                        tone: "up",
                      },
                      {
                        label: t("charts.population.birthsDeaths.naturalChange"),
                        value: formatNumber(bdFocus.naturalChange),
                        tone: bdFocus.naturalChange < 0 ? "down" : "up",
                      },
                    ]
                  : []
              }
            />
          }
        >
          <ResponsiveChart size="lg">
              <BarChart data={birthsDeaths} margin={chartMargin} {...chartEvents}>
                <CartesianGrid {...gridStyle} vertical={false} />
                <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis
                  tick={axisStyle}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatNumber(v)}
                  width={45}
                />
                <Tooltip cursor={cursorStyle} content={<CustomTooltip />} />
                {!hiddenBirthDeath.has("births") && (
                  <Bar
                    dataKey="births"
                    name="Births"
                    fill={CHART_COLORS.birth}
                    radius={[3, 3, 0, 0]}
                    maxBarSize={18}
                    {...chartAnimation}
                  >
                    {birthsDeaths.map((entry) => (
                      <Cell
                        key={entry.year}
                        fillOpacity={focusYear === null || focusYear === entry.year ? 1 : 0.35}
                      />
                    ))}
                  </Bar>
                )}
                {!hiddenBirthDeath.has("deaths") && (
                  <Bar
                    dataKey="deaths"
                    name="Deaths"
                    fill={CHART_COLORS.death}
                    radius={[3, 3, 0, 0]}
                    maxBarSize={18}
                    {...chartAnimation}
                  >
                    {birthsDeaths.map((entry) => (
                      <Cell
                        key={entry.year}
                        fillOpacity={focusYear === null || focusYear === entry.year ? 1 : 0.35}
                      />
                    ))}
                  </Bar>
                )}
              </BarChart>
          </ResponsiveChart>
        </InteractiveChartCard>

        <InteractiveChartCard
          title={t("charts.population.migration.title")}
          subtitle={t("charts.population.migration.subtitle")}
          yearRange={yearRange}
          onYearRangeChange={setYearRange}
          footer={
            <>
              <button
                type="button"
                onClick={() => setShowNetMigration((v) => !v)}
                className={`mb-3 text-[11px] font-medium px-2.5 py-1 rounded-md border transition-colors ${
                  showNetMigration
                    ? "bg-accent-muted text-accent border-accent/30"
                    : "bg-canvas text-ink-muted border-border"
                }`}
              >
                {showNetMigration ? "Showing net migration" : "Show net migration line"}
              </button>
              <ChartFocusPanel
                year={focusYear}
                stats={
                  findByYear(data.migration, focusYear)
                    ? [
                        {
                          label: t("charts.population.migration.in"),
                          value: formatNumber(findByYear(data.migration, focusYear)!.migrationIn),
                        },
                        {
                          label: t("charts.population.migration.out"),
                          value: formatNumber(findByYear(data.migration, focusYear)!.migrationOut),
                        },
                        {
                          label: t("charts.population.migration.net"),
                          value: formatNumber(findByYear(data.migration, focusYear)!.netMigration),
                          tone:
                            findByYear(data.migration, focusYear)!.netMigration > 0
                              ? "up"
                              : "down",
                        },
                      ]
                    : []
                }
              />
            </>
          }
        >
          <ResponsiveChart size="lg">
              <ComposedChart data={migration} margin={chartMargin} {...chartEvents}>
                <CartesianGrid {...gridStyle} vertical={false} />
                <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis
                  tick={axisStyle}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatNumber(v)}
                  width={48}
                />
                <Tooltip cursor={cursorStyle} content={<CustomTooltip />} />
                <Bar
                  dataKey="migrationIn"
                  name="Migration In"
                  fill={CHART_COLORS.migrationIn}
                  radius={[3, 3, 0, 0]}
                  maxBarSize={16}
                  {...chartAnimation}
                >
                  {migration.map((entry) => (
                    <Cell
                      key={`in-${entry.year}`}
                      fillOpacity={focusYear === null || focusYear === entry.year ? 1 : 0.35}
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="migrationOut"
                  name="Migration Out"
                  fill={CHART_COLORS.migrationOut}
                  radius={[3, 3, 0, 0]}
                  maxBarSize={16}
                  {...chartAnimation}
                >
                  {migration.map((entry) => (
                    <Cell
                      key={`out-${entry.year}`}
                      fillOpacity={focusYear === null || focusYear === entry.year ? 1 : 0.35}
                    />
                  ))}
                </Bar>
                {showNetMigration && (
                  <Line
                    type="monotone"
                    dataKey="netMigration"
                    name="Net Migration"
                    stroke={CHART_COLORS.migrationNet}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={activeDotStyle}
                  />
                )}
              </ComposedChart>
          </ResponsiveChart>
        </InteractiveChartCard>
      </div>
    </div>
  );
}
