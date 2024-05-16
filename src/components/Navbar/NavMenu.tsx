"use client";
import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/Navbar/navigation-menu";

const services: { title: string; href: string; description: string }[] = [
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

const NavMenu = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger onPointerMove={(event) => event.preventDefault()}
            onPointerLeave={(event) => event.preventDefault()}
            className="bg-transparent">
            Services
          </NavigationMenuTrigger>
          <NavigationMenuContent onPointerMove={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}className="">
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
          <NavigationMenuTrigger className="bg-transparent">
            Mission
          </NavigationMenuTrigger>
          <NavigationMenuContent></NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/contact" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Contact
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
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
});
ListItem.displayName = "ListItem";

export default NavMenu;
