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
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);


  const handleScroll = () => {
    const currentScrollHeight = (window.scrollY - ref.current!.offsetTop);
    const maxScrollHeight = (ref.current!.clientHeight - ref.current!.offsetTop);
    const val = Math.floor((currentScrollHeight - (ref.current!.offsetTop / 5)) / (maxScrollHeight / sections.length));
    if (val >= 0 && val < sections.length) {
      setActiveCard(val)
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
