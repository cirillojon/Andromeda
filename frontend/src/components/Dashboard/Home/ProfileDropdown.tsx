"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LogoutButtonToast from "@/components/Dashboard/Home/LogoutButtonToast";
import { SettingsIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ProfileDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const handleSettingsClick = () => {
    setDropdownOpen(false);
    router.push("/dashboard/settings");
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    router.push("/dashboard/profile");
  };

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <button onClick={() => setDropdownOpen(!dropdownOpen)}>
          <Avatar className="h-9 w-9 bg-white text-gray-900">
            <AvatarFallback>
                <UserIcon/>
            </AvatarFallback>
            <span className="sr-only">Toggle user menu</span>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <button className="flex items-center" onClick={handleProfileClick}>
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button className="flex items-center" onClick={handleSettingsClick}>
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="focus:bg-red-400">
          <LogoutButtonToast />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
