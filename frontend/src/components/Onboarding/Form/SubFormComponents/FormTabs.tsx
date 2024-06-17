"use client";

import { Button } from "@/components/ui/button";
import "@/components/Onboarding/Form/FormPage.css";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import Link from "next/link";

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoggedIn: boolean;
}

const FormTabs: React.FC<TabsProps> = ({
  activeTab,
  setActiveTab,
  isLoggedIn,
}) => {
  return (
    <div className="w-full flex flex-col">
      <nav className="flex bg-gray-900 p-4 shadow-md space-x-4">
        <div className="flex items-center">
          <Image src="/assets/Logo.png" alt="logo" width={40} height={40} />
          <Link href="/" className="font-semibold text-3xl text-white">
            <span>andromeda</span>
          </Link>
        </div>
        <div className="flex-1 flex justify-center space-x-4">
          <h1 className="flex items-center font-bold text-white mr-4">
            Project Types:
          </h1>
          <Button
            onClick={() => setActiveTab("Solar")}
            className={
              activeTab === "Solar"
                ? "bg-gray-600 text-white hover:bg-gray-800"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }
          >
            Solar
          </Button>
          <Button
            className={
              activeTab === "Roofing"
                ? "bg-gray-600 text-white hover:bg-gray-800"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }
            onClick={() => setActiveTab("Roofing")}
          >
            Roofing
          </Button>
          <Button
            className={
              activeTab === "Battery"
                ? "bg-gray-600 text-white hover:bg-gray-800"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }
            onClick={() => setActiveTab("Battery")}
          >
            Battery
          </Button>
          <Button
            className={
              activeTab === "HVAC"
                ? "bg-gray-600 text-white hover:bg-gray-800"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }
            onClick={() => setActiveTab("HVAC")}
          >
            HVAC
          </Button>
        </div>
        {isLoggedIn ? (
          <Link href="/dashboard">
            <Button className="text-gray-900 bg-gray-100 hover:bg-gray-500">
              My Dashboard
            </Button>
          </Link>
        ) : (
          <nav className="flex justify-end ml-auto">
            <LoginLink>
              <Button className="right-4 text-gray-900 bg-gray-200 hover:bg-gray-500">
                Login
              </Button>
            </LoginLink>
          </nav>
        )}
      </nav>
    </div>
  );
};

export default FormTabs;
