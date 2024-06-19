"use client";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { LogOutIcon } from "lucide-react";
import { toast } from "sonner";

const LogoutButtonToast = () => {
  return (
    <LogoutLink
      className="flex items-center"
      onClick={() => toast.success("Logged out!")}
    >
      <LogOutIcon className="mr-2 h-4 w-4" />
      Logout
    </LogoutLink>
  );
};

export default LogoutButtonToast;
