"use client";

import React, { useState, useEffect } from "react";
import "./FormPage.css";
import SolarMap, { RoofSegment } from "./SolarMap";
import secureLocalStorage from "react-secure-storage";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Button } from "../../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

interface LatLng {
  lat: number;
  lng: number;
}

interface SolarData {
  building_insights: {
    solarPotential: {
      maxSunshineHoursPerYear: number;
      panelCapacityWatts: number;
      solarPanels: {
        center: { latitude: number; longitude: number };
        orientation: string;
        yearlyEnergyDcKwh: number;
      }[];
      roofSegmentStats: {
        stats: {
          areaMeters2: number;
        };
        center: { latitude: number; longitude: number };
        pitchDegrees: number;
        azimuthDegrees: number;
      }[];
    };
  };
}

const FormPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Solar");
  const [panelCount, setPanelCount] = useState<number>(10);
  const [solarData, setSolarData] = useState<SolarData | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<RoofSegment | null>(
    null
  );
  const [inputValues, setInputValues] = useState<{
    solar: { panelCount: number; input2: string; input3: string };
    roofing: { input1: string; input2: string; input3: string };
    battery: { input1: string; input2: string; input3: string };
    [key: string]: any;
  }>({
    solar: { panelCount: 10, input2: "", input3: "" },
    roofing: { input1: "", input2: "", input3: "" },
    battery: { input1: "", input2: "", input3: "" },
  });

  useEffect(() => {
    const storageItem = secureLocalStorage.getItem("solarData") as string;
    if (storageItem) {
      const data = JSON.parse(storageItem);
      console.log("Loaded solar data:", data);
      setSolarData(data);
    }

    // Simulate manual page reload
    if (!sessionStorage.getItem("reloaded")) {
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    }
  }, []);

  const handlePanelCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setPanelCount(newValue);
    setInputValues((prevValues) => ({
      ...prevValues,
      solar: { ...prevValues.solar, panelCount: newValue },
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    tab: string,
    inputName: string
  ) => {
    const newValue = e.target.value;
    setInputValues((prevValues) => ({
      ...prevValues,
      [tab]: { ...prevValues[tab], [inputName]: newValue },
    }));
  };

  const handleSegmentClick = (
    segment: SolarData["building_insights"]["solarPotential"]["roofSegmentStats"][0]
  ) => {
    if (
      selectedSegment &&
      selectedSegment.id ===
        `${segment.center.latitude}-${segment.center.longitude}`
    ) {
      setSelectedSegment(null);
    } else {
      const offsetLat = 0.00001;
      const offsetLng = 0.00001;
      const roofSegment: RoofSegment = {
        id: `${segment.center.latitude}-${segment.center.longitude}`,
        center: {
          lat: segment.center.latitude,
          lng: segment.center.longitude,
        },
        areaMeters2: segment.stats.areaMeters2,
        pitchDegrees: segment.pitchDegrees,
        azimuthDegrees: segment.azimuthDegrees,
        corners: [
          {
            lat: segment.center.latitude + offsetLat,
            lng: segment.center.longitude + offsetLng,
          },
          {
            lat: segment.center.latitude + offsetLat,
            lng: segment.center.longitude - offsetLng,
          },
          {
            lat: segment.center.latitude - offsetLat,
            lng: segment.center.longitude - offsetLng,
          },
          {
            lat: segment.center.latitude - offsetLat,
            lng: segment.center.longitude + offsetLng,
          },
        ],
      };
      setSelectedSegment(roofSegment);
    }
  };

  const handleSubmit = () => {
    secureLocalStorage.setItem("formData", JSON.stringify(inputValues));
    console.log("Form data saved to local storage:", inputValues);

    const storedData = secureLocalStorage.getItem("formData");
    console.log("Stored data from local storage:", storedData);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Solar":
        return (
          <Card className="content">
            <CardHeader>
              <CardTitle>Solar Data Input</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="panelCount">Number of Panels</Label>
              <Input
                id="panelCount"
                type="number"
                placeholder="Number of Panels"
                value={inputValues.solar.panelCount}
                onChange={(e) => handlePanelCountChange(e)}
                min="1"
                step="1"
              />
              <Label htmlFor="solarInput2">Input 2</Label>
              <Input
                id="solarInput2"
                type="text"
                placeholder="Input 2"
                value={inputValues.solar.input2}
                onChange={(e) => handleInputChange(e, "solar", "input2")}
              />
              <Label htmlFor="solarInput3">Input 3</Label>
              <Input
                id="solarInput3"
                type="text"
                placeholder="Input 3"
                value={inputValues.solar.input3}
                onChange={(e) => handleInputChange(e, "solar", "input3")}
              />
            </CardContent>
          </Card>
        );
      case "Roofing":
        return (
          <Card className="content">
            <CardHeader>
              <CardTitle>Roofing Data Input</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="roofingInput1">Input 1</Label>
              <Input
                id="roofingInput1"
                type="text"
                placeholder="Input 1"
                value={inputValues.roofing.input1}
                onChange={(e) => handleInputChange(e, "roofing", "input1")}
              />
              <Label htmlFor="roofingInput2">Input 2</Label>
              <Input
                id="roofingInput2"
                type="text"
                placeholder="Input 2"
                value={inputValues.roofing.input2}
                onChange={(e) => handleInputChange(e, "roofing", "input2")}
              />
              <Label htmlFor="roofingInput3">Input 3</Label>
              <Input
                id="roofingInput3"
                type="text"
                placeholder="Input 3"
                value={inputValues.roofing.input3}
                onChange={(e) => handleInputChange(e, "roofing", "input3")}
              />
            </CardContent>
          </Card>
        );
      case "Battery":
        return (
          <Card className="content">
            <CardHeader>
              <CardTitle>Battery Data Input</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="batteryInput1">Input 1</Label>
              <Input
                id="batteryInput1"
                type="text"
                placeholder="Input 1"
                value={inputValues.battery.input1}
                onChange={(e) => handleInputChange(e, "battery", "input1")}
              />
              <Label htmlFor="batteryInput2">Input 2</Label>
              <Input
                id="batteryInput2"
                type="text"
                placeholder="Input 2"
                value={inputValues.battery.input2}
                onChange={(e) => handleInputChange(e, "battery", "input2")}
              />
              <Label htmlFor="batteryInput3">Input 3</Label>
              <Input
                id="batteryInput3"
                type="text"
                placeholder="Input 3"
                value={inputValues.battery.input3}
                onChange={(e) => handleInputChange(e, "battery", "input3")}
              />
            </CardContent>
          </Card>
        );
      case "HVAC":
        return (
          <Card className="content">
            <CardHeader>
              <CardTitle>Coming Soon!</CardTitle>
            </CardHeader>
          </Card>
        );
      default:
        return null;
    }
  };

  const totalSavings = solarData
    ? (panelCount *
        solarData.building_insights.solarPotential.maxSunshineHoursPerYear *
        solarData.building_insights.solarPotential.panelCapacityWatts) /
      1000
    : 0;

  const maxPanels = 110;
  const maxYearlySavings = 69718;

  const panelsPercentage = (panelCount / maxPanels) * 100;
  const savingsPercentage = (totalSavings / maxYearlySavings) * 100;

  const panelData =
    solarData?.building_insights.solarPotential.solarPanels.slice(
      0,
      panelCount
    );

  const barChartData = {
    labels: panelData?.map((panel, index) => `Panel ${index + 1}`),
    datasets: [
      {
        label: "Yearly Energy (kWh)",
        data: panelData?.map((panel) => panel.yearlyEnergyDcKwh),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  console.log("Total Savings:", totalSavings);

  return (
    <div className="form-container md:mt-16 mt-0">
      <div className="tabs">
        <Button
          variant={activeTab === "Solar" ? "default" : "outline"}
          onClick={() => setActiveTab("Solar")}
        >
          Solar
        </Button>
        <Button
          variant={activeTab === "Roofing" ? "default" : "outline"}
          onClick={() => setActiveTab("Roofing")}
        >
          Roofing
        </Button>
        <Button
          variant={activeTab === "Battery" ? "default" : "outline"}
          onClick={() => setActiveTab("Battery")}
        >
          Battery
        </Button>
        <Button
          variant={activeTab === "HVAC" ? "default" : "outline"}
          onClick={() => setActiveTab("HVAC")}
        >
          HVAC
        </Button>
      </div>
      <div className="mainContent">
        <div className="sidebar left-sidebar">
          {activeTab === "Solar" && solarData && (
            <Card className="solar-stats">
              <CardHeader>
                <CardTitle>Solar Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Max Sunshine Hours/Year:</strong>{" "}
                  {
                    solarData.building_insights.solarPotential
                      .maxSunshineHoursPerYear
                  }
                </p>
                <p>
                  <strong>Panel Capacity (Watts):</strong>{" "}
                  {
                    solarData.building_insights.solarPotential
                      .panelCapacityWatts
                  }
                </p>
                <p>
                  <strong>Total Savings (kWh/year):</strong>{" "}
                  {totalSavings.toFixed(2)}
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
                {solarData.building_insights.solarPotential.roofSegmentStats
                  .length > 0 && (
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
              </CardContent>
            </Card>
          )}
        </div>
        <div className="viewbox">
          <SolarMap panelCount={panelCount} selectedSegment={selectedSegment} />
        </div>
        <div className="sidebar">
          {renderContent()}
          <RegisterLink className="w-full">
            <Button onClick={handleSubmit}>Submit</Button>
          </RegisterLink>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
