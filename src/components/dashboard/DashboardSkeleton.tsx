
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = () => (
  <div className="p-6 space-y-8">
    {/* Header */}
    <div className="space-y-2">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-6 w-1/2" />
    </div>

    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>

    {/* Performance Metrics & Chart */}
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-80 w-full" />

    {/* Main Content Grid */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="space-y-6 xl:col-span-1">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
      <div className="xl:col-span-2">
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  </div>
);
