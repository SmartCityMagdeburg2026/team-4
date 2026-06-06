"use client";

import type { DashboardData } from "@/lib/types";
import { EmergencyPictogram } from "./EmergencyPictogram";

interface EmergencySectionProps {
  data: DashboardData["emergency"];
}

export function EmergencySection({ data }: EmergencySectionProps) {
  return <EmergencyPictogram timeline={data.timeline} />;
}
