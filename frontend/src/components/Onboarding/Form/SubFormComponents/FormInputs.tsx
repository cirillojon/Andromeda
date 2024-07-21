import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
  };
  roofing: {
    currentRoofType: string;
    desiredRoofType: string;
    roofHealth: string;
    stories: string;
    project_name: string;
    project_type: string;
  };
  battery: {
    currentSolarSystemSize: string;
    expectedUsage: string;
    numberOfEVs: string;
    houseType: string;
    ownership: string;
    project_name: string;
    project_type: string;
  };
  general: {
    roofSqft: number;
    project_address: string;
    monthlyBill: number;
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
        <div>
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
            value={panelCount}
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
            type="number"
            placeholder="60000"
            value={inputValues.solar.annualIncome}
            onChange={(e) => handleInputChange(e, "solar", "annualIncome")}
          />
          <Label htmlFor="solarInput3">Energy Utilization - kW/month</Label>
          <Input
            id="solarInput3"
            type="number"
            placeholder="1000"
            value={inputValues.solar.energyUtilization}
            onChange={(e) => handleInputChange(e, "solar", "energyUtilization")}
          />
        </div>
      );
    case "Roofing":
      return (
        <>
          <Label htmlFor="roofingInput1" className="pb-2">
            Roof Project Name
          </Label>
          <Input
            id="roofingInput0"
            type="text"
            placeholder="John's New Roof"
            value={inputValues.roofing.project_name}
            onChange={(e) => handleInputChange(e, "roofing", "project_name")}
            className="mb-2"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="roofingInput1" className="pb-2">
                Current Roof Type
              </Label>
              <Select
                value={inputValues.roofing.currentRoofType}
                onValueChange={(value: string) =>
                  handleSelectChange(value, "roofing", "currentRoofType")
                }
              >
                <SelectTrigger className="w-full mb-2">
                  <SelectValue placeholder="Select a Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Asphalt Shingles">
                      Asphalt Shingles
                    </SelectItem>
                    <SelectItem value="Metal">Metal</SelectItem>
                    <SelectItem value="Ceramic Tiles">Ceramic Tiles</SelectItem>
                    <SelectItem value="Slate Shingles">
                      Slate Shingles
                    </SelectItem>
                    <SelectItem value="Wood Shake Shingles">
                      Wood/Cedar Shake Shingles
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Label htmlFor="roofingInput2" className="pb-2">
                Desired Roof Type
              </Label>
              <Select
                value={inputValues.roofing.desiredRoofType}
                onValueChange={(value: string) =>
                  handleSelectChange(value, "roofing", "desiredRoofType")
                }
              >
                <SelectTrigger className="w-full mb-2">
                  <SelectValue placeholder="Select a Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Asphalt Shingles">
                      Asphalt Shingles
                    </SelectItem>
                    <SelectItem value="Metal">Metal</SelectItem>
                    <SelectItem value="Ceramic Tiles">Ceramic Tiles</SelectItem>
                    <SelectItem value="Slate Shingles">
                      Slate Shingles
                    </SelectItem>
                    <SelectItem value="Wood Shake Shingles">
                      Wood/Cedar Shake Shingles
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="roofingInput3" className="pb-2">
                Roof Health
              </Label>
              <Select
                value={inputValues.roofing.roofHealth}
                onValueChange={(value: string) =>
                  handleSelectChange(value, "roofing", "roofHealth")
                }
              >
                <SelectTrigger className="w-full mb-2">
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
              <Label htmlFor="roofingInput3" className="pb-2">
                Number of Stories
              </Label>
              <Select
                value={inputValues.roofing.stories}
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
            </div>
          </div>
        </>
      );
    case "Battery":
      return (
        <>
          <Label htmlFor="batteryInput0" className="pb-2">
            Battery Project Name
          </Label>
          <Input
            id="batteryInput0"
            type="text"
            placeholder="John's Big Battery"
            value={inputValues.battery.project_name}
            onChange={(e) => handleInputChange(e, "battery", "project_name")}
            className="mb-2"
          />
          <Label htmlFor="batteryInput1" className="pb-2">
            Current Solar System Size -kW-
          </Label>
          <Input
            id="batteryInput1"
            type="number"
            placeholder="10"
            value={inputValues.battery.currentSolarSystemSize}
            onChange={(e) =>
              handleInputChange(e, "battery", "currentSolarSystemSize")
            }
            className="mb-2"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="batteryInput2" className="pb-2">
                Expected Usage
              </Label>
              <Select
                value={inputValues.battery.expectedUsage}
                onValueChange={(value: string) =>
                  handleSelectChange(value, "battery", "expectedUsage")
                }
              >
                <SelectTrigger className="w-full mb-2">
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
              <Label htmlFor="batteryInput3" className="pb-2">
                Number of EVs
              </Label>
              <Select
                value={inputValues.battery.numberOfEVs}
                onValueChange={(value: string) =>
                  handleSelectChange(value, "battery", "numberOfEVs")
                }
              >
                <SelectTrigger className="w-full mb-2">
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
            </div>
            <div>
              <Label htmlFor="batteryInput3" className="pb-2">
                House Type
              </Label>
              <Select
                value={inputValues.battery.houseType}
                onValueChange={(value: string) =>
                  handleSelectChange(value, "battery", "houseType")
                }
              >
                <SelectTrigger className="w-full mb-2">
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
              <Label htmlFor="batteryInput3" className="pb-2">
                Ownership
              </Label>
              <Select
                value={inputValues.battery.ownership}
                onValueChange={(value: string) =>
                  handleSelectChange(value, "battery", "ownership")
                }
              >
                <SelectTrigger className="w-full mb-2">
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
            </div>
          </div>
        </>
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
