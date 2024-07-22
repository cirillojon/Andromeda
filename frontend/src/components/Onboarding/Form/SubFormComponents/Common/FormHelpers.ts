import { calculateSolarPotential } from "../Solar/SolarCalculations";
import { SolarPanelConfig, SolarData } from "../Solar/SolarTypes";

export function convertMetersToSqFeet(areaMeters2: number): number {
  const SQ_METERS_TO_SQ_FEET = 10.7639;
  return areaMeters2 * SQ_METERS_TO_SQ_FEET;
}

export function getHouseSquareFootage(data: SolarData): number {
  let totalAreaMeters2 = 0;

  if (data.building_insights && data.building_insights.solarPotential) {
    const wholeRoofStats =
      data.building_insights.solarPotential.roofSegmentStats;
    if (wholeRoofStats) {
      totalAreaMeters2 = wholeRoofStats.reduce((acc: number, segment: any) => {
        return acc + segment.stats.areaMeters2;
      }, 0);
    }
  }

  const totalAreaSqFeet = convertMetersToSqFeet(totalAreaMeters2);
  return totalAreaSqFeet;
}

interface MaximizeSavingsParams {
  maxSavings: boolean;
  solarData: SolarData | null;
  panelCount: number;
  maxPanels: number;
  monthlyBill: number;
  setCalculationResults: (results: any) => void;
  setPanelCount: (count: number) => void;
}

export function maximizeSavings({
  maxSavings,
  solarData,
  panelCount,
  maxPanels,
  monthlyBill,
  setCalculationResults,
  setPanelCount,
}: MaximizeSavingsParams): void {
  if (maxSavings && solarData) {
    const config: SolarPanelConfig =
      solarData.building_insights.solarPotential.solarPanelConfigs[0];
    let maxConfiguration: any;
    let maxSavingsAmount = 0;
    let newPanelCount = 0;

    const phi = (1 + Math.sqrt(5)) / 2;
    let low = 1;
    let high = maxPanels;
    let c = high - Math.floor((high - low) / phi);
    let d = low + Math.floor((high - low) / phi);

    const evaluate = (panels: number) =>
      calculateSolarPotential(
        config,
        panels,
        maxPanels,
        Number(monthlyBill),
        0.31,
        0.85,
        7000,
        4.0,
        20,
        solarData.building_insights.solarPotential.panelCapacityWatts
      );

    let resultC = evaluate(c);
    let resultD = evaluate(d);

    while (low < high) {
      if (resultC && resultD) {
        if (resultC.savings > resultD.savings) {
          high = d - 1; // Ensure convergence
          d = c;
          c = high - Math.floor((high - low) / phi);
          resultD = resultC;
          resultC = evaluate(c);
        } else {
          low = c + 1; // Ensure convergence
          c = d;
          d = low + Math.floor((high - low) / phi);
          resultC = resultD;
          resultD = evaluate(d);
        }
      } else {
        break;
      }

      // Exit condition to avoid infinite loop
      if (high <= low) {
        break;
      }
    }

    if (resultC && resultC.savings > maxSavingsAmount) {
      maxSavingsAmount = resultC.savings;
      maxConfiguration = resultC;
      newPanelCount = c;
    }
    if (resultD && resultD.savings > maxSavingsAmount) {
      maxSavingsAmount = resultD.savings;
      maxConfiguration = resultD;
      newPanelCount = d;
    }

    if (maxConfiguration) {
      setCalculationResults(maxConfiguration);
      setPanelCount(newPanelCount);
    }
  }
}
