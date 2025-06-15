
import React from 'react';
import { useWidgetLazyLoad } from '@/hooks/useWidgetLazyLoad';
import { motion } from 'framer-motion';

interface LazyWidgetProps {
  children: React.ReactNode;
  skeleton: React.ReactNode;
  isHeavy?: boolean;
  className?: string;
}

export const LazyWidget = ({ 
  children, 
  skeleton, 
  isHeavy = false,
  className = '' 
}: LazyWidgetProps) => {
  const { elementRef, shouldLoad } = useWidgetLazyLoad({
    delay: isHeavy ? 200 : 50,
    threshold: 0.1
  });

  return (
    <div ref={elementRef} className={className}>
      {shouldLoad ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {skeleton}
        </motion.div>
      )}
    </div>
  );
};
