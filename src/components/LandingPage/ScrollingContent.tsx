"use client";

import React, { useRef } from 'react';
import useIntersectionObserver from './useIntersectionObserver';
import './LandingPage.css';

interface ScrollingContentProps {
  sections: string[][];
}

const ScrollingContent: React.FC<ScrollingContentProps> = ({ sections }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useIntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Perform any additional actions when a section is intersecting
		  console.log("Hello")
        }
      });
    }, 
    { root: containerRef.current }
  );

  return (
    <div ref={containerRef}>
      {sections.map((section, index) => (
        <div className="scrolling-content" key={index}>
          <h1>{section[0]}</h1>
		  <p>{section[1]}</p>
        </div>
      ))}
    </div>
  );
};

export default ScrollingContent;
