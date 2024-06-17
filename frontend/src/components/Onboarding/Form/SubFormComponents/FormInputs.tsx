// TabContent.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface InputValues {
  solar: {
    panelCount: number;
    energyUtilization: string;
    project_name: string;
    project_type: string;
    annualIncome: string;
    project_address: string;
  };
  roofing: {
    currentRoofType: string;
    desiredRoofType: string;
    roofHealth: string;
    stories: string;
    project_name: string;
    project_type: string;
    project_address: string;
  };
  battery: {
    currentSolarSystemSize: string;
    expectedUsage: string;
    numberOfEVs: string;
    houseType: string;
    ownership: string;
    project_name: string;
    project_type: string;
    project_address: string;
  };
  general: {
    roofSqft: number;
  };
  [key: string]: any;
}

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
  handleSelectChange: (value: string, tab: string, inputName: string) => void;
  panelCount: number;
  maxPanels: number;
}

const FormInputs: React.FC<FormInputsProps> = ({
  activeTab,
  inputValues,
  handlePanelCountChange,
  handleInputChange,
  handleSelectChange,
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
            <Label htmlFor="panelCount">Solar Project Name</Label>
            <Input
              id="solarInput0"
              type="text"
              placeholder="John's Eco Home"
              value={inputValues.solar.project_name}
              onChange={(e) => handleInputChange(e, "solar", "project_name")}
            />
            <Label htmlFor="panelCount">Number of Panels</Label>
            <Input
              id="solarInput1"
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
            <Label htmlFor="solarInput2">Annual Income</Label>
            <Input
              id="solarInput2"
              type="text"
              placeholder="60,000"
              value={inputValues.annualIncome}
              onChange={(e) => handleInputChange(e, "solar", "annualIncome")}
            />
            <Label htmlFor="solarInput3">Energy Utilization - kW/month</Label>
            <Input
              id="solarInput3"
              type="text"
              placeholder="1000"
              value={inputValues.solar.energyUtilization}
              onChange={(e) =>
                handleInputChange(e, "solar", "energyUtilization")
              }
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
            <Label htmlFor="roofingInput1">Roof Project Name</Label>
            <Input
              id="roofingInput0"
              type="text"
              placeholder="John's New Roof"
              value={inputValues.roofing.project_name}
              onChange={(e) => handleInputChange(e, "roofing", "project_name")}
            />
            <Label htmlFor="roofingInput1">Current Roof Type</Label>
            <Select
              onValueChange={(value: string) =>
                handleSelectChange(value, "roofing", "currentRoofType")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Asphalt Shingles">
                    Asphalt Shingles
                  </SelectItem>
                  <SelectItem value="Metal">Metal</SelectItem>
                  <SelectItem value="Ceramic Tiles">Ceramic Tiles</SelectItem>
                  <SelectItem value="Slate Shingles">Slate Shingles</SelectItem>
                  <SelectItem value="Wood Shake Shingles">
                    Wood/Cedar Shake Shingles
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label htmlFor="roofingInput2">Desired Roof Type</Label>
            <Select
              onValueChange={(value: string) =>
                handleSelectChange(value, "roofing", "desiredRoofType")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Asphalt Shingles">
                    Asphalt Shingles
                  </SelectItem>
                  <SelectItem value="Metal">Metal</SelectItem>
                  <SelectItem value="Ceramic Tiles">Ceramic Tiles</SelectItem>
                  <SelectItem value="Slate Shingles">Slate Shingles</SelectItem>
                  <SelectItem value="Wood Shake Shingles">
                    Wood/Cedar Shake Shingles
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label htmlFor="roofingInput3">Roof Health</Label>
            <Select
              onValueChange={(value: string) =>
                handleSelectChange(value, "roofing", "roofHealth")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Needs Replacement">
                    Needs Replacement
                  </SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label htmlFor="roofingInput3">Number of Stories</Label>
            <Select
              onValueChange={(value: string) =>
                handleSelectChange(value, "roofing", "stories")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Number" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
            <Label htmlFor="batteryInput1">
              Current Solar System Size -kW-
            </Label>
            <Input
              id="batteryInput1"
              type="text"
              placeholder="10"
              value={inputValues.battery.currentSolarSystemSize}
              onChange={(e) =>
                handleInputChange(e, "battery", "currentSolarSystemSize")
              }
            />
            <Label htmlFor="batteryInput2">Expected Usage</Label>
            <Select
              onValueChange={(value: string) =>
                handleSelectChange(value, "battery", "expectedUsage")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose an Option" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Whole Home Backup">
                    Whole Home Backup
                  </SelectItem>
                  <SelectItem value="Essential Backup - 1 Day">
                    Essential Backup - 1 Day
                  </SelectItem>
                  <SelectItem value="Essential Backup - 2 Days">
                    Essential Backup - 2 Days
                  </SelectItem>
                  <SelectItem value="Essential Backup - 3 Days">
                    Essential Backup - 3 Days
                  </SelectItem>
                  <SelectItem value="Essential Backup - 4 Days">
                    Essential Backup - 4 Days
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label htmlFor="batteryInput3">Number of EVs</Label>
            <Select
              onValueChange={(value: string) =>
                handleSelectChange(value, "battery", "numberOfEVs")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Number" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label htmlFor="batteryInput3">House Type</Label>
            <Select
              onValueChange={(value: string) =>
                handleSelectChange(value, "battery", "houseType")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Single Family">Single Family</SelectItem>
                  <SelectItem value="Townhouse">Townhouse</SelectItem>
                  <SelectItem value="Condominium">Condominium</SelectItem>
                  <SelectItem value="Duplex">Duplex</SelectItem>
                  <SelectItem value="Triplex">Triplex</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label htmlFor="batteryInput3">Ownership</Label>
            <Select
              onValueChange={(value: string) =>
                handleSelectChange(value, "battery", "ownership")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Owned">Owned</SelectItem>
                  <SelectItem value="Other (lease, etc)">
                    Other (lease, etc)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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

export default FormInputs;
