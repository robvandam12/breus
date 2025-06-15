
import { UpcomingOperations } from "@/components/dashboard/UpcomingOperations";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

export const UpcomingOperationsWidget = () => {
  const { operations, isLoading: operationsLoading } = useDashboardData();
  if (operationsLoading) return <Skeleton className="h-72 rounded-xl" />;
  return <UpcomingOperations operations={operations} />;
}
