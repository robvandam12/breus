
import { useState } from "react";
import { FileText } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { BitacorasSupervisorContent } from "@/components/bitacoras/BitacorasSupervisorContent";
import { useBitacorasSupervisor } from "@/hooks/useBitacorasSupervisor";
import { useBitacorasBuzo } from "@/hooks/useBitacorasBuzo";

const BitacorasSupervisor = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  
  const { loadingSupervisor } = useBitacorasSupervisor();
  const { loadingBuzo } = useBitacorasBuzo();
  
  const loading = loadingSupervisor || loadingBuzo;

  if (loading) {
    return (
      <MainLayout
        title="Bitácoras Supervisor"
        subtitle="Registro de supervisión de inmersiones (Formulario de 6 pasos con tiempos de cuadrilla)"
        icon={FileText}
      >
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner text="Cargando bitácoras..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Bitácoras Supervisor"
      subtitle="Registro completo de supervisión de inmersiones con gestión de tiempos de cuadrilla"
      icon={FileText}
    >
      <BitacorasSupervisorContent 
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    </MainLayout>
  );
};

export default BitacorasSupervisor;
