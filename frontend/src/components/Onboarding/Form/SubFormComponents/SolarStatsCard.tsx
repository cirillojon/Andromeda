"use client";

import { Button } from "@/components/ui/button";
import "@/components/Onboarding/Form/FormPage.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import { SolarData } from "@/components/Onboarding/Form/SolarTypes";

interface SolarStatsCardProps {
  solarData: SolarData;
  panelCount: number;
  maxPanels: number;
  handleSegmentClick: (segment: any) => void;
  handleToggleHeatmap: () => void;
  showHeatmap: boolean;
  calculationResults: any;
}

const SolarStatsCard: React.FC<SolarStatsCardProps> = ({
  solarData,
  panelCount,
  maxPanels,
  handleSegmentClick,
  handleToggleHeatmap,
  showHeatmap,
  calculationResults,
}) => {
  const maxYearlySavings = 69718;
  const totalSavings = solarData
    ? (panelCount *
        solarData.building_insights.solarPotential.maxSunshineHoursPerYear *
        solarData.building_insights.solarPotential.panelCapacityWatts) /
      1000
    : 0;
  const panelsPercentage = (panelCount / maxPanels) * 100;
  const savingsPercentage = (totalSavings / maxYearlySavings) * 100;

  const panelData =
    solarData.building_insights.solarPotential.solarPanels.slice(0, panelCount);

  const barChartData = {
    labels: panelData.map((panel, index) => `Panel ${index + 1}`),
    datasets: [
      {
        label: "Yearly Energy (kWh)",
        data: panelData.map((panel) => panel.yearlyEnergyDcKwh),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  return (
    <Card className="solar-stats">
      <CardHeader>
        <CardTitle>Solar Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Max Sunshine Hours/Year:</strong>{" "}
          {solarData.building_insights.solarPotential.maxSunshineHoursPerYear}
        </p>
        <p>
          <strong>Panel Capacity (Watts):</strong>{" "}
          {solarData.building_insights.solarPotential.panelCapacityWatts}
        </p>
        <p>
          <strong>Total Savings (kWh/year):</strong> {totalSavings.toFixed(2)}
        </p>
        <div className="progress-bar">
          <p>
            Panels Count: {panelCount}/{maxPanels}
          </p>
          <div className="progress">
            <div
              className="progress-filled"
              style={{ width: `${panelsPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="progress-bar">
          <p>
            Yearly Savings: {totalSavings.toFixed(2)} kWh/
            {maxYearlySavings} kWh
          </p>
          <div className="progress">
            <div
              className="progress-filled"
              style={{ width: `${savingsPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="chart-container">
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: {
                  display: true,
                  text: "Yearly Energy Production by Panel",
                },
              },
            }}
          />
        </div>
        {solarData.building_insights.solarPotential.roofSegmentStats.length >
          0 && (
          <div className="roof-segments-container">
            {solarData.building_insights.solarPotential.roofSegmentStats.map(
              (segment, index) => (
                <div
                  key={index}
                  className="roof-segment"
                  onClick={() => handleSegmentClick(segment)}
                >
                  <h3>Roof Segment {index + 1}</h3>
                  <p>
                    <strong>Area (m²):</strong>{" "}
                    {segment.stats.areaMeters2.toFixed(2)}
                  </p>
                  <p>
                    <strong>Pitch (degrees):</strong>{" "}
                    {segment.pitchDegrees.toFixed(2)}
                  </p>
                  <p>
                    <strong>Azimuth (degrees):</strong>{" "}
                    {segment.azimuthDegrees.toFixed(2)}
                  </p>
                </div>
              )
            )}
          </div>
        )}
        <Button onClick={handleToggleHeatmap}>
          {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
        </Button>
        <div className="solar-potential-analysis">
          <h2>Solar Potential Analysis</h2>
          <p>Yearly Energy: {calculationResults.yearlyEnergyDcKwh} kWh</p>
          <p>Installation Size: {calculationResults.installationSizeKw} kW</p>
          <p>Installation Cost: ${calculationResults.installationCostTotal}</p>
          <p>
            Energy Covered: {Math.round(calculationResults.energyCovered * 100)}
            %
          </p>
          <p>Cost Without Solar: ${calculationResults.totalCostWithoutSolar}</p>
          <p>Cost With Solar: ${calculationResults.totalCostWithSolar}</p>
          <p>Savings: ${calculationResults.savings}</p>
          <p>
            Break Even Year:{" "}
            {calculationResults.breakEvenYear >= 0
              ? `Year ${calculationResults.breakEvenYear}`
              : "Not achievable within the lifespan"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SolarStatsCard;
