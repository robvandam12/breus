
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Download, Filter, BarChart3 } from "lucide-react";
import { SecurityAnalysisReport } from "@/components/reportes/SecurityAnalysisReport";
import { ImmersionAnalysisReport } from "@/components/reportes/ImmersionAnalysisReport";
import { GlobalFiltersCard } from "@/components/reportes/GlobalFiltersCard";
import { MainKPIs } from "@/components/reportes/MainKPIs";
import { ComplianceChart } from "@/components/reportes/ComplianceChart";
import { FormStatusChart } from "@/components/reportes/FormStatusChart";
import { DailyImmersionsChart } from "@/components/reportes/DailyImmersionsChart";
import { ExpiringPermits } from "@/components/reportes/ExpiringPermits";

const Reportes = () => {
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
                  <h1 className="text-xl font-semibold text-zinc-900">Reportes</h1>
                  <p className="text-sm text-zinc-500">Análisis y estadísticas operacionales</p>
                </div>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                </Button>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
              
              <SecurityAnalysisReport />
              
              <ImmersionAnalysisReport />
              
              {/* Los siguientes componentes usan datos de ejemplo y pueden conectarse a datos reales más adelante */}
              <GlobalFiltersCard />
              <MainKPIs />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ComplianceChart />
                <FormStatusChart />
              </div>

              <DailyImmersionsChart />
              <ExpiringPermits />

            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Reportes;
