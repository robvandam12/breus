
import React, { memo, Suspense } from 'react';
import { useWidgetLazyLoad } from '@/hooks/useWidgetLazyLoad';

interface LazyWidgetProps {
  children: React.ReactNode;
  skeleton: React.ReactNode;
  isHeavy?: boolean;
  priority?: 'high' | 'normal' | 'low';
}

export const LazyWidget = memo<LazyWidgetProps>(({ 
  children, 
  skeleton, 
  isHeavy = false,
  priority = 'normal' 
}) => {
  const { isVisible, elementRef } = useWidgetLazyLoad({ 
    enabled: isHeavy || priority === 'low',
    threshold: priority === 'high' ? 0.3 : 0.1,
    rootMargin: priority === 'high' ? '100px' : '50px'
  });

  return (
    <div ref={elementRef} className="h-full">
      {isVisible ? (
        <Suspense fallback={skeleton}>
          {children}
        </Suspense>
      ) : (
        skeleton
      )}
    </div>
  );
});

LazyWidget.displayName = 'LazyWidget';
