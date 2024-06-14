"use client";

import { Button } from "@/components/ui/button";
import "@/components/Onboarding/Form/FormPage.css";

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const FormTabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
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
      <Button
        variant={activeTab === "Project Details" ? "default" : "outline"}
        onClick={() => setActiveTab("Project Details")}
      >
        Project Details
      </Button>
    </div>
  );
};

export default FormTabs;
