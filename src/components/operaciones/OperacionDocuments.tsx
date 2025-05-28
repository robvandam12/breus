
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, CheckCircle, AlertCircle, Clock, Plus } from "lucide-react";
import { HPTWizardComplete } from "@/components/hpt/HPTWizardComplete";
import { AnexoBravoWizard } from "@/components/anexo-bravo/AnexoBravoWizard";
import { useHPT } from "@/hooks/useHPT";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";
import { useToast } from "@/hooks/use-toast";

interface OperacionDocumentsProps {
  operacionId: string;
}

export const OperacionDocuments = ({ operacionId }: OperacionDocumentsProps) => {
  const [showCreateHPT, setShowCreateHPT] = useState(false);
  const [showCreateAnexoBravo, setShowCreateAnexoBravo] = useState(false);
  
  const { hpts, createHPT } = useHPT();
  const { anexosBravo, createAnexoBravo } = useAnexoBravo();
  const { toast } = useToast();

  // Filtrar documentos de esta operación
  const hptsOperacion = hpts.filter(hpt => hpt.operacion_id === operacionId);
  const anexosOperacion = anexosBravo.filter(anexo => anexo.operacion_id === operacionId);

  const getStatusIcon = (estado: string, firmado: boolean) => {
    if (firmado) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    switch (estado) {
      case 'firmado':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pendiente':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (estado: string, firmado: boolean) => {
    if (firmado) {
      return 'bg-green-100 text-green-700';
    }
    switch (estado) {
      case 'firmado':
        return 'bg-green-100 text-green-700';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-red-100 text-red-700';
    }
  };

  const handleHPTComplete = async (hptId: string) => {
    setShowCreateHPT(false);
    toast({
      title: "HPT creado",
      description: "El HPT ha sido creado exitosamente.",
    });
  };

  const handleAnexoBravoComplete = async (data: any) => {
    try {
      await createAnexoBravo({ ...data, operacion_id: operacionId });
      setShowCreateAnexoBravo(false);
      toast({
        title: "Anexo Bravo creado",
        description: "El Anexo Bravo ha sido creado exitosamente.",
      });
    } catch (error) {
      console.error('Error creating anexo bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el Anexo Bravo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Documentos de la Operación
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowCreateHPT(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo HPT
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowCreateAnexoBravo(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Anexo Bravo
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {hptsOperacion.length === 0 && anexosOperacion.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500 mb-4">No hay documentos asociados a esta operación</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setShowCreateHPT(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear HPT
              </Button>
              <Button variant="outline" onClick={() => setShowCreateAnexoBravo(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Anexo Bravo
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* HPTs */}
            {hptsOperacion.map((hpt) => (
              <div key={hpt.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(hpt.estado || 'borrador', hpt.firmado)}
                  <div>
                    <p className="font-medium">HPT - {hpt.codigo}</p>
                    <p className="text-sm text-zinc-500">
                      {hpt.fecha ? new Date(hpt.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(hpt.estado || 'borrador', hpt.firmado)}>
                    {hpt.firmado ? 'Firmado' : (hpt.estado || 'Borrador')}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Ver
                  </Button>
                </div>
              </div>
            ))}

            {/* Anexos Bravo */}
            {anexosOperacion.map((anexo) => (
              <div key={anexo.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(anexo.estado || 'borrador', anexo.firmado)}
                  <div>
                    <p className="font-medium">Anexo Bravo - {anexo.codigo}</p>
                    <p className="text-sm text-zinc-500">
                      {anexo.fecha ? new Date(anexo.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(anexo.estado || 'borrador', anexo.firmado)}>
                    {anexo.firmado ? 'Firmado' : (anexo.estado || 'Borrador')}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Ver
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Modal para crear HPT */}
      <Dialog open={showCreateHPT} onOpenChange={setShowCreateHPT}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0">
          <HPTWizardComplete
            operacionId={operacionId}
            onComplete={handleHPTComplete}
            onCancel={() => setShowCreateHPT(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal para crear Anexo Bravo */}
      <Dialog open={showCreateAnexoBravo} onOpenChange={setShowCreateAnexoBravo}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0">
          <AnexoBravoWizard
            defaultOperacionId={operacionId}
            onSubmit={handleAnexoBravoComplete}
            onCancel={() => setShowCreateAnexoBravo(false)}
            type="completo"
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};
