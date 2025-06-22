
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { MainLayout } from "@/components/layout/MainLayout";
import { LucideIcon } from 'lucide-react';

interface SimplePageSkeletonProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  showForm?: boolean;
  showCards?: boolean;
  cardCount?: number;
  className?: string;
}

export const SimplePageSkeleton: React.FC<SimplePageSkeletonProps> = ({
  title,
  subtitle,
  icon,
  showForm = true,
  showCards = false,
  cardCount = 3,
  className = ""
}) => {
  return (
    <MainLayout
      title={title}
      subtitle={subtitle}
      icon={icon}
      className={className}
    >
      <div className="space-y-6">
        {showCards && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: cardCount }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        )}
        
        {showForm && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64 rounded-lg" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <div className="flex justify-end gap-2">
                <Skeleton className="h-10 w-24 rounded-lg" />
                <Skeleton className="h-10 w-32 rounded-lg" />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
