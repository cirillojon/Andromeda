"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavMenu from "./NavMenu";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

interface NavbarProps {
  isLoggedIn: boolean;
  setActiveSection: (value: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setActiveSection, isLoggedIn }) => {
  return (
    <div className="absolute w-full flex-col">
      <header className="inset-x-0 top-0 flex items-center h-16 gap-4 bg-transparent px-4 md:px-6">
        <div className="flex items-center">
          <Image src="/assets/Logo.png" alt="logo" width={40} height={40} />
          <Link href="/" className="font-semibold text-3xl">
            <span>andromeda</span>
          </Link>
        </div>
        <nav className="hidden ml-auto flex-col gap-6 font-medium md:flex md:flex-row md:items-center md:gap-5 lg:gap-8">
          <NavMenu
            setActiveSection={setActiveSection}
            isLoggedIn={isLoggedIn}
          />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className=" text-gray-700 bg-gray-100 rounded-md ml-auto hover:bg-gray-200 flex md:hidden"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col text-lg font-medium mt-8">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="flex hover:bg-gray-200 rounded-md items-center"
                >
                  <SheetClose asChild>
                    <Link
                      href={service.href}
                      className="flex-1 h-8 w-full items-center pl-2 gap-2 text-lg font-semibold "
                    >
                      {service.title}
                    </Link>
                  </SheetClose>
                  <ChevronRight className="ml-auto flex" />
                </div>
              ))}
            </nav>
            <div className="border-t border-gray-200 border-2 m-6" />
            <div className="py-1">
              <SheetClose asChild>
                <button
                  onClick={() => setActiveSection("faq")}
                  className="flex h-8 rounded-md items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  FAQ
                </button>
              </SheetClose>
              <SheetClose asChild>
                <button
                  onClick={() => setActiveSection("mission")}
                  className="flex h-8 rounded-md items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mission
                </button>
              </SheetClose>
              <SheetClose asChild>
                <button
                  onClick={() => setActiveSection("contact")}
                  className="flex h-8 rounded-md items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Contact
                </button>
              </SheetClose>
              <SheetClose asChild>
                {isLoggedIn ? (
                  <Link href="/dashboard" className="w-full">
                    <Button className="flex h-8 px-4 py-2 items-center rounded-md text-sm text-gray-700 hover:bg-gray-100">
                      My Dashboard
                    </Button>
                  </Link>
                ) : (
                  <LoginLink className="flex h-8 px-4 py-2 items-center rounded-md text-sm text-gray-700 hover:bg-gray-100">
                    Log In
                  </LoginLink>
                )}
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </div>
  );
};

const services = [
  {
    title: "Solar",
    href: "/",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "HVAC",
    href: "/",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Roofing",
    href: "/",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Batteries",
    href: "/",
    description: "Visually or semantically separates content.",
  },
];

export default Navbar;
