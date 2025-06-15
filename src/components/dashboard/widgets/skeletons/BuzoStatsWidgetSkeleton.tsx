
import { Skeleton } from "@/components/ui/skeleton";

export const BuzoStatsWidgetSkeleton = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 h-full content-center p-4">
            <div className="flex flex-col items-center justify-center space-y-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
}
