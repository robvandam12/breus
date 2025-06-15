
import { Skeleton } from "@/components/ui/skeleton";

export const KpiCardsWidgetSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
        <Skeleton className="h-full" />
        <Skeleton className="h-full" />
        <Skeleton className="h-full" />
        <Skeleton className="h-full" />
    </div>
);
