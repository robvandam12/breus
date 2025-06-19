
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, User, Users, Plus } from "lucide-react";
import { useState } from "react";
import { useBitacorasSupervisor } from "@/hooks/useBitacorasSupervisor";
import { BitacoraWizardFromInmersion } from "@/components/bitacoras/BitacoraWizardFromInmersion";

interface InmersionBitacorasStatusProps {
  inmersionId: string;
  inmersionCodigo: string;
}

export const InmersionBitacorasStatus = ({ 
  inmersionId, 
  inmersionCodigo 
}: InmersionBitacorasStatusProps) => {
  const [showCreateSupervisor, setShowCreateSupervisor] = useState(false);
  const { bitacorasSupervisor, hasExistingBitacora } = useBitacorasSupervisor();

  // Obtener bitácoras relacionadas con esta inmersión
  const bitacoraSupervisor = bitacorasSupervisor.find(b => b.inmersion_id === inmersionId);
  const hasSupervisorBitacora = hasExistingBitacora(inmersionId);

  // TODO: Agregar hook para bitácoras de buzo cuando esté disponible
  const bitacorasBuzo = []; // Placeholder hasta tener el hook

  const handleCreateSupervisorBitacora = (data: any) => {
    // La lógica de creación ya está en el hook
    setShowCreateSupervisor(false);
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Bitácoras - {inmersionCodigo}
          </div>
          {!hasSupervisorBitacora && (
            <Dialog open={showCreateSupervisor} onOpenChange={setShowCreateSupervisor}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-3 h-3 mr-1" />
                  Crear Supervisor
                </Button>
              </DialogTrigger>
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
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bitácoras de Supervisor */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Supervisor</span>
              <Badge variant={hasSupervisorBitacora ? "default" : "secondary"}>
                {hasSupervisorBitacora ? "1" : "0"}
              </Badge>
            </div>
            
            {hasSupervisorBitacora && bitacoraSupervisor ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      {bitacoraSupervisor.codigo}
                    </p>
                    <p className="text-xs text-green-600">
                      {bitacoraSupervisor.firmado ? 'Firmada' : 'Pendiente firma'}
                    </p>
                  </div>
                  <Badge variant={bitacoraSupervisor.firmado ? "default" : "secondary"}>
                    {bitacoraSupervisor.firmado ? 'Completada' : 'Borrador'}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  No hay bitácora de supervisor
                </p>
                <p className="text-xs text-gray-500">
                  Solo se permite una bitácora por inmersión
                </p>
              </div>
            )}
          </div>

          {/* Bitácoras de Buzo */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Buzos</span>
              <Badge variant={bitacorasBuzo.length > 0 ? "default" : "secondary"}>
                {bitacorasBuzo.length}
              </Badge>
            </div>
            
            {bitacorasBuzo.length > 0 ? (
              <div className="space-y-2">
                {bitacorasBuzo.map((bitacora: any, index: number) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Bitácora Buzo #{index + 1}
                        </p>
                        <p className="text-xs text-blue-600">
                          {bitacora.buzo || 'Sin buzo asignado'}
                        </p>
                      </div>
                      <Badge variant={bitacora.firmado ? "default" : "secondary"}>
                        {bitacora.firmado ? 'Completada' : 'Borrador'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  No hay bitácoras de buzo
                </p>
                <p className="text-xs text-gray-500">
                  Se pueden crear múltiples bitácoras de buzo
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Resumen */}
        <div className="mt-4 pt-3 border-t">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Total: {(hasSupervisorBitacora ? 1 : 0) + bitacorasBuzo.length} bitácoras
            </span>
            <span>
              {hasSupervisorBitacora ? 'Lista para ejecutar' : 'Requiere bitácora supervisor'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
