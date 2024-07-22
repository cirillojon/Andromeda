export interface DataLayersResponse {
  imageryDate: {
    year: number;
    month: number;
    day: number;
  };
  imageryProcessedDate: {
    year: number;
    month: number;
    day: number;
  };
  dsmUrl: string;
  rgbUrl: string;
  maskUrl: string;
  annualFluxUrl: string;
  monthlyFluxUrl: string;
  hourlyShadeUrls: string[];
  imageryQuality: "HIGH" | "MEDIUM" | "LOW";
}

export interface SolarData {
  building_insights: {
    solarPotential: {
      solarPanelConfigs: SolarPanelConfig[];
      maxSunshineHoursPerYear: number;
      panelCapacityWatts: number;
      panelHeightMeters: number;
      panelWidthMeters: number;
      panelLifetimeYears: number;
      maxArrayPanelsCount: number;
      maxArrayAreaMeters2: number;
      carbonOffsetFactorKgPerMwh: number;
      buildingStats: {
        areaMeters2: number;
        groundAreaMeters2: number;
        sunshineQuantiles: number[];
      };
      wholeRoofStats: {
        areaMeters2: number;
        sunshineQuantiles: number[];
        groundAreaMeters2: number;
      };
      solarPanels: {
        center: { latitude: number; longitude: number };
        orientation: string;
        yearlyEnergyDcKwh: number;
        segmentIndex: number;
      }[];
      roofSegmentStats: {
        stats: {
          areaMeters2: number;
          sunshineQuantiles: number[];
        };
        center: { latitude: number; longitude: number };
        pitchDegrees: number;
        azimuthDegrees: number;
        boundingBox: {
          sw: { latitude: number; longitude: number };
          ne: { latitude: number; longitude: number };
        };
        planeHeightAtCenterMeters: number;
      }[];
    };
  };
  data_layers: DataLayersResponse;
  roofSqft?: number;
  latitude: number;
  longitude: number;
}

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface BuildingInsightsResponse {
  name: string;
  center: LatLng;
  boundingBox: LatLngBox;
  imageryDate: Date;
  imageryProcessedDate: Date;
  postalCode: string;
  administrativeArea: string;
  statisticalArea: string;
  regionCode: string;
  solarPotential: SolarPotential;
  imageryQuality: "HIGH" | "MEDIUM" | "LOW";
}

export interface SolarPotential {
  maxArrayPanelsCount: number;
  panelCapacityWatts: number;
  panelHeightMeters: number;
  panelWidthMeters: number;
  panelLifetimeYears: number;
  maxArrayAreaMeters2: number;
  maxSunshineHoursPerYear: number;
  carbonOffsetFactorKgPerMwh: number;
  wholeRoofStats: SizeAndSunshineStats;
  buildingStats: SizeAndSunshineStats;
  roofSegmentStats: RoofSegmentSizeAndSunshineStats[];
  solarPanels: SolarPanel[];
  solarPanelConfigs: SolarPanelConfig[];
  financialAnalyses: object;
}

export interface SizeAndSunshineStats {
  areaMeters2: number;
  sunshineQuantiles: number[];
  groundAreaMeters2: number;
}

export interface RoofSegmentSizeAndSunshineStats {
  pitchDegrees: number;
  azimuthDegrees: number;
  stats: SizeAndSunshineStats;
  center: LatLng;
  boundingBox: LatLngBox;
  planeHeightAtCenterMeters: number;
}

export interface SolarPanel {
  center: LatLng;
  orientation: "LANDSCAPE" | "PORTRAIT";
  segmentIndex: number;
  yearlyEnergyDcKwh: number;
}

export interface SolarPanelConfig {
  panelCapacityWatts: number;
  panelsCount: number;
  yearlyEnergyDcKwh: number;
  roofSegmentSummaries: RoofSegmentSummary[];
}

export interface RoofSegmentSummary {
  panelCapacityWatts: number;
  pitchDegrees: number;
  azimuthDegrees: number;
  panelsCount: number;
  yearlyEnergyDcKwh: number;
  segmentIndex: number;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface LatLngBox {
  sw: LatLng;
  ne: LatLng;
}

export interface RequestError {
  error: {
    code: number;
    message: string;
    status: string;
  };
}

export type LayerId =
  | "mask"
  | "dsm"
  | "rgb"
  | "annualFlux"
  | "monthlyFlux"
  | "hourlyShade";
