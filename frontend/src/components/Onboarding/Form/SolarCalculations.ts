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
  installationLifeSpan: number,
  panelCapacityWatts: number
) {
  // Output all the parameters
  if (DEBUG) {
    console.log("Parameters:", {
      config,
      panelCount,
      monthlyAverageEnergyBill,
      energyCostPerKwh,
      dcToAcDerate,
      solarIncentives,
      installationCostPerWatt,
      installationLifeSpan,
      panelCapacityWatts,
    });
  }
  if (!panelCapacityWatts) {
    console.error("Invalid installation parameters", {
      panelCount,
      panelCapacityWatts,
      installationCostPerWatt,
    });
    return; // Early exit if any configuration is invalid
  }

  const yearlyEnergyDcKwh =
    (config.yearlyEnergyDcKwh / config.roofSegmentSummaries[0].panelsCount) *
    panelCount;
  if (DEBUG)
    console.log(
      `Yearly Energy DC (kWh) for ${panelCount} panels: ${yearlyEnergyDcKwh}`
    );

  const installationSizeKw = (panelCount * panelCapacityWatts) / 1000;
  if (DEBUG) console.log(`Installation Size (kW): ${installationSizeKw}`);

  const installationCostTotal =
    installationCostPerWatt * installationSizeKw * 1000;
  if (DEBUG) console.log(`Installation Cost Total: ${installationCostTotal}`);

  const monthlyKwhEnergyConsumption =
    monthlyAverageEnergyBill / energyCostPerKwh;
  if (DEBUG)
    console.log(
      `Monthly kWh Energy Consumption: ${monthlyKwhEnergyConsumption}`
    );

  const yearlyKwhEnergyConsumption = monthlyKwhEnergyConsumption * 12;
  if (DEBUG)
    console.log(`Yearly kWh Energy Consumption: ${yearlyKwhEnergyConsumption}`);

  const initialAcKwhPerYear = yearlyEnergyDcKwh * dcToAcDerate;
  if (DEBUG) console.log(`Initial AC kWh Per Year: ${initialAcKwhPerYear}`);

  const yearlyProductionAcKwh = Array.from(
    Array(installationLifeSpan).keys()
  ).map(
    (year) => initialAcKwhPerYear * 0.995 ** year // 0.995 is the efficiency depreciation factor per year
  );

  if (DEBUG) console.log(`Yearly Production AC (kWh):`, yearlyProductionAcKwh);

  const yearlyUtilityBillEstimates = yearlyProductionAcKwh.map(
    (yearlyKwhEnergyProduced, year) => {
      const billEnergyKwh =
        yearlyKwhEnergyConsumption - yearlyKwhEnergyProduced;
      const billEstimate =
        (billEnergyKwh * energyCostPerKwh * 1.022 ** year) / 1.04 ** year; // 1.022 is the cost increase factor, 1.04 is the discount rate
      return Math.max(billEstimate, 0);
    }
  );

  if (DEBUG)
    console.log(`Yearly Utility Bill Estimates:`, yearlyUtilityBillEstimates);

  const remainingLifetimeUtilityBill = yearlyUtilityBillEstimates.reduce(
    (x, y) => x + y,
    0
  );
  if (DEBUG)
    console.log(
      `Remaining Lifetime Utility Bill: ${remainingLifetimeUtilityBill}`
    );

  const totalCostWithSolar =
    installationCostTotal + remainingLifetimeUtilityBill - solarIncentives;
  if (DEBUG) console.log(`Total Cost With Solar: ${totalCostWithSolar}`);

  const yearlyCostWithoutSolar = Array.from(
    Array(installationLifeSpan).keys()
  ).map(
    (year) => (monthlyAverageEnergyBill * 12 * 1.022 ** year) / 1.04 ** year
  );

  if (DEBUG) console.log(`Yearly Cost Without Solar:`, yearlyCostWithoutSolar);

  const totalCostWithoutSolar = yearlyCostWithoutSolar.reduce(
    (x, y) => x + y,
    0
  );
  if (DEBUG) console.log(`Total Cost Without Solar: ${totalCostWithoutSolar}`);

  const savings = totalCostWithoutSolar - totalCostWithSolar;
  if (DEBUG) console.log(`Savings: ${savings}`);

  const energyCovered = yearlyProductionAcKwh[0] / yearlyKwhEnergyConsumption;
  if (DEBUG) console.log(`Energy Covered: ${energyCovered * 100}%`);

  const cumulativeCostsWithSolar: number[] = [];
  yearlyUtilityBillEstimates.forEach((billEstimate, i) => {
    const initialCost = i === 0 ? installationCostTotal - solarIncentives : 0;
    const previousCumulative = cumulativeCostsWithSolar[i - 1] || 0;
    const cumulativeCost = initialCost + billEstimate + previousCumulative;

    if (isNaN(cumulativeCost)) {
      console.error(`NaN detected at year ${i + 1}`);
      console.error(
        `Initial Cost: ${initialCost}, Bill Estimate: ${billEstimate}, Previous Cumulative: ${previousCumulative}`
      );
    }

    cumulativeCostsWithSolar.push(cumulativeCost);
  });

  if (DEBUG)
    console.log(`Cumulative Costs With Solar:`, cumulativeCostsWithSolar);

  const cumulativeCostsWithoutSolar: number[] = [];
  yearlyCostWithoutSolar.forEach((cost, i) => {
    const cumulativeCost =
      i === 0 ? cost : cost + cumulativeCostsWithoutSolar[i - 1];
    cumulativeCostsWithoutSolar.push(cumulativeCost);
  });

  if (DEBUG)
    console.log(`Cumulative Costs Without Solar:`, cumulativeCostsWithoutSolar);

  let breakEvenYear = -1;
  for (let i = 0; i < cumulativeCostsWithSolar.length; i++) {
    if (cumulativeCostsWithSolar[i] <= cumulativeCostsWithoutSolar[i]) {
      breakEvenYear = i + 1; // Since index is 0-based and year is 1-based
      break;
    }
  }

  if (DEBUG && breakEvenYear === -1) {
    console.log(
      "Break-even point not found within the lifespan of the installation."
    );
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
