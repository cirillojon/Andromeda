"use client";

import { Button } from "@/components/ui/button";
import "@/components/Onboarding/Form/FormPage.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import { useState } from "react";
import { SolarData } from "@/components/Onboarding/Form/SolarTypes";

interface SolarStatsCardProps {
  solarData: SolarData;
  panelCount: number;
  maxPanels: number;
  handleSegmentClick: (segment: any) => void;
  handleToggleHeatmap: () => void;
  showHeatmap: boolean;
  calculationResults: any;
  handleToggleShowAllSegments: () => void;
  showAllSegments: boolean;
}

const SolarStatsCard: React.FC<SolarStatsCardProps> = ({
  solarData,
  panelCount,
  maxPanels,
  handleSegmentClick,
  handleToggleHeatmap,
  showHeatmap,
  calculationResults,
  handleToggleShowAllSegments,
  showAllSegments,
}) => {
  const [showFinance, setShowFinance] = useState(false);
  const panelsPercentage = (panelCount / maxPanels) * 100;
  const energyProducedPercentage =
    (calculationResults.yearlyEnergyDcKwh /
      calculationResults.maxYearlyEnergyDcKwh) *
    100;

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
        <div className="progress-bar">
          <p>
            <strong>Yearly Energy Produced (kWh):</strong>{" "}
            {calculationResults.yearlyEnergyDcKwh.toFixed(2)}/
            {calculationResults.maxYearlyEnergyDcKwh}
          </p>
          <div className="progress">
            <div
              className="progress-filled"
              style={{ width: `${energyProducedPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="progress-bar">
          <p>
            <strong>Panels Count:</strong> {panelCount}/{maxPanels}
          </p>
          <div className="progress">
            <div
              className="progress-filled"
              style={{ width: `${panelsPercentage}%` }}
            ></div>
          </div>
          <div className="progress-bar">
            <p>
              <strong>Energy Covered (%):</strong>{" "}
              {Math.round(calculationResults.energyCovered * 100)}
            </p>
            <div className="progress">
              <div
                className="progress-filled"
                style={{ width: `${calculationResults.energyCovered * 100}%` }}
              ></div>
            </div>
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
        <div className="button-container">
          <div className="button-container">
            <Button onClick={handleToggleHeatmap}>
              {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
            </Button>
            <Button onClick={handleToggleShowAllSegments}>
              {showAllSegments
                ? "Hide All Roof Segments"
                : "Show All Roof Segments"}
            </Button>
            <Button onClick={() => setShowFinance(!showFinance)}>
              {showFinance
                ? "Hide Financial Details"
                : "Show Financial Details"}
            </Button>
          </div>
        </div>
        {showFinance && (
          <div className="solar-potential-details">
            <div className="progress-bar">
              <p>
                <strong>Cost Without Solar ($):</strong>{" "}
                {calculationResults.totalCostWithoutSolar}
              </p>
              <div className="progress">
                <div
                  className="progress-filled bad"
                  style={{
                    width: `${
                      (calculationResults.totalCostWithoutSolar / 100000) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="progress-bar">
              <p>
                <strong>Cost With Solar ($):</strong>{" "}
                {calculationResults.totalCostWithSolar}
              </p>
              <div className="progress">
                <div
                  className="progress-filled good"
                  style={{
                    width: `${
                      (calculationResults.totalCostWithSolar / 100000) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <p>
              <strong>Savings ($):</strong>{" "}
              <span className="savings">{calculationResults.savings}</span>
            </p>
            <p>
              <strong>Break Even Year:</strong>{" "}
              {calculationResults.breakEvenYear >= 0
                ? `Year ${calculationResults.breakEvenYear}`
                : "Not achievable within the lifespan"}
            </p>
            <div className="progress-bar">
              <p>
                <strong>Installation Size (kW):</strong>{" "}
                {calculationResults.installationSizeKw}
              </p>
              <div
                style={{
                  width: `${
                    (calculationResults.installationSizeKw / 10) * 100
                  }%`,
                }}
              ></div>
            </div>
            <div>
              <p>
                <strong>Installation Cost ($):</strong>{" "}
                <span>{calculationResults.installationCostTotal}</span>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SolarStatsCard;
