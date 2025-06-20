
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, Shield, Building, MapPin, ChevronDown, ChevronUp, AlertTriangle, Info } from "lucide-react";
import { HPTWizard } from "@/components/hpt/HPTWizard";
import { FullAnexoBravoForm } from "@/components/anexo-bravo/FullAnexoBravoForm";
import { useHPT } from "@/hooks/useHPT";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { DocumentCreationButton } from "./OperacionesComponents";
import { DocumentCard } from "./DocumentCard";

interface OperacionDocumentsProps {
  operacionId: string;
  operacion?: any;
}

export const OperacionDocuments = ({ operacionId, operacion }: OperacionDocumentsProps) => {
  const [showHPTWizard, setShowHPTWizard] = useState(false);
  const [showAnexoBravoForm, setShowAnexoBravoForm] = useState(false);
  const [showOperacionInfo, setShowOperacionInfo] = useState(false);
  const [hasTeamAssigned, setHasTeamAssigned] = useState(false);
  
  const { hpts, createHPT } = useHPT();
  const { anexosBravo, createAnexoBravo } = useAnexoBravo();

  // Filter documents for this operation
  const operacionHPTs = hpts.filter(hpt => hpt.operacion_id === operacionId);
  const operacionAnexos = anexosBravo.filter(anexo => anexo.operacion_id === operacionId);

  // Check if operation has required team - reacciona a cambios inmediatamente
  useEffect(() => {
    console.log('Checking team assignment for operation:', operacion);
    const checkTeamAssignment = () => {
      if (operacion?.equipo_buceo_id) {
        console.log('Team assigned:', operacion.equipo_buceo_id);
        setHasTeamAssigned(true);
      } else {
        console.log('No team assigned');
        setHasTeamAssigned(false);
      }
    };

    checkTeamAssignment();
  }, [operacion?.equipo_buceo_id]); // Asegurar que solo observe este campo específico

  // Forzar re-render cuando cambie el equipo_buceo_id
  const teamAssignmentKey = operacion?.equipo_buceo_id || 'no-team';

  const handleDocumentDeleteAttempt = (documentType: string) => {
    toast({
      title: "Eliminación no permitida",
      description: `Los documentos ${documentType} no se pueden eliminar por trazabilidad. Solo pueden ser editados o reemplazados.`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6" key={teamAssignmentKey}>
      {/* Información de la Operación */}
      {operacion && (
        <Card className="border-blue-100 bg-blue-25">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <CardTitle className="text-base text-blue-800">
                  Documentos para: {operacion.codigo} - {operacion.nombre}
                </CardTitle>
              </div>
              <button
                onClick={() => setShowOperacionInfo(!showOperacionInfo)}
                className="text-blue-600 hover:text-blue-700 p-1"
              >
                {showOperacionInfo ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </CardHeader>
          {showOperacionInfo && (
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-xs font-medium text-blue-600">Estado</p>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                    {operacion.estado}
                  </Badge>
                </div>
                {operacion.salmoneras && (
                  <div>
                    <p className="text-xs font-medium text-blue-600">Salmonera</p>
                    <p className="text-blue-800 text-sm">{operacion.salmoneras.nombre}</p>
                  </div>
                )}
                {operacion.sitios && (
                  <div>
                    <p className="text-xs font-medium text-blue-600">Sitio</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-500" />
                      <p className="text-blue-800 text-sm">{operacion.sitios.nombre}</p>
                    </div>
                  </div>
                )}
                {operacion.contratistas && (
                  <div>
                    <p className="text-xs font-medium text-blue-600">Contratista</p>
                    <p className="text-blue-800 text-sm">{operacion.contratistas.nombre}</p>
                  </div>
                )}
              </div>
              {/* Mostrar información del personal de buceo asignado */}
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs font-medium text-blue-600 mb-1">Personal de Buceo</p>
                {hasTeamAssigned ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                    Personal asignado ✓
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 text-xs">
                    Sin personal asignado
                  </Badge>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Alerts */}
      {!hasTeamAssigned && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-yellow-800">
            <strong>Personal de buceo requerido:</strong> Asigne personal de buceo a esta operación en la pestaña "Personal de Buceo" antes de crear documentos.
          </AlertDescription>
        </Alert>
      )}

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-blue-800">
          <strong>Política de documentos:</strong> Los documentos HPT, Anexo Bravo y bitácoras no pueden eliminarse por trazabilidad. Solo pueden ser editados o reemplazados.
        </AlertDescription>
      </Alert>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HPT Section */}
        <Card className="ios-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Hojas de Planificación (HPT)
              </CardTitle>
              <DocumentCreationButton
                onClick={() => setShowHPTWizard(true)}
                disabled={!hasTeamAssigned}
                className="ios-button bg-blue-600 hover:bg-blue-700"
              >
                Crear HPT
              </DocumentCreationButton>
            </div>
          </CardHeader>
          <CardContent>
            <DocumentCard
              documents={operacionHPTs}
              title="HPT"
              icon={<FileText className="w-5 h-5 text-blue-600" />}
              emptyIcon={<FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />}
              emptyMessage="No hay HPTs creados"
              emptySubMessage={hasTeamAssigned ? "Cree el primer HPT para esta operación" : "Asigne personal de buceo primero"}
              onDocumentDeleteAttempt={handleDocumentDeleteAttempt}
              documentType="HPT"
            />
          </CardContent>
        </Card>

        {/* Anexo Bravo Section */}
        <Card className="ios-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Anexos Bravo
              </CardTitle>
              <DocumentCreationButton
                onClick={() => setShowAnexoBravoForm(true)}
                disabled={!hasTeamAssigned}
                className="ios-button bg-green-600 hover:bg-green-700"
              >
                Crear Anexo Bravo
              </DocumentCreationButton>
            </div>
          </CardHeader>
          <CardContent>
            <DocumentCard
              documents={operacionAnexos}
              title="Anexo Bravo"
              icon={<Shield className="w-5 h-5 text-green-600" />}
              emptyIcon={<Shield className="w-12 h-12 text-zinc-300 mx-auto mb-4" />}
              emptyMessage="No hay Anexos Bravo creados"
              emptySubMessage={hasTeamAssigned ? "Cree el primer Anexo Bravo para esta operación" : "Asigne personal de buceo primero"}
              onDocumentDeleteAttempt={handleDocumentDeleteAttempt}
              documentType="Anexo Bravo"
            />
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <Dialog open={showHPTWizard} onOpenChange={setShowHPTWizard}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <HPTWizard
            operacionId={operacionId}
            onComplete={() => setShowHPTWizard(false)}
            onCancel={() => setShowHPTWizard(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showAnexoBravoForm} onOpenChange={setShowAnexoBravoForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <FullAnexoBravoForm
            operacionId={operacionId}
            onSubmit={(data) => {
              createAnexoBravo(data);
              setShowAnexoBravoForm(false);
            }}
            onCancel={() => setShowAnexoBravoForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
