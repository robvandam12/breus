
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const WeatherWidgetSkeleton = () => (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="flex-grow grid grid-cols-2 gap-x-4 gap-y-5">
            {Array.from({ length: 6 }).map((_, i) => (
                 <div key={i} className="flex items-start gap-3">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-12" />
                    </div>
                </div>
            ))}
        </CardContent>
    </Card>
);
