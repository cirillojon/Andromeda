import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import NavMenu from "./NavMenu";

const Navbar = () => {
  return (
    <nav className="absolute z-[100] h-14 inset-x-0 top-0 w-full transition-all">
      <div className="flex h-14 justify-between px-8 pt-4 space-x-4">
        <div className="flex items-center">
          <Image src="/assets/Logo.png" alt="logo" width={40} height={40} />
          <Link href="/" className="font-semibold text-3xl">
            <span>andromeda</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <NavMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
