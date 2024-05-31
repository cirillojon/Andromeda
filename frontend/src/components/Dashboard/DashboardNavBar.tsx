import Link from "next/link";
import { Button } from "../ui/button";
import { Bell, Grid3X3 } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const DashboardNavBar = async() => {
  const user = await getKindeServerSession();
  const currentUser = await user.getUser();
  return (
    <div className="bg-gray-900 text-white py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
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
      <div className="flex items-center gap-4">
        <span>
          Welcome, {currentUser?.given_name}
        </span>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="w-6 h-6" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full bg-white">
          <span className="sr-only">User menu</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardNavBar;
