
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const CalendarWidgetSkeleton = () => (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent className="flex-grow flex flex-col items-center justify-center space-y-4">
            <div className="w-full space-y-2 p-4">
                <div className="flex justify-between">
                    <Skeleton className="h-5 w-24" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                     {Array.from({ length: 7 }).map((_, i) => (
                        <Skeleton key={`day-header-${i}`} className="h-8 w-full" />
                    ))}
                    {Array.from({ length: 35 }).map((_, i) => (
                        <Skeleton key={`day-${i}`} className="h-12 w-full rounded-md" />
                    ))}
                </div>
            </div>
        </CardContent>
    </Card>
);
