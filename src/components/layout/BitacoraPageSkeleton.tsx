
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { BitacoraPageLayout } from "@/components/layout/BitacoraPageLayout";
import { LucideIcon } from 'lucide-react';

interface BitacoraPageSkeletonProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  showStats?: boolean;
  showFilters?: boolean;
  showTable?: boolean;
  statsCount?: number;
  tableRows?: number;
  className?: string;
}

export const BitacoraPageSkeleton: React.FC<BitacoraPageSkeletonProps> = ({
  title,
  subtitle,
  icon,
  showStats = true,
  showFilters = true,
  showTable = true,
  statsCount = 3,
  tableRows = 5,
  className = ""
}) => {
  const headerActions = (
    <div className="flex items-center gap-2">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-10 w-48" />
    </div>
  );

  return (
    <BitacoraPageLayout
      title={title}
      subtitle={subtitle}
      icon={icon}
      headerActions={headerActions}
      className={className}
    >
      {showStats && (
        <div className={`grid grid-cols-1 sm:grid-cols-${statsCount} gap-4 mb-6`}>
          {Array.from({ length: statsCount }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      )}
      
      {showFilters && (
        <div className="mb-6">
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      )}
      
      {showTable && (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <div className="space-y-2">
            {Array.from({ length: tableRows }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
      )}
    </BitacoraPageLayout>
  );
};
