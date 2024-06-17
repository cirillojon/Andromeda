"use client";
import Image from "next/image";
import React from "react";

interface MissionPageProps {
	setActiveSection: (value: string) => void;
}

const MissionPage: React.FC<MissionPageProps> = ({setActiveSection}) => {
  return (
    <div className="grid grid-cols-1 grid-rows-1 max-w-fit h-full md:grid-cols-2 drop-shadow-2xl mt-16">
      <div className="flex flex-col mt-16 mb-14 md:mb-0">
        <h1 className="scaling-header-text md:mb-10">Mission</h1>
        <div className="flex flex-col items-center text-left">
          <span className="scaling-text w-2/3 mt-10">
            Andromeda empowers homeowners to take control of the design,
            customization, and financing of high-value projects such as solar
            systems, batteries, roofs, and HVAC.
          </span>
          <span className="scaling-text w-2/3 mt-4">
            We aim to revolutionize the industry by using a tech-forward
            approach to end homeowner&apos;s reliance salesmen, show transparent
            financing options, and provide a client portal to track progress of
            projects.
          </span>
          <button onClick={() => setActiveSection("contact")}className="mt-10 py-2 px-4 rounded bg-indigo-400 hover:bg-indigo-600">
            Contact Us
          </button>
        </div>
      </div>
      <div className="flex md:w-full md:h-full flex-col items-end w-0 h-0">
        <Image
          src="/assets/Andromeda.png"
          alt="Andromeda Constellation"
          width={500}
          height={200}
        />
      </div>
    </div>
  );
};

export default MissionPage;
