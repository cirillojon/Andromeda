"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import './LandingPage.css';
import { motion } from "framer-motion";

interface ScrollingContentProps {
  sections: string[][];
}

const ScrollingContent: React.FC<ScrollingContentProps> = ({ sections }) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const [sticky, setSticky] = React.useState(true);
  const ref = useRef<HTMLDivElement>(null);


  const handleScroll = () => {
    if (ref.current) {
      const currentScrollHeight = (window.scrollY - ref.current.offsetTop);
      if (currentScrollHeight > -20) {
        setSticky(true);
      } else {
        setSticky(false);
      }

      const cards = ref.current.querySelectorAll('.scrolling-content');
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top + rect.height < window.innerHeight) {
          setActiveCard(index);
        }
      });
    }
  };

  useEffect(() => {
    handleScroll();

    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <div ref = {ref}>
      <Image
        src={sections[activeCard][0]}
        alt={sections[activeCard][1]}
        width={10000}
        height={10000}
        className={`${sticky ? "sticky" : ''} full-screen-image`}
        style={{ position: sticky ? 'sticky' : 'static', top: sticky ? '0' : 'auto' }}
      />
      {sections.map((section, index) => (
        <div key={index}>
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
