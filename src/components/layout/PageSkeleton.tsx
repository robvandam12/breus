
import { Skeleton } from "@/components/ui/skeleton";

export const PageSkeleton = () => (
    <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
        <div className="border rounded-lg p-2">
             <Skeleton className="h-[500px] w-full" />
        </div>
    </div>
);
