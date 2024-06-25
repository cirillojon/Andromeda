import { Button } from "@/components/ui/button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";

interface FinishConfigurationButtonProps {
  isLoggedIn: boolean;
  validationPassed: boolean;
  authButtonRef: React.RefObject<HTMLButtonElement>;
  handleSubmit: () => void;
}

const FinishConfigurationButton: React.FC<FinishConfigurationButtonProps> = ({
  isLoggedIn,
  validationPassed,
  authButtonRef,
  handleSubmit,
}) => {
  return (
    <>
      {isLoggedIn ? (
        <div>
          {validationPassed ? (
            <Link href="/dashboard" className="w-full bg-gray-900">
              <Button ref={authButtonRef} className="w-full bg-gray-900">
                Proceeding to Dashboard...
              </Button>
            </Link>
          ) : (
            <Button className="w-full bg-gray-900" onClick={handleSubmit}>
              Create New Project
            </Button>
          )}
        </div>
      ) : (
        <div>
          {validationPassed ? (
            <RegisterLink className="w-full bg-gray-900">
              <Button ref={authButtonRef} className="w-full bg-gray-900">
                Proceeding to Authentication...
              </Button>
            </RegisterLink>
          ) : (
            <Button className="w-full bg-gray-900" onClick={handleSubmit}>
              Save this Configuration
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default FinishConfigurationButton;
