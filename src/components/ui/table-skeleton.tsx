
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface TableSkeletonProps {
  title?: string;
  columns?: number;
  rows?: number;
  showHeader?: boolean;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  title,
  columns = 4,
  rows = 5,
  showHeader = true,
  className = ""
}) => {
  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          {title ? (
            <Skeleton className="h-6 w-48" />
          ) : (
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          )}
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-4">
          {/* Header de tabla */}
          <div className={`grid grid-cols-${columns} gap-4 pb-2 border-b`}>
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          
          {/* Filas de tabla */}
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className={`grid grid-cols-${columns} gap-4 py-3 border-b last:border-b-0`}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
