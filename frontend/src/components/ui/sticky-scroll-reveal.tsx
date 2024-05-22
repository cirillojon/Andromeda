"use client";
import React, { useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  parentDiv,
  cardDiv,
}: {
  content: {
    title: string;
    description: string;
    content: React.ReactNode;
    backgroundUrl: string;
  }[];
  parentDiv: string;
  cardDiv: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
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

  return (
    <motion.div
      style={{
        backgroundImage: content[activeCard].backgroundUrl,
        backgroundSize: "cover",
      }}
      className={cn("overflow-y-auto no-scrollbar", parentDiv)}
      ref={ref}
    >
      <div className={cardDiv}>
        {content.map((item, index) => (
          <div
            className="my-80 p-8 bg-white rounded-lg"
            key={item.title + index}
          >
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
        <div className="h-12" />
      </div>
    </motion.div>
  );
};
