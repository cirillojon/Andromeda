"use client";
import React, { useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
    },
  ];

export const StickyScroll = () => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = [
    `url(/assets/services/Solar-showcase.jpeg)`,
    `url(/assets/services/HVAC-showcase.png)`,
    `url(/assets/services/roof-showcase.avif)`,
    `url(/assets/services/batteries-showcase.webp)`,
  ];
  return (
    <motion.div
      style={{
        backgroundImage: backgroundColors[activeCard % backgroundColors.length],
        backgroundSize: "cover",
      }}
      className="h-screen overflow-y-auto flex relative space-x-10 p-10 bg-center bg-no-repeat"
      ref={ref}
    >
        <div className="max-w-2xl text-center mt-24 drop-shadow-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-80 p-8 bg-white rounded-lg">
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-5xl font-bold text-stone-800"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-xl text-stone-800 max-w-sm mt-10"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-12"/>
        </div>
    </motion.div>
  );
};
