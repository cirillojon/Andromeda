"use client";

import React, { useState, useEffect, useRef } from "react";

import secureLocalStorage from "react-secure-storage";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import "./FormPage.css";

import { Button } from "../../ui/button";
import saveFormDataToCookies from "@/utils/actions/saveFormDataToCookies";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import SolarMap, { RoofSegment } from "./SubFormComponents/Solar/SolarMap";
import { calculateSolarPotential } from "./SubFormComponents/Solar/SolarCalculations";
import {
  SolarPanelConfig,
  SolarData,
} from "./SubFormComponents/Solar/SolarTypes";
import SolarStatsCard from "./SubFormComponents/Solar/SolarStatsCard";
import { FinancialData } from "./SubFormComponents/Solar/SolarStatsCard";

import FormTabs from "./SubFormComponents/Common/FormTabs";
import FormInputs, { InputValues } from "./SubFormComponents/Common/FormInputs";
import FinishConfigurationButton from "./SubFormComponents/Common/FinishConfigurationButton";

import DialogflowNameFlow from "./SubFormComponents/Diagflow/DialogflowNameFlow";

import {
  getHouseSquareFootage,
  maximizeSavings,
} from "./SubFormComponents/Common/FormHelpers";

import Step1 from "./SubFormComponents/Steps/Step1";
import Step2 from "./SubFormComponents/Steps/Step2";

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
  isLoggedIn: boolean;
  address: string;
}

const FormPage: React.FC<FormPageProps> = ({
  monthlyBill,
  isLoggedIn,
  address,
}) => {
  const [activeTab, setActiveTab] = useState("Solar");
  const [panelCount, setPanelCount] = useState<number>(4);
  const [solarData, setSolarData] = useState<SolarData | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [needsReload, setNeedsReload] = useState(false);
  const [financialData, setFinancialData] = useState<FinancialData | null>(
    null
  );

  const [selectedSegment, setSelectedSegment] = useState<RoofSegment | null>(
    null
  );
  const [maxPanels, setMaxPanels] = useState<number>(100);
  const [inputValues, setInputValues] = useState<InputValues>({
    solar: {
      panelCount: 10,
      energyUtilization: "",
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
    general: {
      roofSqft: 0,
      project_address: address,
      monthlyBill: monthlyBill,
    },
  });
  const [validationPassed, setValidationPassed] = useState(false);
  const authButtonRef = useRef<HTMLButtonElement>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [calculationResults, setCalculationResults] = useState<any>(null);
  const [showAllSegments, setShowAllSegments] = useState(false);
  const [maxSavings, setMaxSavings] = useState(false);

  const handleToggleHeatmap = () => {
    setShowHeatmap(!showHeatmap);
  };

  const handleFinancialDataUpdate = (data: FinancialData) => {
    setFinancialData(data);
  };

  useEffect(() => {
    const storageItem = secureLocalStorage.getItem("solarData") as string;
    if (storageItem) {
      const data = JSON.parse(storageItem);
      setSolarData(data);
      setMaxPanels(data.building_insights.solarPotential.maxArrayPanelsCount);

      // Calculate house square footage
      const roofSqft = getHouseSquareFootage(data);
      setInputValues((prevValues) => ({
        ...prevValues,
        general: { ...prevValues.general, roofSqft: roofSqft },
      }));
    }

    // Simulate manual page reload
    if (!sessionStorage.getItem("reloaded")) {
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    maximizeSavings({
      maxSavings,
      solarData,
      panelCount,
      maxPanels,
      monthlyBill,
      setCalculationResults,
      setPanelCount,
    });
  }, [maxSavings, solarData, monthlyBill, maxPanels]);

  const handlePanelCountChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>
  ) => {
    const newValue = Number((e.target as HTMLInputElement).value);
    setPanelCount(newValue);
    setMaxSavings(false);
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

  useEffect(() => {
    if (needsReload && currentStep === 1) {
      // Save current configuration
      const currentConfig = {
        panelCount,
        inputValues,
        activeTab,
        selectedSegment,
        showHeatmap,
        showAllSegments,
        maxSavings,
        calculationResults,
        maxPanels,
        validationPassed,
      };
      localStorage.setItem("currentConfig", JSON.stringify(currentConfig));

      if (!sessionStorage.getItem("reloaded")) {
        sessionStorage.setItem("reloaded", "true");
        window.location.reload();
      } else {
        setNeedsReload(false);
      }
    }
  }, [needsReload, currentStep]);

  useEffect(() => {
    const storedConfig = localStorage.getItem("currentConfig");
    if (storedConfig) {
      const config = JSON.parse(storedConfig);
      console.log("Restored config:", config);
      setPanelCount(config.panelCount);
      setInputValues(config.inputValues);
      setActiveTab(config.activeTab);
      setSelectedSegment(config.selectedSegment);
      setShowHeatmap(config.showHeatmap);
      setShowAllSegments(config.showAllSegments);
      setMaxSavings(config.maxSavings);
      setCalculationResults(config.calculationResults);
      setMaxPanels(config.maxPanels);
      setValidationPassed(config.validationPassed);

      // Clear the stored config after restoring
      localStorage.removeItem("currentConfig");
    }
  }, []);

  const handleBackToStep1 = () => {
    sessionStorage.removeItem("reloaded");
    setNeedsReload(true);
    setCurrentStep(1);
  };

  useEffect(() => {
    if (solarData) {
      const config: SolarPanelConfig =
        solarData.building_insights.solarPotential.solarPanelConfigs[0];
      const results = calculateSolarPotential(
        config,
        panelCount,
        maxPanels,
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
  }, [solarData, panelCount, monthlyBill, maxPanels]);

  const handlemaxSavingsClick = () => {
    setMaxSavings(!maxSavings);
  };

  if (!calculationResults) {
    return <div className="w-screen h-screen">Loading...</div>;
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            activeTab={activeTab}
            inputValues={inputValues}
            handlePanelCountChange={handlePanelCountChange}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            panelCount={panelCount}
            maxPanels={maxPanels}
            address={address}
            selectedSegment={selectedSegment}
            showHeatmap={showHeatmap}
            showAllSegments={showAllSegments}
            solarData={solarData}
            calculationResults={calculationResults}
            maxSavings={maxSavings}
            setMaxSavings={setMaxSavings}
            handleSegmentClick={handleSegmentClick}
            handleToggleHeatmap={handleToggleHeatmap}
            handleToggleShowAllSegments={handleToggleShowAllSegments}
            handlemaxSavingsClick={handlemaxSavingsClick}
            handleFinancialDataUpdate={handleFinancialDataUpdate}
            setCurrentStep={setCurrentStep}
          />
        );
      case 2:
        return (
          <>
            <Step2
              calculationResults={calculationResults}
              handleBackToStep1={handleBackToStep1}
              setCurrentStep={setCurrentStep}
              financialData={financialData}
            />
          </>
        );
      case 3:
        return (
          <div className="final-page">
            <h2>Create an Account</h2>
            {/* Placeholder for step 3 content */}
            <div className="flex justify-between mt-4">
              <Button onClick={() => setCurrentStep(2)} variant="outline">
                Back
              </Button>
              <FinishConfigurationButton
                isLoggedIn={isLoggedIn}
                authButtonRef={authButtonRef}
                handleSubmit={handleSubmit}
                validationPassed={validationPassed}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <FormTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        setNeedsReload={setNeedsReload}
      />
      <div className="flex-grow">{renderStepContent()}</div>
    </div>
  );
};

export default FormPage;
