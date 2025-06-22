
import React from 'react';

export const UsageStatsWidgetSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
      <div className="h-32 bg-gray-100 rounded animate-pulse" />
    </div>
  );
};
