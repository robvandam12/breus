
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
        title="Bitácoras de Supervisor"
        subtitle="Gestión de supervisión de inmersiones con registro detallado de cuadrilla"
        icon={FileText}
      />
    );
  }

  return (
    <BitacoraPageLayout
      title="Bitácoras de Supervisor"
      subtitle="Registro completo de supervisión de inmersiones con gestión avanzada de equipos y tiempos"
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
