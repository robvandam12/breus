
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Filter, BarChart3, Search } from "lucide-react";
import { SecurityAnalysisReport } from "@/components/reportes/SecurityAnalysisReport";
import { ImmersionAnalysisReport } from "@/components/reportes/ImmersionAnalysisReport";
import { GlobalFiltersCard } from "@/components/reportes/GlobalFiltersCard";
import { MainKPIs } from "@/components/reportes/MainKPIs";
import { ComplianceChart } from "@/components/reportes/ComplianceChart";
import { FormStatusChart } from "@/components/reportes/FormStatusChart";
import { DailyImmersionsChart } from "@/components/reportes/DailyImmersionsChart";
import { ExpiringPermits } from "@/components/reportes/ExpiringPermits";
import { MainLayout } from "@/components/layout/MainLayout";

const Reportes = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const headerActions = (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
        <Input
          placeholder="Buscar reportes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-64"
        />
      </div>
      <Button variant="outline" className="flex items-center gap-2">
        <Download className="w-4 h-4" />
        Exportar
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Filter className="w-4 h-4" />
        Filtros
      </Button>
    </div>
  );

  return (
    <MainLayout
      title="Reportes"
      subtitle="Análisis y estadísticas operacionales"
      icon={BarChart3}
      headerChildren={headerActions}
    >
      <div className="space-y-6">
        <SecurityAnalysisReport />
        
        <ImmersionAnalysisReport />
        
        <GlobalFiltersCard />
        <MainKPIs />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ComplianceChart />
          <FormStatusChart />
        </div>

        <DailyImmersionsChart />
        <ExpiringPermits />
      </div>
    </MainLayout>
  );
};

export default Reportes;
