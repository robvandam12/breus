
import { Skeleton } from "@/components/ui/skeleton";

export const SidebarSkeleton = () => (
  <div className="flex flex-col h-full w-64 bg-white border-r border-gray-200 p-4">
    {/* Header Skeleton */}
    <div className="flex items-center gap-3 mb-6">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <div>
        <Skeleton className="h-5 w-16 mb-1" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    
    {/* Navigation Skeleton */}
    <div className="space-y-2 flex-1">
      <Skeleton className="h-12 w-full rounded-md" />
      <Skeleton className="h-12 w-full rounded-md" />
      <Skeleton className="h-12 w-full rounded-md" />
      <Skeleton className="h-12 w-full rounded-md" />
      <Skeleton className="h-12 w-full rounded-md" />
      <Skeleton className="h-12 w-full rounded-md" />
    </div>
    
    {/* Footer Skeleton */}
    <div className="border-t pt-4">
      <div className="flex items-center gap-3 p-3 rounded-lg border">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="w-8 h-8 rounded" />
      </div>
    </div>
  </div>
);
