import React from "react";
import { Button } from "@/components/ui/button";
import SolarMap, { RoofSegment } from "../Solar/SolarMap";
import SolarStatsCard from "../Solar/SolarStatsCard";
import FormInputs, { InputValues } from "../Common/FormInputs";
import DialogflowNameFlow from "../Diagflow/DialogflowNameFlow";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SolarData } from "../Solar/SolarTypes";
import { FinancialData } from "../Solar/SolarStatsCard";

interface Step1Props {
  activeTab: string;
  inputValues: InputValues;
  handlePanelCountChange: (
    e: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>
  ) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    tab: string,
    inputName: string
  ) => void;
  handleSelectChange: (value: string, tab: string, inputName: string) => void;
  panelCount: number;
  maxPanels: number;
  address: string;
  selectedSegment: RoofSegment | null;
  showHeatmap: boolean;
  showAllSegments: boolean;
  solarData: SolarData | null;
  calculationResults: any;
  maxSavings: boolean;
  setMaxSavings: React.Dispatch<React.SetStateAction<boolean>>;
  handleSegmentClick: (
    segment: SolarData["building_insights"]["solarPotential"]["roofSegmentStats"][0]
  ) => void;
  handleToggleHeatmap: () => void;
  handleToggleShowAllSegments: () => void;
  handlemaxSavingsClick: () => void;
  handleFinancialDataUpdate: (data: FinancialData) => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const Step1: React.FC<Step1Props> = ({
  activeTab,
  inputValues,
  handlePanelCountChange,
  handleInputChange,
  handleSelectChange,
  panelCount,
  maxPanels,
  address,
  selectedSegment,
  showHeatmap,
  showAllSegments,
  solarData,
  calculationResults,
  maxSavings,
  setMaxSavings,
  handleSegmentClick,
  handleToggleHeatmap,
  handleToggleShowAllSegments,
  handlemaxSavingsClick,
  handleFinancialDataUpdate,
  setCurrentStep,
}) => {
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

        {(activeTab === "Solar" || activeTab == "Battery") && solarData && (
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
                    handleToggleShowAllSegments={handleToggleShowAllSegments}
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
      <div className="hidden lg:flex" style={{ height: "calc(100vh - 64px)" }}>
        <ResizablePanelGroup
          direction="horizontal"
          className={"flex gap-4 overflow-auto p-4"}
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
                <Button onClick={handleToggleHeatmap} className="bg-gray-900">
                  {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
                </Button>
                <Button className="bg-gray-900" onClick={handlemaxSavingsClick}>
                  Maximize Savings
                </Button>
              </div>
            </div>
          </ResizablePanel>
          {activeTab !== "Roofing" && (
            <ResizableHandle withHandle className="-m-1" />
          )}
          {activeTab !== "Roofing" && (
            <ResizablePanel defaultSize={25} className="flex flex-col w-full">
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
                            onFinancialDataUpdate={handleFinancialDataUpdate}
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
                      onClick={() => setCurrentStep(2)}
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
};

export default Step1;
