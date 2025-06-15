
import React from "react";
import { UpcomingOperations } from "@/components/dashboard/UpcomingOperations";
import { useDashboardData } from "@/hooks/useDashboardData";
import { UpcomingOperationsWidgetSkeleton } from "./skeletons/UpcomingOperationsWidgetSkeleton";

const UpcomingOperationsWidget = ({ config }: { config?: any }) => {
  const { operations, isLoading: operationsLoading } = useDashboardData();
  if (operationsLoading) return <UpcomingOperationsWidgetSkeleton />;
  return <UpcomingOperations operations={operations} />;
}

export default React.memo(UpcomingOperationsWidget);
