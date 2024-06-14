import { SolarPanelConfig } from "./SolarTypes";

const DEBUG = true;

export function calculateSolarPotential(
  config: SolarPanelConfig,
  panelCount: number,
  monthlyAverageEnergyBill: number,
  energyCostPerKwh: number,
  dcToAcDerate: number,
  solarIncentives: number,
  installationCostPerWatt: number,
  installationLifeSpan: number
) {
  const yearlyEnergyDcKwh = (config.yearlyEnergyDcKwh / config.roofSegmentSummaries[0].panelsCount) * panelCount;
  if (DEBUG) console.log(`Yearly Energy DC (kWh) for ${panelCount} panels: ${yearlyEnergyDcKwh}`);

  const installationSizeKw = (panelCount * config.roofSegmentSummaries[0].panelsCount) / 1000;
  const installationCostTotal = installationCostPerWatt * installationSizeKw * 1000;

  const monthlyKwhEnergyConsumption = monthlyAverageEnergyBill / energyCostPerKwh;
  const yearlyKwhEnergyConsumption = monthlyKwhEnergyConsumption * 12;

  const initialAcKwhPerYear = yearlyEnergyDcKwh * dcToAcDerate;
  const yearlyProductionAcKwh = Array.from(Array(installationLifeSpan).keys()).map(
    (year) => initialAcKwhPerYear * 0.995 ** year // 0.995 is the efficiency depreciation factor per year
  );

  if (DEBUG) console.log(`Yearly Production AC (kWh):`, yearlyProductionAcKwh);

  const yearlyUtilityBillEstimates = yearlyProductionAcKwh.map(
    (yearlyKwhEnergyProduced, year) => {
      const billEnergyKwh = yearlyKwhEnergyConsumption - yearlyKwhEnergyProduced;
      const billEstimate = (billEnergyKwh * energyCostPerKwh * 1.022 ** year) / 1.04 ** year; // 1.022 is the cost increase factor, 1.04 is the discount rate
      return Math.max(billEstimate, 0);
    }
  );
  const remainingLifetimeUtilityBill = yearlyUtilityBillEstimates.reduce((x, y) => x + y, 0);
  const totalCostWithSolar = installationCostTotal + remainingLifetimeUtilityBill - solarIncentives;

  const yearlyCostWithoutSolar = Array.from(Array(installationLifeSpan).keys()).map(
    (year) => (monthlyAverageEnergyBill * 12 * 1.022 ** year) / 1.04 ** year // 1.022 is the cost increase factor, 1.04 is the discount rate
  );
  const totalCostWithoutSolar = yearlyCostWithoutSolar.reduce((x, y) => x + y, 0);

  const savings = totalCostWithoutSolar - totalCostWithSolar;
  const energyCovered = yearlyProductionAcKwh[0] / yearlyKwhEnergyConsumption;

  if (DEBUG) console.log(`Energy Covered: ${energyCovered * 100}%`);

  // Calculate cumulative costs for each year
  const cumulativeCostsWithSolar: number[] = [];
  yearlyUtilityBillEstimates.forEach((billEstimate, i) => {
    const cumulativeCost = (i === 0 ? billEstimate + installationCostTotal - solarIncentives : billEstimate + cumulativeCostsWithSolar[i - 1]);
    cumulativeCostsWithSolar.push(cumulativeCost);
  });

  if (DEBUG) console.log(`Cumulative Costs With Solar:`, cumulativeCostsWithSolar);

  const cumulativeCostsWithoutSolar: number[] = [];
  yearlyCostWithoutSolar.forEach((cost, i) => {
    const cumulativeCost = (i === 0 ? cost : cost + cumulativeCostsWithoutSolar[i - 1]);
    cumulativeCostsWithoutSolar.push(cumulativeCost);
  });

  if (DEBUG) console.log(`Cumulative Costs Without Solar:`, cumulativeCostsWithoutSolar);

  // Determine breakeven year
  let breakEvenYear = -1;
  for (let i = 0; i < cumulativeCostsWithSolar.length; i++) {
    if (cumulativeCostsWithSolar[i] <= cumulativeCostsWithoutSolar[i]) {
      breakEvenYear = i + 1; // Since index is 0-based and year is 1-based
      break;
    }
  }

  if (DEBUG) console.log(`Break Even Year: ${breakEvenYear}`);

  return {
    installationSizeKw,
    installationCostTotal,
    yearlyEnergyDcKwh,
    yearlyProductionAcKwh,
    totalCostWithSolar,
    totalCostWithoutSolar,
    savings,
    energyCovered,
    breakEvenYear,
  };
}
