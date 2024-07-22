import React from "react";
import { Button } from "@/components/ui/button";
import FinishConfigurationButton from "../Common/FinishConfigurationButton";

interface Step3Props {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  isLoggedIn: boolean;
  authButtonRef: React.RefObject<HTMLButtonElement>;
  handleSubmit: () => void;
  validationPassed: boolean;
}

const Step3: React.FC<Step3Props> = ({
  setCurrentStep,
  isLoggedIn,
  authButtonRef,
  handleSubmit,
  validationPassed,
}) => {
  return (
    <div className="final-page">
      <h2>Create an Account</h2>
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
};

export default Step3;
