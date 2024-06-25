"use client";

import { Button } from "@/components/ui/button";
import "@/components/Onboarding/Form/FormPage.css";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { SolarData } from "@/components/Onboarding/Form/SolarTypes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  maxSavings: boolean;
  setMaxSavings: (value: boolean) => void;
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
  maxSavings,
  setMaxSavings,
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
/*
  useEffect(() => {
    handlemaxSavingsClick();
  }, []);*/

  const handlemaxSavingsClick = () => {
    setMaxSavings(!maxSavings);
    setShowFinance(true);
  };

  const formatAmount = (input: string) => {
    const number = parseFloat(input);
    
    // Check if input is a valid number
    if (isNaN(number)) {
        throw new Error('Invalid input. Please provide a valid number.');
    }
    
    // Format number as dollar amount
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    
    return formatter.format(number);
  }

  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="Financials" defaultChecked>
          <AccordionTrigger className="font-bold">Financials</AccordionTrigger>
          <AccordionContent>
            <div className="solar-potential-details">
              <p>
                <em>
                  All financial calculations are based on a 20-year lifespan.
                </em>
              </p>
              <div className="progress-bar">
                <p>
                  <strong>Cost Without Solar:</strong>{" "}
                  {formatAmount(calculationResults.totalCostWithoutSolar)}
                </p>
                <div className="progress">
                  <div
                    className="progress-filled bad"
                    style={{
                      width: `${
                        (calculationResults.totalCostWithoutSolar / 100000) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="progress-bar">
                <p>
                  <strong>Cost With Solar:</strong>{" "}
                  {formatAmount(calculationResults.totalCostWithSolar)}
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
                <strong>Savings:</strong>{" "}
                <span className="savings">{formatAmount(calculationResults.savings)}</span>
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
                  <strong>Installation Cost:</strong>{" "}
                  <span>${calculationResults.installationCostTotal}</span>
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="Capacity">
          <AccordionTrigger className="font-bold">Capacity</AccordionTrigger>
          <AccordionContent>
            <p>
              <strong>Max Sunshine Hours/Year:</strong>{" "}
              {
                solarData.building_insights.solarPotential
                  .maxSunshineHoursPerYear
              }
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
                    style={{
                      width: `${calculationResults.energyCovered * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SolarStatsCard;
