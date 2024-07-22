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
import Link from "next/link";
import DialogflowNameFlow from "./SubFormComponents/DialogflowNameFlow";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import FinishConfigurationButton from "./SubFormComponents/FinishConfigurationButton";
import PricingPage from "./FormStepComponents/Pricing";
import { FinancialData } from "./SubFormComponents/SolarStatsCard";
import {
  getHouseSquareFootage,
  maximizeSavings,
} from "./SubFormComponents/FormHelpers";

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
          <div className="flex flex-col min-h-screen">
            <div className="grid lg:hidden grid-cols-1">
              <fieldset className="grid rounded-lg border p-4 mb-4 mt-2">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Personalization
                </legend>
                <FormInputs
                  activeTab={activeTab}
                  inputValues={inputValues}
                  handlePanelCountChange={handlePanelCountChange}
                  handleInputChange={handleInputChange}
                  handleSelectChange={handleSelectChange}
                  panelCount={panelCount}
                  maxPanels={maxPanels}
                />
              </fieldset>
              <div className="relative flex h-full mx-8 min-h-[70vh] flex-col rounded-lg bg-muted/50">
                <SolarMap
                  panelCount={panelCount}
                  selectedSegment={selectedSegment}
                  showHeatmap={showHeatmap}
                  showAllSegments={showAllSegments}
                  address={address}
                />
              </div>
              <div className="mt-6 flex justify-center space-x-8 mx-8">
                <Button
                  onClick={handleToggleHeatmap}
                  className="bg-gray-900 py-3 w-full"
                >
                  {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
                </Button>
                <Button
                  className="bg-gray-900 py-3 w-full mr-32"
                  onClick={handlemaxSavingsClick}
                >
                  Maximize Savings
                </Button>
              </div>

              {(activeTab === "Solar" || activeTab == "Battery") &&
                solarData && (
                  <div className="relative flex flex-col items-start mb-4 mt-4">
                    <form className="grid w-full items-start">
                      <fieldset className="grid rounded-lg border p-4">
                        {activeTab == "Battery" && (
                          <legend className="-ml-1 px-1 text-sm font-medium">
                            Battery Options
                          </legend>
                        )}
                        {activeTab == "Solar" && (
                          <legend className="-ml-1 px-1 text-sm font-medium">
                            Configuration Breakdown
                          </legend>
                        )}
                        {activeTab === "Solar" && (
                          <SolarStatsCard
                            solarData={solarData}
                            panelCount={panelCount}
                            maxPanels={maxPanels}
                            handleSegmentClick={handleSegmentClick}
                            handleToggleHeatmap={handleToggleHeatmap}
                            showHeatmap={showHeatmap}
                            calculationResults={calculationResults}
                            handleToggleShowAllSegments={
                              handleToggleShowAllSegments
                            }
                            showAllSegments={showAllSegments}
                            maxSavings={maxSavings}
                            setMaxSavings={setMaxSavings}
                            onFinancialDataUpdate={handleFinancialDataUpdate}
                          />
                        )}
                      </fieldset>
                    </form>
                  </div>
                )}
              <div className="mt-4">
                <Button
                  className="w-full bg-gray-900 mb-4"
                  onClick={() => setCurrentStep(2)}
                >
                  Go to Pricing Page
                </Button>
              </div>
            </div>
            <div
              className="hidden lg:flex"
              style={{ height: "calc(100vh - 64px)" }}
            >
              <ResizablePanelGroup
                direction="horizontal"
                className={"flex gap-4 overflow-auto p-4"}
                //The grid cols aren't doing anything with the resizeable panels
              >
                <ResizablePanel
                  defaultSize={activeTab === "Roofing" ? 50 : 25}
                  className="relative flex flex-col items-start"
                >
                  <ResizablePanelGroup direction="vertical">
                    <ResizablePanel className="-mb-6">
                      <fieldset className="grid rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">
                          Personalization
                        </legend>
                        <FormInputs
                          activeTab={activeTab}
                          inputValues={inputValues}
                          handlePanelCountChange={handlePanelCountChange}
                          handleInputChange={handleInputChange}
                          handleSelectChange={handleSelectChange}
                          panelCount={panelCount}
                          maxPanels={maxPanels}
                        />
                      </fieldset>
                    </ResizablePanel>
                    <ResizableHandle withHandle className="mb-2" />
                    <ResizablePanel className="pb-1 pr-[2px]" defaultSize={50}>
                      <DialogflowNameFlow />
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </ResizablePanel>
                <ResizableHandle withHandle className="-m-1" />
                <ResizablePanel defaultSize={50}>
                  <div className="grid grid-rows-[5fr_1fr] flex-grow h-full min-h-[70vh] flex-col rounded-lg bg-muted/50">
                    <div>
                      <SolarMap
                        panelCount={panelCount}
                        selectedSegment={selectedSegment}
                        showHeatmap={showHeatmap}
                        showAllSegments={showAllSegments}
                        address={address}
                      />
                    </div>
                    <div className="button-container mt-6">
                      <Button
                        onClick={handleToggleHeatmap}
                        className="bg-gray-900"
                      >
                        {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
                      </Button>
                      <Button
                        className="bg-gray-900"
                        onClick={handlemaxSavingsClick}
                      >
                        Maximize Savings
                      </Button>
                    </div>
                  </div>
                </ResizablePanel>
                {activeTab !== "Roofing" && (
                  <ResizableHandle withHandle className="-m-1" />
                )}
                {activeTab !== "Roofing" && (
                  <ResizablePanel
                    defaultSize={25}
                    className="flex flex-col w-full"
                  >
                    {(activeTab === "Solar" || activeTab == "Battery") &&
                      solarData && (
                        <div className="relative flex flex-col items-start">
                          <form className="grid w-full items-start">
                            <fieldset className="grid rounded-lg border p-4">
                              {activeTab == "Battery" && (
                                <legend className="-ml-1 px-1 text-sm font-medium">
                                  Battery Options
                                </legend>
                              )}
                              {activeTab == "Solar" && (
                                <legend className="-ml-1 px-1 text-sm font-medium">
                                  Configuration Breakdown
                                </legend>
                              )}
                              {activeTab === "Solar" && (
                                <SolarStatsCard
                                  solarData={solarData}
                                  panelCount={panelCount}
                                  maxPanels={maxPanels}
                                  handleSegmentClick={handleSegmentClick}
                                  handleToggleHeatmap={handleToggleHeatmap}
                                  showHeatmap={showHeatmap}
                                  calculationResults={calculationResults}
                                  handleToggleShowAllSegments={
                                    handleToggleShowAllSegments
                                  }
                                  showAllSegments={showAllSegments}
                                  maxSavings={maxSavings}
                                  setMaxSavings={setMaxSavings}
                                  onFinancialDataUpdate={
                                    handleFinancialDataUpdate
                                  }
                                />
                              )}
                            </fieldset>
                          </form>
                        </div>
                      )}
                    <div className="flex w-full justify-end mt-auto">
                      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 pb-4 bottom-2">
                        <div className="space-y-4">
                          <Button
                            className="w-full bg-gray-900 mb-4"
                            onClick={() => {
                              setCurrentStep(2);
                            }}
                          >
                            Go to Pricing Page
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ResizablePanel>
                )}
              </ResizablePanelGroup>
            </div>
          </div>
        );
      case 2:
        return (
          <>
            <PricingPage
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
