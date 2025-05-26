
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { KPICard } from "@/components/dashboard/KPICard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { UpcomingOperations } from "@/components/dashboard/UpcomingOperations";
import { StatsChart } from "@/components/dashboard/StatsChart";
import { AlertasPanel } from "@/components/dashboard/AlertasPanel";
import { NotificationToasts } from "@/components/dashboard/NotificationToasts";
import { CollapsibleFilters } from "@/components/dashboard/CollapsibleFilters";
import { BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/hooks/useDashboardData";

const Index = () => {
  const { kpis, activities, operations, chartData, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
              <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
                <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-zinc-600" />
                  <div>
                    <h1 className="text-xl font-semibold text-zinc-900">Dashboard</h1>
                    <p className="text-sm text-zinc-500">Panel de control y métricas</p>
                  </div>
                </div>
              </div>
            </header>
            <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-6 rounded-lg border bg-card">
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Skeleton className="h-80 w-full rounded-lg" />
                  <Skeleton className="h-60 w-full rounded-lg" />
                </div>
                <div className="space-y-6">
                  <Skeleton className="h-40 w-full rounded-lg" />
                  <Skeleton className="h-60 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Dashboard</h1>
                  <p className="text-sm text-zinc-500">Panel de control y métricas</p>
                </div>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {kpis.map((kpi, index) => (
                  <KPICard key={index} {...kpi} />
                ))}
              </div>

              {/* Filtros Colapsables */}
              <div className="mb-6">
                <CollapsibleFilters />
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Charts and Data */}
                <div className="lg:col-span-2 space-y-6">
                  <StatsChart data={chartData} />
                  <UpcomingOperations operations={operations} />
                </div>

                {/* Right Column - Actions and Alerts */}
                <div className="space-y-6">
                  <QuickActions />
                  <AlertasPanel />
                  <RecentActivity activities={activities} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <NotificationToasts />
    </SidebarProvider>
  );
};

export default Index;
