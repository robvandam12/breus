
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { MainLayout } from "@/components/layout/MainLayout";
import { LucideIcon } from 'lucide-react';

interface PageLoadingSkeletonProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  showKPIs?: boolean;
  showTable?: boolean;
  showHeaderActions?: boolean;
  kpiCount?: number;
  tableRows?: number;
  className?: string;
}

export const PageLoadingSkeleton: React.FC<PageLoadingSkeletonProps> = ({
  title,
  subtitle,
  icon,
  showKPIs = true,
  showTable = true,
  showHeaderActions = true,
  kpiCount = 4,
  tableRows = 6,
  className = ""
}) => {
  const headerActions = showHeaderActions ? (
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-10 w-32" />
    </div>
  ) : undefined;

  return (
    <MainLayout
      title={title}
      subtitle={subtitle}
      icon={icon}
      headerChildren={headerActions}
      className={className}
    >
      <div className="space-y-6">
        {showKPIs && (
          <div className={`grid grid-cols-1 md:grid-cols-${kpiCount} gap-4`}>
            {Array.from({ length: kpiCount }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
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
      </div>
    </MainLayout>
  );
};
