#!/usr/bin/env python3
"""
Transform KISS-MD Excel datasets → src/data/dashboard.json

Usage: python3 scripts/process-kissmd.py
"""

from __future__ import annotations

import json
import math
from datetime import date
from pathlib import Path

import pandas as pd

from districts import DISTRICT_CENTROIDS, DISTRICT_NAMES, KNOWN_FACILITIES

ROOT = Path(__file__).resolve().parent.parent
KISSMD = ROOT / "Data Source" / "KISS-MD"
OV_STOPS = (
    ROOT
    / "Data Source"
    / "ÖV-Daten_NASA_GmbH"
    / "Haltestellen"
    / "ST"
    / "20260508_ST-MDV_nasa.csv"
)
OUTPUT = ROOT / "src" / "data" / "dashboard.json"
BUS_STOP_RADIUS_KM = 1.2

CHART_COLORS = {
    "medical": "#2D4A3E",
    "transport": "#3D6B8E",
    "ambulance": "#5C6B4A",
    "helicopter": "#A65D2E",
}


def read_xlsx(relative: str) -> pd.DataFrame:
    path = KISSMD / relative
    if not path.exists():
        raise FileNotFoundError(f"Missing dataset: {path}")
    return pd.read_excel(path, header=None)


MIN_DISTRICT_POPULATION = 1000


def pct_change(current: float, previous: float) -> float:
    if previous == 0:
        return 0.0
    return round(((current - previous) / previous) * 100, 1)


def load_population() -> pd.DataFrame:
    df = read_xlsx(
        "Bevölkerung/Bevölkerungsentwicklung/Fläche, Einwohner und Bevölkerungsdichte in ausgewählten Jahren.xlsx"
    ).iloc[1:]
    df.columns = ["year", "area", "population", "male", "female", "density", "table"]
    df["year"] = pd.to_numeric(df["year"], errors="coerce")
    df["population"] = pd.to_numeric(df["population"], errors="coerce")
    return df.dropna(subset=["year", "population"]).astype({"year": int})


def load_average_age() -> pd.DataFrame:
    df = read_xlsx("Bevölkerung/Bevölkerungsentwicklung/Altersdurchschnitt .xlsx").iloc[1:]
    df.columns = ["year", "population", "average_age", "table"]
    df["year"] = pd.to_numeric(df["year"], errors="coerce")
    df["average_age"] = pd.to_numeric(df["average_age"], errors="coerce")
    return df.dropna(subset=["year", "average_age"]).astype({"year": int})


def load_births_deaths() -> pd.DataFrame:
    df = read_xlsx(
        "Bevölkerung/Bevölkerungsbewegung/Natürliche Bewegungen der Hauptwohnsitzbevölkerung.xlsx"
    ).iloc[1:]
    df.columns = [
        "year", "births_legit", "births_other", "_b_pct",
        "deaths", "infant_deaths", "_d_pct", "marriages", "_m1", "_m_pct", "table",
    ]
    for col in ["year", "births_legit", "births_other", "deaths"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df["births"] = df["births_legit"] + df["births_other"]
    df["natural_change"] = df["births"] - df["deaths"]
    return df.dropna(subset=["year"]).astype({"year": int})


def load_migration() -> pd.DataFrame:
    df = read_xlsx(
        "Bevölkerung/Bevölkerungsbewegung/Wanderungsbewegungen nach Geschlecht.xlsx"
    ).iloc[1:]
    df.columns = [
        "year", "migration_in", "in_male", "in_female",
        "migration_out", "out_male", "out_female",
        "net_migration", "net_male", "net_female", "table",
    ]
    for col in ["year", "migration_in", "migration_out", "net_migration"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    return df.dropna(subset=["year"]).astype({"year": int})


def load_emergency() -> pd.DataFrame:
    df = read_xlsx("Gesundheit und Soziales/Rettungsdienst/Rettungsdienst Einsätze.xlsx").iloc[1:]
    df.columns = [
        "year", "month", "total", "notarzt", "krankentransport",
        "rettung", "luftrettung", "table",
    ]
    for col in ["year", "total", "notarzt", "krankentransport", "rettung", "luftrettung"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    return (
        df.dropna(subset=["year", "total"])
        .groupby("year", as_index=False)
        .agg({
            "total": "sum",
            "notarzt": "sum",
            "krankentransport": "sum",
            "rettung": "sum",
            "luftrettung": "sum",
        })
        .astype({"year": int})
    )


def load_doctors_by_district() -> pd.DataFrame:
    df = read_xlsx(
        "Gesundheit und Soziales/Ärzte, Zahnärzte/Kieferorthopäden/Ärzte und Apotheken.xlsx"
    ).iloc[1:]
    df.columns = ["year", "district_code", "doctors", "dentists", "pharmacies", "table"]
    for col in ["year", "doctors", "pharmacies"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df["district_code"] = df["district_code"].astype(str).str.zfill(2)
    return df.dropna(subset=["year"])


def load_district_indicators() -> pd.DataFrame:
    df = read_xlsx(
        "Bevölkerung/Bevölkerung nach Stadtteilen/Hauptwohnsitzbevölkerung nach ausgewählten Indikatoren.xlsx"
    ).iloc[1:]
    df.columns = [
        "year", "district_code", "population", "male", "elderly", "elderly_pct",
        "migration_pct", "youth_pct", "avg_age1", "avg_age2", "table",
    ]
    df["year"] = pd.to_numeric(df["year"], errors="coerce")
    df["district_code"] = df["district_code"].astype(str).str.zfill(2)
    df["population"] = pd.to_numeric(df["population"], errors="coerce")
    df["elderly_pct"] = pd.to_numeric(df["elderly_pct"], errors="coerce")
    return df.dropna(subset=["year", "population"])


def load_district_population() -> pd.DataFrame:
    df = read_xlsx(
        "Bevölkerung/Bevölkerung nach Stadtteilen/Entwicklung der Hauptwohnsitzbevölkerung .xlsx"
    ).iloc[1:]
    df.columns = ["year", "district_code", "population", "table"]
    df["year"] = pd.to_numeric(df["year"], errors="coerce")
    df["population"] = pd.to_numeric(df["population"], errors="coerce")
    df["district_code"] = df["district_code"].astype(str)
    # Exclude city total row
    df = df[~df["district_code"].str.startswith("150")]
    df["district_code"] = df["district_code"].str.zfill(2)
    return df.dropna(subset=["year", "population"]).astype({"year": int})


def filter_years(df: pd.DataFrame, start: int = 2010, end: int | None = None) -> pd.DataFrame:
    out = df[df["year"] >= start].copy()
    if end is not None:
        out = out[out["year"] <= end]
    return out.sort_values("year").reset_index(drop=True)


def build_overview(
    population: pd.DataFrame,
    births_deaths: pd.DataFrame,
    emergency: pd.DataFrame,
    doctors: pd.DataFrame,
) -> list[dict]:
    latest_year = int(population["year"].max())
    prev_year = latest_year - 1

    pop_latest = int(population.loc[population["year"] == latest_year, "population"].iloc[0])
    pop_prev = int(population.loc[population["year"] == prev_year, "population"].iloc[0]) if prev_year in population["year"].values else pop_latest

    bd_latest = births_deaths[births_deaths["year"] == latest_year].iloc[0]
    bd_prev = births_deaths[births_deaths["year"] == prev_year].iloc[0] if prev_year in births_deaths["year"].values else bd_latest

    em_latest = emergency[emergency["year"] == latest_year]
    em_prev = emergency[emergency["year"] == prev_year]
    em_total = int(em_latest["total"].iloc[0]) if len(em_latest) else 0
    em_total_prev = int(em_prev["total"].iloc[0]) if len(em_prev) else em_total

    doc_year = int(doctors["year"].max())
    doc_latest = doctors[doctors["year"] == doc_year]
    doc_prev = doctors[doctors["year"] == doc_year - 1] if (doc_year - 1) in doctors["year"].values else doc_latest

    total_doctors = int(doc_latest["doctors"].sum())
    total_doctors_prev = int(doc_prev["doctors"].sum())
    total_pharmacies = int(doc_latest["pharmacies"].sum())
    total_pharmacies_prev = int(doc_prev["pharmacies"].sum())

    return [
        {
            "id": "population",
            "label": "Total Population",
            "value": pop_latest,
            "change": pct_change(pop_latest, pop_prev),
            "changeLabel": f"vs. {prev_year}",
            "format": "number",
        },
        {
            "id": "births",
            "label": "Births",
            "value": int(bd_latest["births"]),
            "change": pct_change(bd_latest["births"], bd_prev["births"]),
            "changeLabel": f"vs. {prev_year}",
            "format": "number",
        },
        {
            "id": "deaths",
            "label": "Deaths",
            "value": int(bd_latest["deaths"]),
            "change": pct_change(bd_latest["deaths"], bd_prev["deaths"]),
            "changeLabel": f"vs. {prev_year}",
            "format": "number",
        },
        {
            "id": "emergency",
            "label": "Emergency Incidents",
            "value": em_total,
            "change": pct_change(em_total, em_total_prev),
            "changeLabel": f"vs. {prev_year}",
            "format": "number",
        },
        {
            "id": "doctors",
            "label": "Physicians",
            "value": total_doctors,
            "change": pct_change(total_doctors, total_doctors_prev),
            "changeLabel": f"vs. {doc_year - 1}",
            "format": "number",
        },
        {
            "id": "pharmacies",
            "label": "Pharmacies",
            "value": total_pharmacies,
            "change": pct_change(total_pharmacies, total_pharmacies_prev),
            "changeLabel": f"vs. {doc_year - 1}",
            "format": "number",
        },
    ]


def build_healthcare(
    doctors: pd.DataFrame,
    district_pop: pd.DataFrame,
    district_indicators: pd.DataFrame,
) -> dict:
    doc_year = int(doctors["year"].max())
    pop_year = int(district_pop["year"].max())
    ind_year = int(district_indicators["year"].max())

    doc_district = doctors[doctors["year"] == doc_year].copy()
    pop_district = district_pop[district_pop["year"] == pop_year].copy()
    ind_district = district_indicators[district_indicators["year"] == ind_year].copy()

    merged = doc_district.merge(pop_district, on="district_code", how="left")
    merged = merged.merge(
        ind_district[["district_code", "elderly_pct"]],
        on="district_code",
        how="left",
    )
    merged["district"] = merged["district_code"].map(DISTRICT_NAMES).fillna(
        merged["district_code"]
    )
    merged["population"] = merged["population"].fillna(0).astype(int)
    merged["elderly_pct"] = merged["elderly_pct"].fillna(0)
    merged["physician_data_available"] = (merged["doctors"] > 0) & (
        merged["population"] >= MIN_DISTRICT_POPULATION
    )
    merged["ratio_per_1000"] = merged.apply(
        lambda r: round(r["doctors"] / r["population"] * 1000, 2)
        if r["physician_data_available"]
        else None,
        axis=1,
    )

    excluded = 0
    district_summary = []
    for _, row in merged.iterrows():
        if row["population"] < MIN_DISTRICT_POPULATION:
            continue
        if not row["physician_data_available"]:
            excluded += 1
            continue
        district_summary.append({
            "district": row["district"],
            "districtCode": row["district_code"],
            "doctors": int(row["doctors"]),
            "pharmacies": int(row["pharmacies"]),
            "facilities": 0,
            "population": int(row["population"]),
            "ratioPer1000": row["ratio_per_1000"],
            "elderlyPct": round(float(row["elderly_pct"]), 1),
            "physicianDataAvailable": True,
        })

    facility_districts = {f["district"] for f in KNOWN_FACILITIES}
    for entry in district_summary:
        if entry["district"] in facility_districts:
            entry["facilities"] = sum(
                1 for f in KNOWN_FACILITIES if f["district"] == entry["district"]
            )

    facilities: list[dict] = []
    for f in KNOWN_FACILITIES:
        facilities.append({**f, "districtCode": next(
            (e["districtCode"] for e in district_summary if e["district"] == f["district"]),
            "",
        )})

    for entry in district_summary:
        code = entry["districtCode"]
        name = entry["district"]
        if code not in DISTRICT_CENTROIDS:
            continue
        lat, lng = DISTRICT_CENTROIDS[code]

        facilities.append({
            "id": f"doc-{code}-{doc_year}",
            "name": f"{name} — {entry['doctors']} physicians",
            "type": "doctor",
            "lat": lat,
            "lng": lng,
            "district": name,
            "districtCode": code,
            "specialty": "District aggregate (KISS-MD)",
        })

        if entry["pharmacies"] > 0:
            facilities.append({
                "id": f"pha-{code}-{doc_year}",
                "name": f"{name} — {entry['pharmacies']} pharmacies",
                "type": "pharmacy",
                "lat": lat + 0.002,
                "lng": lng + 0.002,
                "district": name,
                "districtCode": code,
            })

    note = (
        f"{excluded} districts with fewer than 1,000 residents or no physician "
        "registrations in KISS-MD are excluded from access rankings."
        if excluded
        else "All qualifying districts have physician data in KISS-MD."
    )

    return {
        "facilities": facilities,
        "districtSummary": district_summary,
        "excludedDistrictsNote": note,
    }


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def load_magdeburg_bus_stops() -> list[tuple[float, float]]:
    if not OV_STOPS.exists():
        return []
    df = pd.read_csv(OV_STOPS, sep=";", dtype=str)
    df = df[df["Gemeinde"] == "Magdeburg"].copy()
    stops: list[tuple[float, float]] = []
    for _, row in df.iterrows():
        try:
            lng = float(str(row["X-Koordinate"]).replace(",", "."))
            lat = float(str(row["Y-Koordinate"]).replace(",", "."))
        except (TypeError, ValueError):
            continue
        stops.append((lat, lng))
    return stops


def count_nearby_stops(
    lat: float, lng: float, stops: list[tuple[float, float]], radius_km: float
) -> int:
    return sum(1 for slat, slng in stops if haversine_km(lat, lng, slat, slng) <= radius_km)


def lens_tertile_level(
    value: float, values: list[float], *, higher_is_worse: bool
) -> str:
    if not values:
        return "medium"
    sorted_vals = sorted(values)
    n = len(sorted_vals)
    t1 = sorted_vals[max(0, n // 3 - 1)]
    t2 = sorted_vals[max(0, (2 * n) // 3 - 1)]
    if higher_is_worse:
        if value >= t2:
            return "weak"
        if value >= t1:
            return "medium"
        return "strong"
    if value <= t1:
        return "weak"
    if value <= t2:
        return "medium"
    return "strong"


def build_access_lens(
    district_summary: list[dict], city_transport_total: int
) -> dict:
    stops = load_magdeburg_bus_stops()
    eligible = [d for d in district_summary if d.get("physicianDataAvailable")]

    weights = []
    for d in eligible:
        weight = d["population"] * (1 + d["elderlyPct"] / 100)
        weights.append(weight)
    weight_sum = sum(weights) or 1

    raw_rows = []
    for d, weight in zip(eligible, weights):
        code = d["districtCode"]
        centroid = DISTRICT_CENTROIDS.get(code)
        bus_stops = 0
        if centroid and stops:
            lat, lng = centroid
            bus_stops = count_nearby_stops(lat, lng, stops, BUS_STOP_RADIUS_KM)

        transport_demand = round(city_transport_total * (weight / weight_sum))
        transport_per_1000 = round(
            (transport_demand / d["population"] * 1000) if d["population"] else 0, 1
        )

        raw_rows.append({
            "district": d["district"],
            "districtCode": code,
            "physiciansPer1000": d["ratioPer1000"],
            "transportDemand": transport_demand,
            "transportPer1000": transport_per_1000,
            "busStopsNearby": bus_stops,
        })

    physician_vals = [r["physiciansPer1000"] for r in raw_rows]
    transport_vals = [r["transportPer1000"] for r in raw_rows]
    stop_vals = [r["busStopsNearby"] for r in raw_rows]

    districts = []
    for row in raw_rows:
        physician_level = lens_tertile_level(
            row["physiciansPer1000"], physician_vals, higher_is_worse=False
        )
        transport_level = lens_tertile_level(
            row["transportPer1000"], transport_vals, higher_is_worse=True
        )
        transit_level = lens_tertile_level(
            row["busStopsNearby"], stop_vals, higher_is_worse=False
        )
        weak_count = sum(
            1 for level in (physician_level, transport_level, transit_level) if level == "weak"
        )
        districts.append({
            **row,
            "physicianLevel": physician_level,
            "transportLevel": transport_level,
            "transitLevel": transit_level,
            "compoundGap": weak_count == 3,
            "weakLensCount": weak_count,
        })

    compound_gaps = [d["district"] for d in districts if d["compoundGap"]]

    return {
        "cityTransportTotal": city_transport_total,
        "busStopRadiusKm": BUS_STOP_RADIUS_KM,
        "magdeburgBusStops": len(stops),
        "compoundGapDistricts": compound_gaps,
        "districts": districts,
    }


def build_risk_districts(district_summary: list[dict]) -> list[dict]:
    eligible = [d for d in district_summary if d.get("physicianDataAvailable")]
    if not eligible:
        return []

    max_elderly = max(d["elderlyPct"] for d in eligible) or 1
    max_ratio = max(d["ratioPer1000"] for d in eligible) or 1
    max_pop = max(d["population"] for d in eligible) or 1

    scored = []
    for d in eligible:
        elderly_norm = d["elderlyPct"] / max_elderly
        access_norm = 1 - (d["ratioPer1000"] / max_ratio)
        pop_norm = d["population"] / max_pop
        score = round(0.45 * elderly_norm + 0.40 * access_norm + 0.15 * pop_norm, 3)

        if score >= 0.55:
            level = "High"
        elif score >= 0.32:
            level = "Medium"
        else:
            level = "Low"

        parts = []
        if d["elderlyPct"] >= 25:
            parts.append("high elderly share")
        elif d["elderlyPct"] >= 18:
            parts.append("above-average aging")
        if d["ratioPer1000"] <= 0.8:
            parts.append("low physician density")
        if d["population"] >= 15000:
            parts.append("large resident base")

        scored.append({
            "district": d["district"],
            "riskScore": score,
            "riskLevel": level,
            "elderlyPct": d["elderlyPct"],
            "physiciansPer1000": d["ratioPer1000"],
            "population": d["population"],
            "rationale": ", ".join(parts) if parts else "moderate composite risk",
        })

    scored.sort(key=lambda x: x["riskScore"], reverse=True)
    for i, item in enumerate(scored, start=1):
        item["rank"] = i

    return scored


def build_narratives(
    population: pd.DataFrame,
    avg_age: pd.DataFrame,
    births_deaths: pd.DataFrame,
    migration: pd.DataFrame,
    emergency: pd.DataFrame,
    district_summary: list[dict],
    risk_districts: list[dict],
    start_year: int,
) -> dict:
    pop_first = int(population.iloc[0]["population"])
    pop_last = int(population.iloc[-1]["population"])
    pop_delta = pop_last - pop_first
    age_last = float(avg_age.iloc[-1]["average_age"])

    em_first = int(emergency.iloc[0]["total"])
    em_last = int(emergency.iloc[-1]["total"])
    em_pct = pct_change(em_last, em_first)
    pop_pct = pct_change(pop_last, pop_first)
    em_verb = "rose" if em_pct > 0 else "fell" if em_pct < 0 else "held steady"

    with_doctors = [d for d in district_summary if d["ratioPer1000"] > 0]
    highest = max(with_doctors, key=lambda d: d["ratioPer1000"])
    lowest = min(with_doctors, key=lambda d: d["ratioPer1000"])
    ratio_multiple = round(highest["ratioPer1000"] / lowest["ratioPer1000"], 0)

    years_negative = sum(1 for _, r in births_deaths.iterrows() if r["natural_change"] < 0)
    latest_mig = int(migration.iloc[-1]["net_migration"])
    latest_year = int(migration.iloc[-1]["year"])

    top_risk = risk_districts[0]["district"] if risk_districts else "several districts"

    return {
        "population": (
            f"Population {'grew' if pop_delta > 0 else 'changed'} by {abs(pop_delta):,} residents "
            f"since {start_year} while average age remained above {age_last:.0f} years — "
            f"deaths exceeded births in {years_negative} of the last {len(births_deaths)} years."
        ),
        "emergency": (
            f"Emergency deployments {em_verb} {abs(em_pct):.0f}% since {start_year} "
            f"while population grew {pop_pct:.0f}% — "
            + (
                "demand is outpacing demographic growth."
                if em_pct > pop_pct
                else "incident volumes remain persistently high for a slowly growing city."
            )
        ),
        "healthcare": (
            f"{highest['district']} has {ratio_multiple:.0f}× more physicians per capita than "
            f"{lowest['district']} — access depends on where you live."
        ),
        "insights": (
            f"Natural population decline continues despite net migration of "
            f"+{latest_mig:,} in {latest_year}."
        ),
        "risk": (
            f"{top_risk} ranks highest for healthcare vulnerability — combining aging residents, "
            f"physician scarcity, and population scale."
        ),
    }


def build_key_findings(
    births_deaths: pd.DataFrame,
    emergency: pd.DataFrame,
    population: pd.DataFrame,
    migration: pd.DataFrame,
    district_summary: list[dict],
    start_year: int,
) -> list[dict]:
    years_negative = sum(1 for _, r in births_deaths.iterrows() if r["natural_change"] < 0)
    em_first = int(emergency.iloc[0]["total"])
    em_last = int(emergency.iloc[-1]["total"])
    pop_first = int(population.iloc[0]["population"])
    pop_last = int(population.iloc[-1]["population"])
    latest_mig = int(migration.iloc[-1]["net_migration"])

    ratios = [d["ratioPer1000"] for d in district_summary]
    ratio_spread = max(ratios) - min(ratios) if ratios else 0

    return [
        {
            "id": "finding-1",
            "title": "Deaths exceeded births every year",
            "body": (
                f"In all {years_negative} years since {start_year}, Magdeburg recorded more deaths "
                f"than births — a persistent natural population deficit."
            ),
        },
        {
            "id": "finding-2",
            "title": (
                "Emergency demand rose faster than population"
                if pct_change(em_last, em_first) > pct_change(pop_last, pop_first)
                else "Emergency demand remains high despite stable population"
            ),
            "body": (
                f"Emergency incidents increased from {em_first:,} to {em_last:,} "
                f"(+{pct_change(em_last, em_first):.0f}%) while population only grew "
                f"{pct_change(pop_last, pop_first):.0f}%."
                if pct_change(em_last, em_first) > pct_change(pop_last, pop_first)
                else (
                    f"Emergency incidents stayed near {em_last:,} per year in {int(emergency.iloc[-1]['year'])} "
                    f"despite only {pct_change(pop_last, pop_first):.0f}% population growth since {start_year}."
                )
            ),
        },
        {
            "id": "finding-3",
            "title": "Healthcare access differs sharply by district",
            "body": (
                f"Physician density spans {min(ratios):.2f} to {max(ratios):.2f} per 1,000 residents "
                f"across districts — a gap of {ratio_spread:.2f}."
            ),
        },
        {
            "id": "finding-4",
            "title": "Migration offsets population decline",
            "body": (
                f"Net migration of +{latest_mig:,} in {int(migration.iloc[-1]['year'])} keeps total "
                f"population growing, but does not reverse the underlying aging trend."
            ),
        },
    ]


def build_insights(
    avg_age: pd.DataFrame,
    emergency: pd.DataFrame,
    births_deaths: pd.DataFrame,
    migration: pd.DataFrame,
    doctors: pd.DataFrame,
    population: pd.DataFrame,
    district_summary: list[dict],
    start_year: int,
) -> dict:
    doc_yearly = doctors.groupby("year").agg({"doctors": "sum"}).reset_index()
    combined = (
        avg_age[["year", "average_age"]]
        .merge(emergency[["year", "total"]], on="year", how="inner")
        .merge(population[["year", "population"]], on="year", how="inner")
        .merge(doc_yearly, on="year", how="left")
    )
    combined = combined[combined["year"] >= start_year].sort_values("year")
    combined["doctors"] = combined["doctors"].ffill()
    combined = combined.dropna(subset=["doctors"])
    combined["doctors_per_1000"] = (combined["doctors"] / combined["population"] * 1000).round(2)

    combined_timeline = [
        {
            "year": int(r.year),
            "averageAge": round(float(r.average_age), 1),
            "emergencyIncidents": int(r.total),
            "doctorsPer1000": float(r.doctors_per_1000),
        }
        for r in combined.itertuples()
    ]

    key_findings = build_key_findings(
        births_deaths, emergency, population, migration, district_summary, start_year
    )

    return {
        "keyFindings": key_findings,
        "combinedTimeline": combined_timeline,
    }


def main() -> None:
    print("Loading KISS-MD datasets…")

    start_year = 2010

    population = filter_years(load_population(), start_year)
    avg_age = filter_years(load_average_age(), start_year)
    births_deaths = filter_years(load_births_deaths(), start_year)
    migration = filter_years(load_migration(), start_year)
    emergency_raw = filter_years(load_emergency(), start_year)

    end_year = int(population["year"].max())

    avg_age = filter_years(avg_age, start_year, end_year)
    births_deaths = filter_years(births_deaths, start_year, end_year)
    migration = filter_years(migration, start_year, end_year)
    emergency = filter_years(emergency_raw, start_year, end_year)

    doctors = load_doctors_by_district()
    district_pop = load_district_population()
    district_indicators = load_district_indicators()

    healthcare = build_healthcare(doctors, district_pop, district_indicators)
    latest_em = emergency[emergency["year"] == end_year].iloc[0]
    healthcare["accessLens"] = build_access_lens(
        healthcare["districtSummary"], int(latest_em.krankentransport)
    )
    risk_districts = build_risk_districts(healthcare["districtSummary"])
    insights = build_insights(
        avg_age, emergency, births_deaths, migration,
        doctors, population, healthcare["districtSummary"], start_year,
    )
    narratives = build_narratives(
        population, avg_age, births_deaths, migration, emergency,
        healthcare["districtSummary"], risk_districts, start_year,
    )

    dashboard = {
        "meta": {
            "city": "Magdeburg",
            "dataSource": "KISS-MD Open Data (Stadt Magdeburg)",
            "lastUpdated": date.today().isoformat(),
            "yearRange": [start_year, end_year],
        },
        "narratives": narratives,
        "overview": build_overview(population, births_deaths, emergency, doctors),
        "population": {
            "growth": [
                {"year": int(r.year), "value": int(r.population)}
                for r in population.itertuples()
            ],
            "birthsDeaths": [
                {
                    "year": int(r.year),
                    "births": int(r.births),
                    "deaths": int(r.deaths),
                    "naturalChange": int(r.natural_change),
                }
                for r in births_deaths.itertuples()
            ],
            "migration": [
                {
                    "year": int(r.year),
                    "migrationIn": int(r.migration_in),
                    "migrationOut": int(r.migration_out),
                    "netMigration": int(r.net_migration),
                }
                for r in migration.itertuples()
            ],
            "averageAge": [
                {"year": int(r.year), "value": round(float(r.average_age), 1)}
                for r in avg_age.itertuples()
            ],
        },
        "emergency": {
            "timeline": [
                {
                    "year": int(r.year),
                    "total": int(r.total),
                    "medicalVehicles": int(r.notarzt),
                    "rescueTransport": int(r.krankentransport),
                    "ambulances": int(r.rettung),
                    "helicopter": int(r.luftrettung),
                }
                for r in emergency.itertuples()
            ],
            "latestBreakdown": [
                {
                    "label": "Emergency Medical (Notarzt)",
                    "value": int(latest_em.notarzt),
                    "color": CHART_COLORS["medical"],
                },
                {
                    "label": "Patient Transport",
                    "value": int(latest_em.krankentransport),
                    "color": CHART_COLORS["transport"],
                },
                {
                    "label": "Rescue Operations",
                    "value": int(latest_em.rettung),
                    "color": CHART_COLORS["ambulance"],
                },
                {
                    "label": "Air Rescue",
                    "value": int(latest_em.luftrettung),
                    "color": CHART_COLORS["helicopter"],
                },
            ],
        },
        "healthcare": healthcare,
        "insights": insights,
        "riskDistricts": risk_districts,
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(dashboard, f, ensure_ascii=False, indent=2)

    print(f"✓ Written {OUTPUT}")
    print(f"  Years: {start_year}–{end_year}")
    print(f"  Population {end_year}: {dashboard['overview'][0]['value']:,}")
    print(f"  Districts: {len(healthcare['districtSummary'])}")
    print(f"  Map markers: {len(healthcare['facilities'])}")
    print(f"  Risk districts: {len(risk_districts)}")


if __name__ == "__main__":
    main()
