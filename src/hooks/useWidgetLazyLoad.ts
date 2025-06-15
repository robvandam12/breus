
import { useState, useEffect, useRef } from 'react';

interface UseWidgetLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export const useWidgetLazyLoad = (options: UseWidgetLazyLoadOptions = {}) => {
  const { threshold = 0.1, rootMargin = '50px', enabled = true } = options;
  const [isVisible, setIsVisible] = useState(!enabled);
  const [hasLoaded, setHasLoaded] = useState(!enabled);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || hasLoaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [enabled, hasLoaded, threshold, rootMargin]);

  return { isVisible, hasLoaded, elementRef };
};
