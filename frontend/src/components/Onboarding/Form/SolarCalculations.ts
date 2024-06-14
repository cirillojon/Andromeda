import { SolarPanelConfig } from "./SolarTypes";

export function calculateSolarPotential(
  config: SolarPanelConfig,
  panelCount: number,
  monthlyAverageEnergyBill: number,
  energyCostPerKwh: number,
  dcToAcDerate: number,
  solarIncentives: number,
  installationCostPerWatt: number,
  installationLifeSpan: number,
) {
  // Consistent with Google Solar API demo
  const yearlyEnergyDcKwh = config.yearlyEnergyDcKwh;
  const installationSizeKw = (panelCount * config.roofSegmentSummaries[0].panelsCount) / 1000;
  const installationCostTotal = installationCostPerWatt * installationSizeKw * 1000;
  
  const monthlyKwhEnergyConsumption = monthlyAverageEnergyBill / energyCostPerKwh;
  const yearlyKwhEnergyConsumption = monthlyKwhEnergyConsumption * 12;
  
  const initialAcKwhPerYear = yearlyEnergyDcKwh * dcToAcDerate;
  const yearlyProductionAcKwh = Array.from(Array(installationLifeSpan).keys()).map(
    (year) => initialAcKwhPerYear * 0.995 ** year, // 0.995 is the efficiency depreciation factor per year
  );

  const yearlyUtilityBillEstimates = yearlyProductionAcKwh.map(
    (yearlyKwhEnergyProduced, year) => {
      const billEnergyKwh = yearlyKwhEnergyConsumption - yearlyKwhEnergyProduced;
      const billEstimate = (billEnergyKwh * energyCostPerKwh * 1.022 ** year) / 1.04 ** year; // 1.022 is the cost increase factor, 1.04 is the discount rate
      return Math.max(billEstimate, 0);
    },
  );
  const remainingLifetimeUtilityBill = yearlyUtilityBillEstimates.reduce((x, y) => x + y, 0);
  const totalCostWithSolar = installationCostTotal + remainingLifetimeUtilityBill - solarIncentives;

  const yearlyCostWithoutSolar = Array.from(Array(installationLifeSpan).keys()).map(
    (year) => (monthlyAverageEnergyBill * 12 * 1.022 ** year) / 1.04 ** year, // 1.022 is the cost increase factor, 1.04 is the discount rate
  );
  const totalCostWithoutSolar = yearlyCostWithoutSolar.reduce((x, y) => x + y, 0);

  const savings = totalCostWithoutSolar - totalCostWithSolar;
  const energyCovered = yearlyProductionAcKwh[0] / yearlyKwhEnergyConsumption;

  return {
    installationSizeKw,
    installationCostTotal,
    yearlyEnergyDcKwh,
    yearlyProductionAcKwh,
    totalCostWithSolar,
    totalCostWithoutSolar,
    savings,
    energyCovered,
  };
}
