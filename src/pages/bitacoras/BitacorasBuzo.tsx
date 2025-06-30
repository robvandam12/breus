
import { useState } from "react";
import { Users } from "lucide-react";
import { BitacoraPageLayout } from "@/components/layout/BitacoraPageLayout";
import { BitacoraPageSkeleton } from "@/components/layout/BitacoraPageSkeleton";
import { BitacorasBuzoContent } from "@/components/bitacoras/BitacorasBuzoContent";
import { useBitacorasBuzo } from "@/hooks/useBitacorasBuzo";

const BitacorasBuzo = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const { loadingBuzo } = useBitacorasBuzo();

  if (loadingBuzo) {
    return (
      <BitacoraPageSkeleton
        title="Bitácoras de Buzo"
        subtitle="Registro personal de inmersiones con validación automática desde supervisión"
        icon={Users}
      />
    );
  }

  return (
    <BitacoraPageLayout
      title="Bitácoras de Buzo"
      subtitle="Registro personal de inmersiones con herencia automática desde bitácoras de supervisor"
      icon={Users}
    >
      <BitacorasBuzoContent 
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    </BitacoraPageLayout>
  );
};

export default BitacorasBuzo;
