
import { useState, useEffect, useRef } from 'react';

interface UseWidgetLazyLoadOptions {
  delay?: number;
  threshold?: number;
}

export const useWidgetLazyLoad = (options: UseWidgetLazyLoadOptions = {}) => {
  const { delay = 100, threshold = 0.1 } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Add a small delay before actually loading the component
          setTimeout(() => setShouldLoad(true), delay);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay, threshold]);

  return { elementRef, isVisible, shouldLoad };
};
