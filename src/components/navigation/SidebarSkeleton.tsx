
import { Skeleton } from "@/components/ui/skeleton";

export const SidebarSkeleton = () => (
  <div className="w-64 shrink-0 h-screen flex flex-col p-2 bg-white border-r">
    {/* Header */}
    <div className="p-4 border-b">
        <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <div>
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-3 w-28 mt-1" />
            </div>
        </div>
    </div>
    
    {/* Content */}
    <div className="flex-1 p-2 mt-4 space-y-6">
      <div>
        <Skeleton className="h-4 w-1/3 mb-2" />
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-md" />
          ))}
        </div>
      </div>
      <div>
        <Skeleton className="h-4 w-1/3 mb-2" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-md" />
          ))}
        </div>
      </div>
    </div>
    
    {/* Footer */}
    <div className="p-4 border-t">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-muted">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="w-8 h-8" />
        </div>
    </div>
  </div>
);
