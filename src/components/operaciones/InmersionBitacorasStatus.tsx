
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, User, Users, Plus } from "lucide-react";
import { useState } from "react";
import { useBitacorasSupervisor } from "@/hooks/useBitacorasSupervisor";
import { BitacoraWizardFromInmersion } from "@/components/bitacoras/BitacoraWizardFromInmersion";
import { BitacorasStatusByInmersion } from "./BitacorasStatusByInmersion";

interface InmersionBitacorasStatusProps {
  inmersionId: string;
  inmersionCodigo: string;
}

export const InmersionBitacorasStatus = ({ 
  inmersionId, 
  inmersionCodigo 
}: InmersionBitacorasStatusProps) => {
  const [showCreateSupervisor, setShowCreateSupervisor] = useState(false);
  const { hasExistingBitacora } = useBitacorasSupervisor();

  const hasSupervisorBitacora = hasExistingBitacora(inmersionId);

  const handleCreateSupervisorBitacora = (data: any) => {
    setShowCreateSupervisor(false);
  };

  const handleCreateSupervisor = () => {
    setShowCreateSupervisor(true);
  };

  const handleCreateBuzo = () => {
    // TODO: Implementar navegación a creación de bitácora de buzo
    console.log('Create buzo bitacora for inmersion:', inmersionId);
  };

  // Usar el nuevo componente mejorado
  return (
    <>
      <BitacorasStatusByInmersion
        inmersionId={inmersionId}
        inmersionCodigo={inmersionCodigo}
        onCreateSupervisorBitacora={!hasSupervisorBitacora ? handleCreateSupervisor : undefined}
        onCreateBuzoBitacora={handleCreateBuzo}
      />

      {/* Dialog para crear bitácora de supervisor */}
      {showCreateSupervisor && (
        <Dialog open={showCreateSupervisor} onOpenChange={setShowCreateSupervisor}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Bitácora de Supervisor</DialogTitle>
            </DialogHeader>
            <BitacoraWizardFromInmersion
              inmersionId={inmersionId}
              onComplete={handleCreateSupervisorBitacora}
              onCancel={() => setShowCreateSupervisor(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
