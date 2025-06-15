
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { MainLayout } from "@/components/layout/MainLayout";

interface PageLoadingSkeletonProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  showKPIs?: boolean;
  showTable?: boolean;
  showHeaderActions?: boolean;
}

export const PageLoadingSkeleton: React.FC<PageLoadingSkeletonProps> = ({
  title,
  subtitle,
  icon,
  showKPIs = true,
  showTable = true,
  showHeaderActions = true
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
    >
      {showKPIs && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      )}
      
      {showTable && (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      )}
    </MainLayout>
  );
};
