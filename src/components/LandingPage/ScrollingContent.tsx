"use client";

import React, { useState, useRef, useEffect } from 'react';
import './LandingPage.css';
import StickyImage from './StickyImage';
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";

interface ScrollingContentProps {
  sections: string[][];
}

const ScrollingContent: React.FC<ScrollingContentProps> = ({ sections }) => {

  const [activeCard, setActiveCard] = React.useState(0);
  
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });

  const cardLength = screen.availHeight / 25;
  const cardsBreakpoints = sections.map((_: any, index: number) => index / cardLength);


  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY || document.documentElement.scrollTop);
    console.log(window.scrollY);
    console.log(ref.current?.offsetTop);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // console.log(ref)
  // console.log(scrollYProgress)
  // console.log(activeCard);
  // console.log(cardsBreakpoints);

  // useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
  //   const closestBreakpointIndex = cardsBreakpoints.reduce(
  //     (acc: number, breakpoint: number, index: any) => {
  //       const distance = Math.abs(latest - breakpoint);
  //       if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
  //         return index;
  //       }
  //       return acc;
  //     },
  //     0
  //   );
  //   setActiveCard(closestBreakpointIndex);
  // });

  return (
    <div ref = {ref}>
      <StickyImage src={sections[activeCard][0]} alt={sections[activeCard][1]} stickyClass="sticky"></StickyImage>
      {sections.map((section, index) => (
        <div>
          <div className="scrolling-barrier"></div>
          <motion.div 
          initial={{
            opacity: 0.7,
          }}
          animate={{
            opacity: activeCard == index ? 1 : 0.7,
          }}
          className="scrolling-content" key={index}>
            <h1>{section[1]}</h1>
            <p>{section[2]}</p>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default ScrollingContent;
