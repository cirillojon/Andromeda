"use client";

import React, { useEffect, useRef, useState } from 'react';
import useIntersectionObserver from './useIntersectionObserver';

interface StickyImageProps {
  src: string;
  alt: string;
  stickyClass: string;
}

const StickyImage: React.FC<StickyImageProps> = ({ src, alt, stickyClass }) => {
  const [isSticky, setIsSticky] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const { setElements } = useIntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      });
    }
  );

  useEffect(() => {
    if (imageRef.current) {
      setElements([imageRef.current]);
    }
  }, [setElements]);

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      className={`${isSticky ? stickyClass : ''} full-screen-image`}
      style={{ position: isSticky ? 'sticky' : 'static', top: isSticky ? '0' : 'auto' }}
    />
  );
};

export default StickyImage;