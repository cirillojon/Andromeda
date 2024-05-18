"use client";

import React, { useRef } from 'react';
import useIntersectionObserver from './useIntersectionObserver';

interface ScrollingContentProps {
  sections: string[];
}

const ScrollingContent: React.FC<ScrollingContentProps> = ({ sections }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useIntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Perform any additional actions when a section is intersecting
        }
      });
    }, 
    { root: containerRef.current }
  );

  return (
    <div ref={containerRef}>
      {sections.map((section, index) => (
        <div key={index} style={{ minHeight: '100vh' }}>
          {section}
        </div>
      ))}
    </div>
  );
};

export default ScrollingContent;
