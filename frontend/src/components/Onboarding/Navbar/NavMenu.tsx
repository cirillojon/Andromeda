"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu";
import { Button } from "@/components/ui/button";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

interface NavMenuProps {
  setActiveSection: (value: string) => void;
}

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

const handlePointerEvents = (event: any) => {
  event.preventDefault();
};

const NavMenu: React.FC<NavMenuProps> = ({ setActiveSection}) => {
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-3 lg:gap-6">
        <NavigationMenuItem>
          <NavigationMenuTrigger
            onPointerMove={handlePointerEvents}
            className="bg-transparent"
          >
            Services
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-3 p-4 md:w-[300px] grid-cols-1 lg:w-[350px]">
              {services.map((service) => (
                <ListItem
                  key={service.title}
                  title={service.title}
                  href={service.href}
                >
                  {service.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button variant={"ghost"} onClick={() => setActiveSection("faq")}>FAQ</Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button variant={"ghost"} onClick={()=> setActiveSection("mission")}>Mission</Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
            <Button variant={"ghost"} onClick={() => setActiveSection("contact")}>Contact</Button>
        </NavigationMenuItem>
        <NavigationMenuItem className={navigationMenuTriggerStyle()}>
          <LoginLink>
            Log In
          </LoginLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

interface ListItemProps {
  className?: string;
  title: string;
  href: string;
  children: React.ReactNode;
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

export default NavMenu;
