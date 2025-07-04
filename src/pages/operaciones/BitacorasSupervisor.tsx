
import { useState } from "react";
import { FileText } from "lucide-react";
import { BitacoraPageLayout } from "@/components/layout/BitacoraPageLayout";
import { BitacoraPageSkeleton } from "@/components/layout/BitacoraPageSkeleton";
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
      <BitacoraPageSkeleton
        title="Bitácoras Supervisor"
        subtitle="Registro de supervisión de inmersiones (Formulario de 6 pasos con tiempos de cuadrilla)"
        icon={FileText}
      />
    );
  }

  return (
    <BitacoraPageLayout
      title="Bitácoras Supervisor"
      subtitle="Registro completo de supervisión de inmersiones con gestión de tiempos de cuadrilla"
      icon={FileText}
    >
      <BitacorasSupervisorContent 
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    </BitacoraPageLayout>
  );
};

export default BitacorasSupervisor;
