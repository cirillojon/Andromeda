import Link from "next/link";
import { Button } from "../../ui/button";
import {
  Bell,
  ChevronRight,
  Grid3X3,
  Menu,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import ProfileDropdown from "./ProfileDropdown";

const DashboardNavBar = async () => {
  const user = await getKindeServerSession();
  const currentUser = await user.getUser();
  return (
    <div className="bg-gray-900 text-white py-4 px-6 flex items-center justify-between">
      <div className="md:flex hidden items-center gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
          prefetch={false}
        >
          <Grid3X3 className="w-6 h-6" />
          <span className="text-lg font-bold">Dashboard</span>
        </Link>
        <nav className="hidden md:flex gap-4">
          <Link
            href="/dashboard/projects"
            className="hover:underline"
            prefetch={false}
          >
            Projects
          </Link>
          <Link
            href="/dashboard/finances"
            className="hover:underline"
            prefetch={false}
          >
            Finances
          </Link>
          <Link
            href="/dashboard/installers"
            className="hover:underline"
            prefetch={false}
          >
            Installers
          </Link>
        </nav>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className=" text-gray-700 bg-gray-100 rounded-md left-2 hover:bg-gray-200 flex md:hidden"
          >
            <Menu className="w-6 h-6 justify-center items-center" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid text-lg font-medium mt-8">
            <div className="grid grid-cols-2 hover:bg-gray-200 rounded-md items-center pl-2">
              <SheetClose asChild>
                <Link
                  href="/dashboard"
                  className="hover:underline"
                  prefetch={false}
                >
                  Home
                </Link>
              </SheetClose>
              <ChevronRight className="ml-auto" />
            </div>
            <div className="grid grid-cols-2 hover:bg-gray-200 rounded-md items-center pl-2">
              <SheetClose asChild>
                <Link
                  href="/dashboard/projects"
                  className="hover:underline"
                  prefetch={false}
                >
                  Projects
                </Link>
              </SheetClose>
              <ChevronRight className="ml-auto" />
            </div>
            <div className="grid grid-cols-2 hover:bg-gray-200 rounded-md items-center pl-2">
              <SheetClose asChild>
                <Link
                  href="/dashboard/finances"
                  className="hover:underline"
                  prefetch={false}
                >
                  Finances
                </Link>
              </SheetClose>
              <ChevronRight className="ml-auto" />
            </div>
            <div className="grid grid-cols-2 hover:bg-gray-200 rounded-md items-center pl-2">
              <SheetClose asChild>
                <Link
                  href="/dashboard/installers"
                  className="hover:underline"
                  prefetch={false}
                >
                  Installers
                </Link>
              </SheetClose>
              <ChevronRight className="ml-auto" />
            </div>
          </nav>
          <div className="border-t border-gray-200 border-2 m-6" />
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="w-6 h-6" />
          <span className="sr-only">Notifications</span>
        </Button>
        <ProfileDropdown/>
      </div>
    </div>
  );
};

export default DashboardNavBar;

//make the logout button a client component to utilize toast
