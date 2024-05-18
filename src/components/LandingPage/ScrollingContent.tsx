"use client";

import React, { useState, useRef, useEffect } from 'react';
import useIntersectionObserver from './useIntersectionObserver';
import './LandingPage.css';
import StickyImage from './StickyImage';

interface ScrollingContentProps {
  sections: string[][];
}

const ScrollingContent: React.FC<ScrollingContentProps> = ({ sections }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showNewImage, setShowNewImage] = useState(false);

  const { setElements } = useIntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Perform any additional actions when a section is intersecting
        console.log(entry.intersectionRatio)
		      // console.log(entry)
          setShowNewImage(true);
        }
      });
    }
  );

  useEffect(() => {
    if (containerRef.current) {
      setElements([containerRef.current]);
    }
  }, [setElements]);

  return (
    <div>
      {sections.map((section, index) => (
        <div>
          <StickyImage src={section[0]} alt={section[1]} stickyClass="sticky"></StickyImage>
          <div className="scrolling-content" key={index}>
            <h1 ref={containerRef}>{section[1]}</h1>
            <p>{section[2]}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScrollingContent;
