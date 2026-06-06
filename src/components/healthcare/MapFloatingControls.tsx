"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { DISTRICT_CENTROIDS } from "@/lib/district-centroids";
import type { DistrictSummary } from "@/lib/types";

const CITY_ZOOM = 12;
const FOCUS_ZOOM = 13;

export type MapCommand =
  | { type: "fit" }
  | { type: "zoom"; delta: number }
  | null;

interface MapFloatingControlsProps {
  command: MapCommand;
  onCommandHandled: () => void;
  districts: DistrictSummary[];
  selectedDistrict: string | null;
}

export function MapFloatingControls({
  command,
  onCommandHandled,
  districts,
  selectedDistrict,
}: MapFloatingControlsProps) {
  const map = useMap();

  useEffect(() => {
    const coords = districts
      .map((d) => DISTRICT_CENTROIDS[d.districtCode])
      .filter(Boolean) as [number, number][];
    if (coords.length > 0) {
      map.fitBounds(coords, { padding: [48, 48], maxZoom: CITY_ZOOM });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial fit once on mount
  }, []);

  useEffect(() => {
    if (!command) return;

    if (command.type === "fit") {
      const coords = districts
        .map((d) => DISTRICT_CENTROIDS[d.districtCode])
        .filter(Boolean) as [number, number][];
      if (coords.length > 0) {
        map.fitBounds(coords, { padding: [48, 48], maxZoom: CITY_ZOOM, animate: true });
      }
    } else if (command.type === "zoom") {
      map.setZoom(Math.min(15, Math.max(10, map.getZoom() + command.delta)));
    }

    onCommandHandled();
  }, [command, districts, map, onCommandHandled]);

  useEffect(() => {
    if (!selectedDistrict) return;
    const match = districts.find((d) => d.district === selectedDistrict);
    const coords = match ? DISTRICT_CENTROIDS[match.districtCode] ?? null : null;
    if (coords) {
      map.flyTo(coords, FOCUS_ZOOM, { duration: 0.75, easeLinearity: 0.25 });
    }
  }, [map, selectedDistrict, districts]);

  return null;
}
