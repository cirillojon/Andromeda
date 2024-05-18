import Image from "next/image";
import { Button } from "@/components/ui/button";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import React, { useEffect, useRef, useState } from 'react';
import useIntersectionObserver from "./useIntersectionObserver";
import StickyImage from "./StickyImage"
import ScrollingContent from "./ScrollingContent"

function LandingPage() {
  // IntersectionObserver
  // const containerRef = useRef(null)

  // const [isSticky, setIsSticky] = useState(false);
  // const imageRef = useRef<HTMLImageElement | null>(null);

  // const { setElements } = useIntersectionObserver((entries) => {
  //   entries.forEach((entry) => {
  //     if (entry.isIntersecting) {
  //       setIsSticky(true);
  //     } else {
  //       setIsSticky(false);
  //     }
  //   });
  // });

  // useEffect(() => {
  //   if (imageRef.current) {
  //     setElements([imageRef.current]);
  //   }
  // }, [setElements]);
  const sections = [
    'Section 1: Lorem ipsum dolor sit amet...',
    'Section 2: Consectetur adipiscing elit...',
    'Section 3: Integer nec odio...',
    // Add as many sections as you need
  ];
  
  return (
    <div>
      <div className="grid grid-cols-1 grid-rows-1 items-center justify-center max-w-fit h-full md:grid-cols-2 drop-shadow-2xl">
        <div className="flex flex-col w-full mt-24 md:mt-0 mb-14 md:mb-0">
          <div className="flex flex-col text-center items-center">
            <h1 className="text-3xl lg:text-6xl md:text-5xl sm:text-3xl w-2/3 ">
              Empowering{" "}
              <span className="text-gradient text-green-600">You</span>
            </h1>
            <h1 className="text-3xl lg:text-6xl md:text-5xl sm:text-3xl w-2/3 ">
              To Take{" "}
              <span className="text-gradient text-blue-400">Control</span>
            </h1>
            <h1 className="text-3xl lg:text-6xl md:text-5xl sm:text-3xl w-2/3 ">
              Of <span className="text-gradient text-yellow-500">Your</span>{" "}
              <span className="text-gradient text-purple-600">Home</span>
            </h1>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="w-2/3 mt-8">
              Tech-driven approach that focuses on delivering a seamless,
              cost-effective, and sustainable home improvement experience for
              every homeowner
            </span>
          </div>
          <div className="flex flex-col items-center mb-6 md:mb-0">
            <Button className="mt-6 hover:bg-opacity-50 drop-shadow-2xl">
              Get Started
            </Button>
          </div>
        </div>
        <div className="flex flex-col h-full md:h-screen items-center justify-center bg-gradient-to-t from-transparent to-indigo-200 mb-20 md:mb-0">
          <div className="flex flex-col text-center items-center justify-center mt-6 md:mt-0 mb-6">
            <h1 className="text-3xl text-center items-center md:text-left lg:text-6xl md:text-5xl sm:text-3xl ">
              One Stop Solution
            </h1>
          </div>
          <div className="flex flex-col text-center items-center">
            <span className="mt-2">
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
              />
            </div>
          </div>
        </div>
      </div>
      <div className="App" >
        <StickyImage src="/assets/services/Solar-showcase.jpeg" alt="Sticky Image" stickyClass="sticky" />
        <ScrollingContent sections={sections} />
      </div>
      {/* <StickyScroll 
        content={content} 
        parentDiv={"h-screen flex relative space-x-10 p-10 bg-center bg-no-repeat"} 
        cardDiv={"max-w-2xl text-center drop-shadow-2xl items-center"}
      /> */}
    </div>
  );
};
export default LandingPage;


const content = [ 
  {
      title: "Solar Systems",
      description:
        "Design your own solar system and get it installed for $0 down. ",
      content: (
        <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
          Collaborative Editing
        </div>
      ),
      backgroundUrl: `url(/assets/services/Solar-showcase.jpeg)`,
    },
    {
      title: "HVAC",
      description:
        "Upgrade your air conditioning unit today!",
      content: (
        <div className="h-full w-full  flex items-center justify-center text-white">
          <Image
            src="/linear.webp"
            width={300}
            height={300}
            className="h-full w-full object-cover"
            alt="linear board demo"
          />
        </div>
      ),
      backgroundUrl: `url(/assets/services/HVAC-showcase.png)`,
    },
    {
      title: "Roofing",
      description:
        "Combine a roof rennovation with a solar system and get a bigger discount. Or design your roof from scratch.",
      content: (
        <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
          Version control
        </div>
      ),
      backgroundUrl: `url(/assets/services/roof-showcase.avif)`,
    },
    {
      title: "Batteries",
      description:
        "Backup your entire house with batteries that will keep you running for days.",
      content: (
        <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
          Version control
        </div>
      ),
      backgroundUrl: `url(/assets/services/batteries-showcase.webp)`,
    },
  ];
