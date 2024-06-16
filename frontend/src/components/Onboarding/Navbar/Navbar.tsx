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

const Navbar = () => {
  return (
    <div className="flex w-full flex-col">
      <header className="inset-x-0 top-0 flex items-center h-16 gap-4 bg-transparent px-4 md:px-6">
        <div className="flex items-center">
          <Image src="/assets/Logo.png" alt="logo" width={40} height={40} />
          <Link href="/" className="font-semibold text-3xl">
            <span>andromeda</span>
          </Link>
        </div>
        <nav className="hidden ml-auto flex-col gap-6 font-medium md:flex md:flex-row md:items-center md:gap-5 lg:gap-8">
          <NavMenu />
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
            <nav className="grid text-lg font-medium mt-8">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="grid grid-cols-2 hover:bg-gray-200 rounded-md items-center"
                >
                  <SheetClose asChild>
                    <Link
                      href={service.href}
                      className="flex h-8 items-center pl-2 gap-2 text-lg font-semibold "
                    >
                      {service.title}
                    </Link>
                  </SheetClose>
                  <ChevronRight className="ml-auto" />
                </div>
              ))}
            </nav>
            <div className="border-t border-gray-200 border-2 m-6" />
            <div className="py-1">
              <SheetClose asChild>
                <Link
                  href="/faq"
                  className="flex h-8 px-4 py-2  rounded-mdtext-sm text-gray-700 hover:bg-gray-100"
                >
                  FAQ
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/mission"
                  className="flex h-8 rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mission
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/contact"
                  className="flex h-8 px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                >
                  Contact
                </Link>
              </SheetClose>
              <SheetClose>
                <LoginLink className="flex h-8 px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">
                  Log in
                </LoginLink>
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
