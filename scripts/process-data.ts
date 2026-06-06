/**
 * Data processing pipeline for KISS-MD → dashboard.json
 *
 * Usage:
 *   1. Place raw CSV/JSON exports from KISS-MD in /data/raw/
 *   2. Run: npm run process-data
 *   3. Output is written to /src/data/dashboard.json
 *
 * This script is a scaffold. Extend the transformers below
 * when real KISS-MD dataset files are available.
 */

import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const RAW_DIR = join(__dirname, "../data/raw");
const OUTPUT_PATH = join(__dirname, "../src/data/dashboard.json");

interface RawPopulationRow {
  year: number;
  population: number;
  births: number;
  deaths: number;
  migration_in: number;
  migration_out: number;
  average_age: number;
}

interface RawEmergencyRow {
  year: number;
  total: number;
  medical_vehicles: number;
  rescue_transport: number;
  ambulances: number;
  helicopter: number;
}

interface RawHealthcareRow {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  district: string;
  specialty?: string;
}

function loadRawJson<T>(filename: string): T[] {
  const path = join(RAW_DIR, filename);
  if (!existsSync(path)) {
    console.warn(`⚠ Raw file not found: ${filename} — skipping`);
    return [];
  }
  return JSON.parse(readFileSync(path, "utf-8")) as T[];
}

function transformPopulation(rows: RawPopulationRow[]) {
  return {
    growth: rows.map((r) => ({ year: r.year, value: r.population })),
    birthsDeaths: rows.map((r) => ({
      year: r.year,
      births: r.births,
      deaths: r.deaths,
      naturalChange: r.births - r.deaths,
    })),
    migration: rows.map((r) => ({
      year: r.year,
      migrationIn: r.migration_in,
      migrationOut: r.migration_out,
      netMigration: r.migration_in - r.migration_out,
    })),
    averageAge: rows.map((r) => ({ year: r.year, value: r.average_age })),
  };
}

function transformEmergency(rows: RawEmergencyRow[]) {
  const latest = rows[rows.length - 1];
  return {
    timeline: rows.map((r) => ({
      year: r.year,
      total: r.total,
      medicalVehicles: r.medical_vehicles,
      rescueTransport: r.rescue_transport,
      ambulances: r.ambulances,
      helicopter: r.helicopter,
    })),
    latestBreakdown: latest
      ? [
          { label: "Emergency Medical Vehicles", value: latest.medical_vehicles, color: "#2D4A3E" },
          { label: "Rescue Transport", value: latest.rescue_transport, color: "#3D6B8E" },
          { label: "Ambulances", value: latest.ambulances, color: "#5C6B4A" },
          { label: "Rescue Helicopter", value: latest.helicopter, color: "#A65D2E" },
        ]
      : [],
  };
}

function transformHealthcare(rows: RawHealthcareRow[]) {
  const districtMap = new Map<string, { doctors: number; pharmacies: number; facilities: number; population: number }>();

  for (const row of rows) {
    const existing = districtMap.get(row.district) ?? { doctors: 0, pharmacies: 0, facilities: 0, population: 0 };
    if (row.type === "doctor") existing.doctors++;
    else if (row.type === "pharmacy") existing.pharmacies++;
    else if (row.type === "facility") existing.facilities++;
    districtMap.set(row.district, existing);
  }

  return {
    facilities: rows.map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type as "doctor" | "pharmacy" | "facility",
      lat: r.lat,
      lng: r.lng,
      district: r.district,
      specialty: r.specialty,
    })),
    districtSummary: Array.from(districtMap.entries()).map(([district, counts]) => ({
      district,
      ...counts,
      population: 0,
      ratioPer1000: 0,
    })),
  };
}

function main() {
  console.log("Processing KISS-MD raw data…\n");

  const population = loadRawJson<RawPopulationRow>("population.json");
  const emergency = loadRawJson<RawEmergencyRow>("emergency.json");
  const healthcare = loadRawJson<RawHealthcareRow>("healthcare.json");

  if (population.length === 0 && emergency.length === 0 && healthcare.length === 0) {
    console.log("No raw data files found in data/raw/.");
    console.log("Using existing src/data/dashboard.json as-is.");
    console.log("\nTo process real data, add:");
    console.log("  data/raw/population.json");
    console.log("  data/raw/emergency.json");
    console.log("  data/raw/healthcare.json");
    return;
  }

  const dashboard = {
    meta: {
      city: "Magdeburg",
      dataSource: "KISS-MD Open Data (Stadt Magdeburg)",
      lastUpdated: new Date().toISOString().split("T")[0],
      yearRange: [
        population[0]?.year ?? 2010,
        population[population.length - 1]?.year ?? 2024,
      ] as [number, number],
    },
    overview: [],
    population: transformPopulation(population),
    emergency: transformEmergency(emergency),
    healthcare: transformHealthcare(healthcare),
    insights: { correlations: [], highlights: [], combinedTimeline: [] },
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(dashboard, null, 2));
  console.log(`✓ Written to ${OUTPUT_PATH}`);
}

main();
