"use client";

import React, { useState, useEffect, useRef } from "react";
import "./FormPage.css";
import SolarMap, { RoofSegment } from "./SolarMap";
import secureLocalStorage from "react-secure-storage";
import { calculateSolarPotential } from "./SolarCalculations";
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
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import saveFormDataToCookies from "@/utils/actions/saveFormDataToCookies";
import { SolarPanelConfig, SolarData } from "./SolarTypes";
import FormTabs from "./SubFormComponents/FormTabs";
import SolarStatsCard from "./SubFormComponents/SolarStatsCard";
import FormInputs from "./SubFormComponents/FormInputs";
import { InputValues } from "./SubFormComponents/FormInputs";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

interface FormPageProps {
  monthlyBill: number;
}

const FormPage: React.FC<FormPageProps> = ({ monthlyBill }) => {
  const [activeTab, setActiveTab] = useState("Solar");
  const [panelCount, setPanelCount] = useState<number>(10);
  const [solarData, setSolarData] = useState<SolarData | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<RoofSegment | null>(
    null
  );
  const [inputValues, setInputValues] = useState<InputValues>({
    solar: {
      panelCount: 10,
      energyUtilization: 1.5,
      project_name: "",
      project_type: "solar",
      annualIncome: "",
    },
    roofing: {
      currentRoofType: "",
      desiredRoofType: "",
      roofHealth: "",
      stories: "1",
      project_name: "",
      project_type: "roof",
    },
    battery: {
      currentSolarSystemSize: "",
      expectedUsage: "",
      numberOfEVs: "",
      houseType: "",
      ownership: "",
      project_name: "",
      project_type: "battery",
    },
  });
  const [validationPassed, setValidationPassed] = useState(false);
  const authButtonRef = useRef<HTMLButtonElement>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [calculationResults, setCalculationResults] = useState<any>(null);
  const [showAllSegments, setShowAllSegments] = useState(false);

  const handleToggleHeatmap = () => {
    setShowHeatmap(!showHeatmap);
  };

  useEffect(() => {
    const storageItem = secureLocalStorage.getItem("solarData") as string;
    if (storageItem) {
      const data = JSON.parse(storageItem);
      setSolarData(data);
    }

    // Simulate manual page reload
    if (!sessionStorage.getItem("reloaded")) {
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    }
  }, []);

  const handlePanelCountChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>
  ) => {
    const newValue = Number((e.target as HTMLInputElement).value);
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

  const handleSelectChange = (
    value: string,
    tab: string,
    inputName: string
  ) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [tab]: { ...prevValues[tab], [inputName]: value },
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
        stats: {
          areaMeters2: 0,
          groundAreaMeters2: 0,
          sunshineQuantiles: [],
        },
      };
      setSelectedSegment(roofSegment);
    }
  };

  const handleToggleShowAllSegments = () => {
    setShowAllSegments((prevShowAllSegments) => !prevShowAllSegments);
  };

  const validateFields = () => {
    const { project_name, project_type } = inputValues.project_details;
    return project_name.trim() !== "" && project_type.trim() !== "";
  };

  useEffect(() => {
    if (validationPassed) {
      // If validation is passed, click the authentication button
      authButtonRef.current?.click();
    }
  }, [validationPassed]);

  const handleSubmit = async () => {
    /*
    if (!validateFields()) {
      alert(
        "Please fill in all required fields in the Project Details section."
      );
      setValidationPassed(false);
      return;
    }*/
    await saveFormDataToCookies(JSON.stringify(inputValues));
    console.log("Form data saved to local storage:", inputValues);
    setValidationPassed(true); // Set the flag to true on successful validation
  };

  const maxPanels = 110;

  useEffect(() => {
    if (solarData) {
      const config: SolarPanelConfig =
        solarData.building_insights.solarPotential.solarPanelConfigs[0];
      const results = calculateSolarPotential(
        config,
        panelCount,
        Number(monthlyBill), // Use the monthly bill from the props
        0.31, // Example energy cost per kWh
        0.85, // Example DC to AC derate factor
        7000, // Example solar incentives
        4.0, // Example installation cost per watt
        20, // Example installation lifespan
        solarData.building_insights.solarPotential.panelCapacityWatts
      );
      setCalculationResults(results);
    }
  }, [solarData, panelCount, monthlyBill]);

  if (!calculationResults) {
    return <div className="w-screen h-screen">Loading...</div>;
  }

  return (
    <div className="form-container md:mt-16 mt-0">
      <FormTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mainContent">
        <div className="sidebar left-sidebar">
          {activeTab === "Solar" && solarData && (
            <SolarStatsCard
              solarData={solarData}
              panelCount={panelCount}
              maxPanels={maxPanels}
              handleSegmentClick={handleSegmentClick}
              handleToggleHeatmap={handleToggleHeatmap}
              showHeatmap={showHeatmap}
              calculationResults={calculationResults}
              handleToggleShowAllSegments={handleToggleShowAllSegments}
              showAllSegments={showAllSegments}
            />
          )}
        </div>
        <div className="viewbox">
          <SolarMap
            panelCount={panelCount}
            selectedSegment={selectedSegment}
            showHeatmap={showHeatmap}
            showAllSegments={showAllSegments}
          />
        </div>
        <div className="sidebar">
          <FormInputs
            activeTab={activeTab}
            inputValues={inputValues}
            handlePanelCountChange={handlePanelCountChange}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            panelCount={panelCount}
            maxPanels={maxPanels}
          />
          {validationPassed ? (
            <RegisterLink className="w-full">
              <Button ref={authButtonRef}>
                Proceeding to Authentication...
              </Button>
            </RegisterLink>
          ) : (
            <Button onClick={handleSubmit}>Submit</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormPage;
