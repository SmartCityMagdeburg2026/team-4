# MAGmagdeburg — Healthcare & Population Intelligence

A premium, editorial-style dashboard answering: **How are demographic changes affecting healthcare demand in Magdeburg?**

Built with Next.js, TypeScript, Tailwind CSS, Recharts, and Leaflet. Data sourced from KISS-MD (Stadt Magdeburg open data).

## Quick Start

Node.js is not required globally. The project can bootstrap its own toolchain:

```bash
./scripts/setup.sh   # downloads Node + npm to .tools/, installs dependencies
./scripts/dev.sh     # starts the dev server
```

Open [http://localhost:3000](http://localhost:3000).

If you already have `npm` on your PATH:

```bash
npm install
npm run dev
```

## Architecture

This is a **static, backend-free** application:

- Data is pre-processed from KISS-MD exports into `src/data/dashboard.json`
- Next.js serves the page via Static Site Generation
- No API, no database, no environment variables required
- Deploy to Vercel with zero configuration

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full wireframe, design system, component map, data pipeline, and implementation plan.

## Data Updates

KISS-MD Excel files live in `Data Source/KISS-MD/`. The pipeline reads:

| Dashboard section | KISS-MD source |
|---|---|
| Population | `Bevölkerung/Bevölkerungsentwicklung/` |
| Births & deaths | `Bevölkerung/Bevölkerungsbewegung/Natürliche Bewegungen…` |
| Migration | `Bevölkerung/Bevölkerungsbewegung/Wanderungsbewegungen…` |
| Emergency | `Gesundheit und Soziales/Rettungsdienst/Rettungsdienst Einsätze.xlsx` |
| Physicians & pharmacies | `Gesundheit und Soziales/Ärzte, Zahnärzte/…/Ärzte und Apotheken.xlsx` |
| District population | `Bevölkerung/Bevölkerung nach Stadtteilen/Entwicklung der Hauptwohnsitzbevölkerung .xlsx` |

```bash
npm run process-data
# or: python3 scripts/process-kissmd.py
```

This regenerates `src/data/dashboard.json` from the Excel files.

## Project Structure

```
src/
├── app/              # Next.js App Router (layout, page, styles)
├── components/       # Section components organized by narrative block
├── data/             # Processed dashboard JSON
├── lib/              # Types, data loaders, chart theme
scripts/
└── process-data.ts   # KISS-MD → dashboard.json transformer
docs/
└── ARCHITECTURE.md   # Full architecture documentation
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Maps | Leaflet + react-leaflet |
| Hosting | Vercel (recommended) |

## License

Internal project — IBM MAG Magdeburg.
