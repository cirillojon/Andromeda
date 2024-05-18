import { useEffect, useRef, useState } from 'react';

const useIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void,
  options?: IntersectionObserverInit
) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const [elements, setElements] = useState<Element[]>([]);
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>([]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((ioEntries) => {
      setEntries(ioEntries);
      callback(ioEntries, observer.current!);
    }, options);

    const { current: currentObserver } = observer;

    elements.forEach((element) => currentObserver.observe(element));

    return () => currentObserver.disconnect();
  }, [elements, options, callback]);

  return { setElements, entries };
};

export default useIntersectionObserver;
