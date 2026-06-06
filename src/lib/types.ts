export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  format?: "number" | "decimal";
}

export interface TimeSeriesPoint {
  year: number;
  value: number;
}

export interface BirthDeathPoint {
  year: number;
  births: number;
  deaths: number;
  naturalChange: number;
}

export interface MigrationPoint {
  year: number;
  migrationIn: number;
  migrationOut: number;
  netMigration: number;
}

export interface EmergencyPoint {
  year: number;
  total: number;
  medicalVehicles: number;
  rescueTransport: number;
  ambulances: number;
  helicopter: number;
}

export interface HealthcareFacility {
  id: string;
  name: string;
  type: "doctor" | "pharmacy" | "facility";
  lat: number;
  lng: number;
  district: string;
  districtCode?: string;
  specialty?: string;
}

export interface DistrictSummary {
  district: string;
  districtCode: string;
  doctors: number;
  pharmacies: number;
  facilities: number;
  population: number;
  ratioPer1000: number;
  elderlyPct: number;
  physicianDataAvailable: boolean;
}

export type LensLevel = "weak" | "medium" | "strong";
export type LensId = "physicians" | "transport" | "transit";

export interface AccessLensDistrict {
  district: string;
  districtCode: string;
  physiciansPer1000: number;
  transportDemand: number;
  transportPer1000: number;
  busStopsNearby: number;
  physicianLevel: LensLevel;
  transportLevel: LensLevel;
  transitLevel: LensLevel;
  compoundGap: boolean;
  weakLensCount: number;
}

export interface AccessLensData {
  cityTransportTotal: number;
  busStopRadiusKm: number;
  magdeburgBusStops: number;
  compoundGapDistricts: string[];
  districts: AccessLensDistrict[];
}

export interface KeyFinding {
  id: string;
  title: string;
  body: string;
}

export interface RiskDistrict {
  rank: number;
  district: string;
  riskScore: number;
  riskLevel: "High" | "Medium" | "Low";
  elderlyPct: number;
  physiciansPer1000: number;
  population: number;
  rationale: string;
}

export interface SectionNarratives {
  population: string;
  emergency: string;
  healthcare: string;
  insights: string;
  risk: string;
}

export interface DashboardData {
  meta: {
    city: string;
    dataSource: string;
    lastUpdated: string;
    yearRange: [number, number];
  };
  narratives: SectionNarratives;
  overview: KpiMetric[];
  population: {
    growth: TimeSeriesPoint[];
    birthsDeaths: BirthDeathPoint[];
    migration: MigrationPoint[];
    averageAge: TimeSeriesPoint[];
  };
  emergency: {
    timeline: EmergencyPoint[];
    latestBreakdown: {
      label: string;
      value: number;
      color: string;
    }[];
  };
  healthcare: {
    facilities: HealthcareFacility[];
    districtSummary: DistrictSummary[];
    excludedDistrictsNote: string;
    accessLens?: AccessLensData;
  };
  insights: {
    keyFindings: KeyFinding[];
    combinedTimeline: {
      year: number;
      averageAge: number;
      emergencyIncidents: number;
      doctorsPer1000: number;
    }[];
  };
  riskDistricts: RiskDistrict[];
}
