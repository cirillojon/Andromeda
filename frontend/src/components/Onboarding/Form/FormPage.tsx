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
  const [panelCount, setPanelCount] = useState<number>(10); // Default to showing 10 panels
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
      console.log("Loaded solar data:", data); // Debug log
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
      const offsetLat = 0.00001; // height
      const offsetLng = 0.00001; // width
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

  const renderContent = () => {
    switch (activeTab) {
      case "Solar":
        return (
          <div className="content">
            <h1 className="scaling-header-text">Solar Data Input</h1>
            <input
              type="number"
              placeholder="Number of Panels"
              className="input"
              value={inputValues.solar.panelCount}
              onChange={(e) => handlePanelCountChange(e)}
              min="1"
              step="1"
            />
            <input
              type="text"
              placeholder="Input 2"
              className="input"
              value={inputValues.solar.input2}
              onChange={(e) => handleInputChange(e, "solar", "input2")}
            />
            <input
              type="text"
              placeholder="Input 3"
              className="input"
              value={inputValues.solar.input3}
              onChange={(e) => handleInputChange(e, "solar", "input3")}
            />
          </div>
        );
      case "Roofing":
        return (
          <div className="content">
            <h1 className="scaling-header-text">Roofing Data Input</h1>
            <input
              type="text"
              placeholder="Input 1"
              className="input"
              value={inputValues.roofing.input1}
              onChange={(e) => handleInputChange(e, "roofing", "input1")}
            />
            <input
              type="text"
              placeholder="Input 2"
              className="input"
              value={inputValues.roofing.input2}
              onChange={(e) => handleInputChange(e, "roofing", "input2")}
            />
            <input
              type="text"
              placeholder="Input 3"
              className="input"
              value={inputValues.roofing.input3}
              onChange={(e) => handleInputChange(e, "roofing", "input3")}
            />
          </div>
        );
      case "Battery":
        return (
          <div className="content">
            <h1 className="scaling-header-text">Battery Data Input</h1>
            <input
              type="text"
              placeholder="Input 1"
              className="input"
              value={inputValues.battery.input1}
              onChange={(e) => handleInputChange(e, "battery", "input1")}
            />
            <input
              type="text"
              placeholder="Input 2"
              className="input"
              value={inputValues.battery.input2}
              onChange={(e) => handleInputChange(e, "battery", "input2")}
            />
            <input
              type="text"
              placeholder="Input 3"
              className="input"
              value={inputValues.battery.input3}
              onChange={(e) => handleInputChange(e, "battery", "input3")}
            />
          </div>
        );
      case "HVAC":
        return (
          <div className="content">
            <h1 className="scaling-header-text">Coming Soon!</h1>
          </div>
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

  const maxPanels = 110; // temporary hardcoded value
  const maxYearlySavings = 69718; // temporary hardcoded value

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

  console.log("Total Savings:", totalSavings); // Debug log

  return (
    <div className="form-container md:mt-16 mt-0">
      <div className="tabs">
        <button
          className={`tab scaling-header-text ${
            activeTab === "Solar" ? "active" : ""
          }`}
          onClick={() => setActiveTab("Solar")}
        >
          Solar
        </button>
        <button
          className={`tab scaling-header-text ${
            activeTab === "Roofing" ? "active" : ""
          }`}
          onClick={() => setActiveTab("Roofing")}
        >
          Roofing
        </button>
        <button
          className={`tab scaling-header-text ${
            activeTab === "Battery" ? "active" : ""
          }`}
          onClick={() => setActiveTab("Battery")}
        >
          Battery
        </button>
        <button
          className={`tab scaling-header-text ${
            activeTab === "HVAC" ? "active" : ""
          }`}
          onClick={() => setActiveTab("HVAC")}
        >
          HVAC
        </button>
      </div>
      <div className="mainContent">
        <div className="sidebar left-sidebar">
          {activeTab === "Solar" && solarData && (
            <div className="solar-stats">
              <h2>Solar Stats</h2>
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
            </div>
          )}
        </div>
        <div className="viewbox">
          <SolarMap panelCount={panelCount} selectedSegment={selectedSegment} />
        </div>
        <div className="sidebar">{renderContent()}</div>
      </div>
    </div>
  );
};

export default FormPage;
