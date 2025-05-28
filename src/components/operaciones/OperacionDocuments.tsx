
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, CheckCircle, AlertCircle, Clock, Plus, Building, MapPin } from "lucide-react";
import { HPTWizardComplete } from "@/components/hpt/HPTWizardComplete";
import { EnhancedAnexoBravoForm } from "@/components/anexo-bravo/EnhancedAnexoBravoForm";
import { useHPT } from "@/hooks/useHPT";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";

interface OperacionDocumentsProps {
  operacionId: string;
  operacion?: any;
}

export const OperacionDocuments = ({ operacionId, operacion }: OperacionDocumentsProps) => {
  const [isHPTDialogOpen, setIsHPTDialogOpen] = useState(false);
  const [isAnexoDialogOpen, setIsAnexoDialogOpen] = useState(false);
  
  const { hpts, createHPT } = useHPT();
  const { anexosBravo, createAnexoBravo } = useAnexoBravo();

  // Mock data - En producción esto vendría de hooks
  const documentos = [
    {
      tipo: 'HPT',
      estado: 'firmado',
      fecha: '2024-01-15',
      url: '#'
    },
    {
      tipo: 'Anexo Bravo',
      estado: 'borrador',
      fecha: '2024-01-16',
      url: '#'
    }
  ];

  const handleCreateHPT = async (hptId: string) => {
    setIsHPTDialogOpen(false);
  };

  const handleCreateAnexoBravo = async (data: any) => {
    try {
      await createAnexoBravo(data);
      setIsAnexoDialogOpen(false);
    } catch (error) {
      console.error('Error creating anexo bravo:', error);
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'firmado':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pendiente':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'firmado':
        return 'bg-green-100 text-green-700';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Información de la Operación */}
      {operacion && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Building className="w-5 h-5" />
              Operación Asignada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-blue-700">Código</p>
                <p className="text-blue-900">{operacion.codigo}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Nombre</p>
                <p className="text-blue-900">{operacion.nombre}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Estado</p>
                <Badge variant="outline" className="bg-blue-100 text-blue-700">
                  {operacion.estado}
                </Badge>
              </div>
              {operacion.salmoneras && (
                <div>
                  <p className="text-sm font-medium text-blue-700">Salmonera</p>
                  <p className="text-blue-900">{operacion.salmoneras.nombre}</p>
                </div>
              )}
              {operacion.sitios && (
                <div>
                  <p className="text-sm font-medium text-blue-700">Sitio</p>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    <p className="text-blue-900">{operacion.sitios.nombre}</p>
                  </div>
                </div>
              )}
              {operacion.contratistas && (
                <div>
                  <p className="text-sm font-medium text-blue-700">Contratista</p>
                  <p className="text-blue-900">{operacion.contratistas.nombre}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documentos de la Operación */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Documentos de la Operación
            </CardTitle>
            <div className="flex gap-2">
              <Dialog open={isHPTDialogOpen} onOpenChange={setIsHPTDialogOpen}>
                <Button 
                  variant="outline"
                  onClick={() => setIsHPTDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo HPT
                </Button>
                <DialogContent className="max-w-5xl">
                  <HPTWizardComplete
                    operacionId={operacionId}
                    onComplete={handleCreateHPT}
                    onCancel={() => setIsHPTDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={isAnexoDialogOpen} onOpenChange={setIsAnexoDialogOpen}>
                <Button 
                  variant="outline"
                  onClick={() => setIsAnexoDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Anexo Bravo
                </Button>
                <DialogContent className="max-w-4xl">
                  <EnhancedAnexoBravoForm
                    onSubmit={handleCreateAnexoBravo}
                    onCancel={() => setIsAnexoDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {documentos.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <p className="text-zinc-500">No hay documentos asociados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documentos.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(doc.estado)}
                    <div>
                      <p className="font-medium">{doc.tipo}</p>
                      <p className="text-sm text-zinc-500">
                        {new Date(doc.fecha).toLocaleDateString('es-CL')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(doc.estado)}>
                      {doc.estado}
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
      </Card>
    </div>
  );
};
