"use client";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import React from 'react';
import ScrollingContent from "./ScrollingContent"
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { cn } from "@/lib/utils";

const LandingPage = () => {
  
  const handleImageLoad = () => {
    console.log(document.documentElement.attributes);
    document.documentElement.classList.add('loaded')
  };

  return (
    <div>
      <div className="grid grid-cols-1 grid-rows-1 items-center justify-center max-w-fit h-full md:grid-cols-2 drop-shadow-2xl">
        <div className="flex flex-col w-full mt-0 mb-14 md:mb-0">
            <h1 className="scaling-header-text">
              Empowering{" "}
              <span className="text-gradient text-green-600">You</span>
            </h1>
            <h1 className="scaling-header-text">
              To Take{" "}
              <span className="text-gradient text-blue-400">Control</span>
            </h1>
            <h1 className="scaling-header-text">
              Of Your{" "}
              <span className="text-gradient text-purple-600">Home</span>
            </h1>
          <div className="flex flex-col items-center text-center">
            <span className="scaling-text w-2/3 mt-8">
              Tech-driven approach that focuses on delivering a seamless,
              cost-effective, and sustainable home improvement experience for
              every homeowner.
            </span>
          </div>
          <div className="flex flex-col items-center mb-6 md:mb-0">
            <RegisterLink
              className={cn(buttonVariants({ variant: "default" }), "mt-4")}
            >
              Get Started
            </RegisterLink>
            <a href="/waitlist">
              <button className="bg-black text-white py-2 px-4 rounded hover:bg-gray-600 mt-4">
                Join Waitlist
              </button>
            </a>
          </div>
        </div>
        <div className="flex flex-col h-full md:h-screen items-center justify-center bg-gradient-to-t from-transparent to-indigo-200 mb-20 md:mb-0">
          <div>
            <h1 className="scaling-header-text blatant">
              One Stop Solution
            </h1>
          </div>
          <div className="flex flex-col text-center items-center">
            <span className="mt-2 blatant scaling-text">
              Design, customize, and order your own <br />
              solar system, roof, and HVAC.
            </span>
          </div>
          <div className="flex flex-col items-center -mt-32 -mb-36">
            <div className="flex items-center">
              <Image
                src="/assets/hero/Hero-House.png"
                alt="House"
                width={500}
                height={20}
                onLoad={handleImageLoad} /* Prevent scrolling until image loads */
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <ScrollingContent sections={sections}/>
      </div>
    </div>
  );
};

export default LandingPage;

const sections = [["/assets/services/Solar-showcase.jpeg", "Solar Systems", "Design your own solar system and get it installed for $0 down."],
                  ["/assets/services/HVAC-showcase.png", "HVAC", "Upgrade your air conditioning unit today!"],
                  ["/assets/services/roof-showcase.avif", "Roofing", "Combine a roof rennovation with a solar system and get a bigger discount. Or design your roof from scratch."],
                  ["/assets/services/batteries-showcase.webp", "Batteries", "Backup your entire house with batteries that will keep you running for days."]];