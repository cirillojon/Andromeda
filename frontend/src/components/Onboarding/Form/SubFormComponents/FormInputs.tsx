// TabContent.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputValues } from "../SolarTypes";

interface FormInputsProps {
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
  panelCount: number;
  maxPanels: number;
}

const FormInputs: React.FC<FormInputsProps> = ({
  activeTab,
  inputValues,
  handlePanelCountChange,
  handleInputChange,
  panelCount,
  maxPanels,
}) => {
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
            <input
              type="range"
              min="1"
              max={maxPanels}
              value={panelCount}
              onInput={(e) => handlePanelCountChange(e)}
              className="slider"
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
    case "Project Details":
      return (
        <Card className="content">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="detailsInput1">Project Name</Label>
            <Input
              id="detailsInput1"
              type="text"
              placeholder="Project Name"
              value={inputValues.project_details.project_name}
              onChange={(e) =>
                handleInputChange(e, "project_details", "project_name")
              }
            />
            <Label htmlFor="detailsInput2">Project Type</Label>
            <Input
              id="detailsInput2"
              type="text"
              placeholder="Project Type"
              value={inputValues.project_details.project_type}
              onChange={(e) =>
                handleInputChange(e, "project_details", "project_type")
              }
            />
          </CardContent>
        </Card>
      );
    default:
      return null;
  }
};

export default FormInputs;