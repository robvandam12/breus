
import { Skeleton } from "@/components/ui/skeleton";

export const MyImmersionsWidgetSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        <Skeleton className="col-span-1 md:col-span-2 h-full" />
        <div className="col-span-1 space-y-4 flex flex-col h-full">
            <Skeleton className="h-32" />
            <Skeleton className="flex-grow" />
        </div>
    </div>
);
