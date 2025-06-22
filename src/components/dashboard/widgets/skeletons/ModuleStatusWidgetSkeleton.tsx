
import React from 'react';

export const ModuleStatusWidgetSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-100 rounded animate-pulse" />
          <div className="h-2 bg-gray-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
};
