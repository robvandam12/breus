
import React from 'react';

export const SystemControlPanelWidgetSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
    </div>
  );
};
