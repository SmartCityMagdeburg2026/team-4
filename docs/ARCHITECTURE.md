# MAGmagdeburg — Architecture & Implementation Plan

## Hosting Recommendation

### Is a backend required?

**No.** This dashboard is a read-only analytical narrative. All data comes from pre-processed KISS-MD open datasets. There is no user authentication, no form submissions, no real-time feeds, and no server-side computation at request time.

### Is static JSON enough?

**Yes.** The recommended architecture:

1. Export CSV/JSON from KISS-MD (Stadt Magdeburg open data portal)
2. Transform once via `scripts/process-data.ts` → `src/data/dashboard.json`
3. Next.js imports JSON at build time (SSG)
4. Deploy static output to Vercel

Total data size is < 100 KB. No database, no API layer, no caching infrastructure needed.

### Recommended: Option A

| Layer | Technology | Role |
|-------|-----------|------|
| Frontend | Next.js 15 (App Router) | SSG single-page dashboard |
| Data | Static JSON | Pre-processed KISS-MD datasets |
| Maps | Leaflet + CartoDB tiles | Healthcare facility layers |
| Charts | Recharts | Population, emergency, insight charts |
| Hosting | Vercel | Zero-config Next.js deployment |
| CI | GitHub Actions (optional) | Lint + build on push |

**Why not Option B (FastAPI + database)?**

A backend adds complexity with no benefit for this use case. It would only be justified if:
- Data must be fetched live from KISS-MD APIs on every page load
- Users need to filter/query datasets dynamically beyond client-side operations
- Multiple dashboards share a centralized data pipeline with frequent updates

For a quarterly-updated editorial dashboard, a build-time data refresh is simpler, cheaper, and faster.

---

## 1. Wireframe Structure

```
┌─────────────────────────────────────────────────────────┐
│  HEADER — Logo, nav anchors (Overview → Insights)       │
├─────────────────────────────────────────────────────────┤
│  HERO — Central question as editorial headline          │
├─────────────────────────────────────────────────────────┤
│  §1 OVERVIEW — 6 KPI cards (2×3 grid)                  │
├─────────────────────────────────────────────────────────┤
│  NARRATIVE BRIDGE — Italic transition sentence          │
├─────────────────────────────────────────────────────────┤
│  §2 POPULATION — 2×2 chart grid                        │
│    [Population Growth]  [Average Age]                   │
│    [Births vs Deaths]   [Migration In/Out]              │
├─────────────────────────────────────────────────────────┤
│  NARRATIVE BRIDGE                                       │
├─────────────────────────────────────────────────────────┤
│  §3 EMERGENCY — Full-width trend + 2-column breakdown  │
│    [Incidents Over Time — full width]                   │
│    [Vehicle Breakdown]  [Stacked Vehicle Trends]        │
├─────────────────────────────────────────────────────────┤
│  NARRATIVE BRIDGE                                       │
├─────────────────────────────────────────────────────────┤
│  §4 HEALTHCARE — Map centerpiece + district density      │
│    [Interactive Leaflet Map — layer toggles]            │
│    [4 lowest-access district cards]                     │
│    [District density bar chart]                         │
├─────────────────────────────────────────────────────────┤
│  NARRATIVE BRIDGE                                       │
├─────────────────────────────────────────────────────────┤
│  §5 INSIGHTS — Analytical synthesis                     │
│    [4 insight highlight cards — 2×2]                      │
│    [Combined timeline chart — age + emergency + doctors]│
│    [3 correlation cards with r-values]                  │
├─────────────────────────────────────────────────────────┤
│  FOOTER — Data source, last updated                     │
└─────────────────────────────────────────────────────────┘
```

**Narrative flow:** Each section is separated by a `NarrativeBridge` component — a single italic sentence that connects the previous section's conclusion to the next section's premise.

---

## 2. Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `canvas` | `#F7F5F2` | Page background (warm off-white) |
| `surface` | `#FFFFFF` | Card backgrounds |
| `ink` | `#181614` | Primary text |
| `ink-muted` | `#6E6A65` | Secondary text, labels |
| `ink-faint` | `#9C9890` | Tertiary text, metadata |
| `border` | `#E5E1DB` | Card borders, dividers |
| `accent` | `#2D4A3E` | Primary accent (deep forest green) |
| `signal-birth` | `#3D6B8E` | Births, positive migration |
| `signal-death` | `#8B4A42` | Deaths, negative trends |
| `signal-emergency` | `#A65D2E` | Emergency data highlights |

No gradients on cards. No neon. No smart-city blue.

### Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Hero headline | Newsreader (serif) | 400 | 48–60px |
| Section titles | Newsreader (serif) | 400 | 32–40px |
| KPI values | Newsreader (serif) | 400 | 32–40px |
| Body / labels | IBM Plex Sans | 400–600 | 12–18px |
| Eyebrows | IBM Plex Sans | 500 | 12px, uppercase, tracked |

### Spacing & Cards

- Section padding: `py-16 md:py-24`
- Card padding: `p-6 md:p-8`
- Card style: `border border-border rounded-lg shadow-card`
- Grid gaps: `gap-4 md:gap-6`
- Max content width: `max-w-6xl` (1152px)

### Charts

- Minimal gridlines (horizontal only, dashed)
- No vertical axis lines
- Consistent 2px stroke width for lines
- Area fills at 12–15% opacity
- Tooltip: dark background, small type
- Color assignment via `src/lib/chart-theme.ts`

### Animation

- `fade-in` on section headers (0.6s ease-out)
- `slide-up` on KPI cards (staggered 80ms delay)
- Bar width transitions on district density (0.5s)
- No scroll-triggered animations, no parallax

---

## 3. Component Architecture

```
src/
├── app/
│   ├── layout.tsx          # Fonts, metadata, global shell
│   ├── page.tsx            # Single page — assembles all sections
│   └── globals.css         # Tailwind + design tokens
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Sticky nav with section anchors
│   │   ├── Section.tsx     # Reusable section wrapper (eyebrow + title + lead)
│   │   └── Footer.tsx      # Data source attribution
│   ├── overview/
│   │   ├── Hero.tsx        # Editorial headline
│   │   └── KpiGrid.tsx     # 6 metric cards
│   ├── population/
│   │   └── PopulationSection.tsx  # 4 charts (client component)
│   ├── emergency/
│   │   └── EmergencySection.tsx   # 3 charts (client component)
│   ├── healthcare/
│   │   ├── HealthcareMap.tsx      # Layer toggles + district cards
│   │   └── MapContainer.tsx       # Leaflet map (dynamic import, no SSR)
│   ├── insights/
│   │   └── InsightsSection.tsx    # Highlights + combined chart + correlations
│   ├── narrative/
│   │   └── NarrativeBridge.tsx    # Section transition sentences
│   └── ui/
│       ├── ChartCard.tsx          # Chart wrapper with title/subtitle
│       └── CustomTooltip.tsx      # Shared Recharts tooltip
├── data/
│   └── dashboard.json      # Processed dashboard data (build-time import)
├── lib/
│   ├── types.ts            # TypeScript interfaces for all data shapes
│   ├── data.ts             # Data loader + formatters
│   └── chart-theme.ts      # Shared chart colors and axis styles
└── scripts/
    └── process-data.ts     # KISS-MD raw → dashboard.json pipeline
```

**Component rules:**
- Server components by default (`page.tsx`, layout, Hero, KPI, bridges)
- Client components only where needed (`"use client"` for Recharts, Leaflet, interactive toggles)
- Leaflet loaded via `next/dynamic` with `ssr: false`
- No global state management — props flow from `getDashboardData()` in `page.tsx`

---

## 4. Data Architecture

### Source → Transform → Consume

```
KISS-MD Portal (CSV/JSON exports)
        │
        ▼
data/raw/
  ├── population.json     # Yearly demographics
  ├── emergency.json      # Rettungsdienst deployments
  └── healthcare.json     # Facility geolocations
        │
        ▼  npm run process-data
src/data/dashboard.json   # Unified typed dataset
        │
        ▼  import at build time
src/lib/data.ts           # getDashboardData()
        │
        ▼  props
page.tsx → Section components → Charts / Map
```

### Data Schema

See `src/lib/types.ts` for full TypeScript definitions. Top-level shape:

```typescript
DashboardData {
  meta: { city, dataSource, lastUpdated, yearRange }
  overview: KpiMetric[]           // 6 headline metrics
  population: {
    growth: TimeSeriesPoint[]
    birthsDeaths: BirthDeathPoint[]
    migration: MigrationPoint[]
    averageAge: TimeSeriesPoint[]
  }
  emergency: {
    timeline: EmergencyPoint[]
    latestBreakdown: { label, value, color }[]
  }
  healthcare: {
    facilities: HealthcareFacility[]   // lat/lng for map markers
    districtSummary: DistrictStats[]   // per-district density
  }
  insights: {
    correlations: InsightCorrelation[]
    highlights: InsightHighlight[]
    combinedTimeline: CombinedPoint[]  // multi-metric time series
  }
}
```

### Update Cadence

1. Download new KISS-MD exports (quarterly or annually)
2. Place in `data/raw/`
3. Run `npm run process-data`
4. Commit updated `dashboard.json`
5. Vercel auto-deploys on push

---

## 5. Implementation Plan

### Phase 1 — Foundation (Complete)
- [x] Next.js + TypeScript + Tailwind scaffold
- [x] Design system tokens in `tailwind.config.ts`
- [x] Data types and static JSON with representative Magdeburg data
- [x] Layout components (Header, Section, Footer, Hero)

### Phase 2 — Visualizations (Complete)
- [x] KPI overview grid
- [x] Population charts (growth, age, births/deaths, migration)
- [x] Emergency charts (timeline, breakdown, stacked vehicles)
- [x] Healthcare map with Leaflet layer toggles
- [x] Insights section (highlights, combined chart, correlations)

### Phase 3 — Data Pipeline
- [ ] Obtain real KISS-MD dataset exports
- [ ] Map raw CSV columns to `data/raw/*.json` schema
- [ ] Extend `process-data.ts` with CSV parsing
- [ ] Compute insights (correlations) from real data
- [ ] Validate geolocation accuracy for healthcare facilities

### Phase 4 — Production
- [ ] `npm run build` verification
- [ ] Lighthouse performance audit (target: 90+)
- [ ] Deploy to Vercel
- [ ] Configure custom domain (optional)

### Phase 5 — Enhancement (Optional)
- [ ] DE/EN language toggle
- [ ] Print-friendly stylesheet
- [ ] Embed mode for iframe integration
- [ ] Automated KISS-MD data refresh via GitHub Action

---

## 6. Deployment

```bash
# Local development
npm install
npm run dev

# Production build
npm run build
npm start

# Deploy to Vercel
vercel --prod
```

No environment variables required for the current static architecture. If Mapbox is preferred over Leaflet in the future, add `NEXT_PUBLIC_MAPBOX_TOKEN` to Vercel environment settings.
