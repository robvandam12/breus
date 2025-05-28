
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, Shield, Calendar, Users, Building, MapPin, Plus, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { HPTWizard } from "@/components/hpt/HPTWizard";
import { FullAnexoBravoForm } from "@/components/anexo-bravo/FullAnexoBravoForm";
import { useHPT } from "@/hooks/useHPT";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OperacionDocumentsProps {
  operacionId: string;
  operacion?: any;
}

export const OperacionDocuments = ({ operacionId, operacion }: OperacionDocumentsProps) => {
  const [showHPTWizard, setShowHPTWizard] = useState(false);
  const [showAnexoBravoForm, setShowAnexoBravoForm] = useState(false);
  const [showOperacionInfo, setShowOperacionInfo] = useState(false);
  
  const { hpts, createHPT } = useHPT();
  const { anexosBravo, createAnexoBravo } = useAnexoBravo();

  // Filter documents for this operation
  const operacionHPTs = hpts.filter(hpt => hpt.operacion_id === operacionId);
  const operacionAnexos = anexosBravo.filter(anexo => anexo.operacion_id === operacionId);

  const handleCreateHPT = () => {
    setShowHPTWizard(true);
  };

  const handleCreateAnexoBravo = () => {
    setShowAnexoBravoForm(true);
  };

  const handleHPTComplete = () => {
    setShowHPTWizard(false);
  };

  const handleAnexoComplete = async (data: any) => {
    await createAnexoBravo(data);
    setShowAnexoBravoForm(false);
  };

  // Check if operation has required team
  const hasTeamAssigned = operacion?.equipo_buceo_id;

  return (
    <div className="space-y-6">
      {/* Información de la Operación - Sutil y Colapsible */}
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOperacionInfo(!showOperacionInfo)}
                className="text-blue-600 hover:text-blue-700 p-1"
              >
                {showOperacionInfo ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
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
            </CardContent>
          )}
        </Card>
      )}

      {/* Alert if no team assigned */}
      {!hasTeamAssigned && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-yellow-800">
            <strong>Equipo requerido:</strong> Asigne un equipo de buceo a esta operación en la pestaña "Equipo de Buceo" antes de crear documentos.
          </AlertDescription>
        </Alert>
      )}

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
              <Button 
                onClick={handleCreateHPT}
                disabled={!hasTeamAssigned}
                className="ios-button bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear HPT
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {operacionHPTs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <p className="text-zinc-500 mb-2">No hay HPTs creados</p>
                <p className="text-sm text-zinc-400">Cree el primer HPT para esta operación</p>
              </div>
            ) : (
              <div className="space-y-3">
                {operacionHPTs.map((hpt) => (
                  <div key={hpt.id} className="p-3 border rounded-lg bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{hpt.codigo || hpt.folio}</h4>
                        <p className="text-sm text-gray-600">Supervisor: {hpt.supervisor}</p>
                      </div>
                      <Badge variant={hpt.firmado ? 'default' : 'secondary'}>
                        {hpt.firmado ? 'Firmado' : hpt.estado || 'Borrador'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              <Button 
                onClick={handleCreateAnexoBravo}
                disabled={!hasTeamAssigned}
                className="ios-button bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Anexo Bravo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {operacionAnexos.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <p className="text-zinc-500 mb-2">No hay Anexos Bravo creados</p>
                <p className="text-sm text-zinc-400">Cree el primer Anexo Bravo para esta operación</p>
              </div>
            ) : (
              <div className="space-y-3">
                {operacionAnexos.map((anexo) => (
                  <div key={anexo.id} className="p-3 border rounded-lg bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{anexo.codigo}</h4>
                        <p className="text-sm text-gray-600">Supervisor: {anexo.supervisor}</p>
                      </div>
                      <Badge variant={anexo.firmado ? 'default' : 'secondary'}>
                        {anexo.firmado ? 'Firmado' : anexo.estado || 'Borrador'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* HPT Wizard Dialog */}
      <Dialog open={showHPTWizard} onOpenChange={setShowHPTWizard}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <HPTWizard
            operacionId={operacionId}
            onComplete={handleHPTComplete}
            onCancel={() => setShowHPTWizard(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Anexo Bravo Form Dialog */}
      <Dialog open={showAnexoBravoForm} onOpenChange={setShowAnexoBravoForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <FullAnexoBravoForm
            operacionId={operacionId}
            onSubmit={handleAnexoComplete}
            onCancel={() => setShowAnexoBravoForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
