import { Button } from "@/components/ui/button";
import "@/components/Onboarding/Form/FormPage.css";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoggedIn: boolean;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const FormTabs: React.FC<TabsProps> = ({
  activeTab,
  setActiveTab,
  isLoggedIn,
  currentStep,
  setCurrentStep,
}) => {
  const totalSteps = 3;

  return (
    <div className="w-full flex flex-col">
      <nav className="flex bg-gray-900 justify-between shadow-md sm:space-x-4 md:space-x-0 lg:space-x-4 p-4">
        <div className="flex items-center">
          <Image src="/assets/Logo.png" alt="logo" width={40} height={40} />
          <Link
            href="/"
            className="font-semibold text-2xl lg:text-3xl text-white"
          >
            <span>andromeda</span>
          </Link>
        </div>
        <div className="flex-1 justify-center space-x-2 lg:space-x-4 hidden md:flex">
          <h1 className="flex items-center font-bold text-white mr-2 lg:mr-4">
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
        <div className="hidden md:flex">
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
        </div>
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="text-gray-700 flex bg-gray-100 rounded-md md:hidden hover:bg-gray-300"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="mt-8">
                <SheetClose asChild>
                  <button
                    onClick={() => setActiveTab("Solar")}
                    className="flex h-8 rounded-md items-center px-4 py-4 text-xl text-gray-700 hover:bg-gray-100"
                  >
                    Solar
                  </button>
                </SheetClose>
                <SheetClose asChild>
                  <button
                    onClick={() => setActiveTab("Roofing")}
                    className="flex h-8 rounded-md items-center px-4 py-4 text-xl text-gray-700 hover:bg-gray-100"
                  >
                    Roofing
                  </button>
                </SheetClose>
                <SheetClose asChild>
                  <button
                    onClick={() => setActiveTab("Battery")}
                    className="flex h-8 rounded-md items-center px-4 py-4 text-xl text-gray-700 hover:bg-gray-100"
                  >
                    Battery
                  </button>
                </SheetClose>
                <div className="py-2 border-t-2 border-gray-300 h-0" />
                <SheetClose asChild>
                  {isLoggedIn ? (
                    <Link href="/dashboard" className="w-full">
                      <Button className="flex h-8 px-4 py-2 bg-white items-center rounded-md text-xl text-gray-700 hover:bg-gray-100">
                        My Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <LoginLink className="flex h-8 px-4 py-2 items-center rounded-md text-xl text-gray-700 hover:bg-gray-100">
                      Log In
                    </LoginLink>
                  )}
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setCurrentStep(1)}
            className={currentStep === 1 ? "bg-gray-600" : "bg-gray-900"}
          >
            Step 1
          </Button>
          <Button
            onClick={() => setCurrentStep(2)}
            className={currentStep === 2 ? "bg-gray-600" : "bg-gray-900"}
          >
            Step 2
          </Button>
          <Button
            onClick={() => setCurrentStep(3)}
            className={currentStep === 3 ? "bg-gray-600" : "bg-gray-900"}
          >
            Step 3
          </Button>
        </div>
      </nav>
      <div className="progress-bar">
        <div className="progress">
          <div
            className="progress-filled"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          >
            Step {currentStep} of {totalSteps}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormTabs;
