
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, CheckCircle, AlertCircle, Clock, Plus, Building, MapPin, Users } from "lucide-react";
import { HPTWizardComplete } from "@/components/hpt/HPTWizardComplete";
import { FullAnexoBravoForm } from "@/components/anexo-bravo/FullAnexoBravoForm";
import { useHPT } from "@/hooks/useHPT";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";

interface OperacionDocumentsProps {
  operacionId: string;
  operacion?: any;
}

export const OperacionDocuments = ({ operacionId, operacion }: OperacionDocumentsProps) => {
  const [isHPTDialogOpen, setIsHPTDialogOpen] = useState(false);
  const [isAnexoDialogOpen, setIsAnexoDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('documentos');
  
  const { hpts, createHPT } = useHPT();
  const { anexosBravo, createAnexoBravo } = useAnexoBravo();
  const { equipos } = useEquiposBuceoEnhanced();

  // Obtener equipo asignado
  const equipoAsignado = operacion?.equipo_buceo_id 
    ? equipos.find(eq => eq.id === operacion.equipo_buceo_id)
    : null;

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

  const handleCancelAnexoBravo = () => {
    setIsAnexoDialogOpen(false);
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

  if (activeTab === 'equipo') {
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

        {/* Equipo de Buceo Asignado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Equipo de Buceo Asignado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {equipoAsignado ? (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-green-800">{equipoAsignado.nombre}</h3>
                    <Badge className="bg-green-100 text-green-700">
                      Equipo Asignado
                    </Badge>
                  </div>
                  {equipoAsignado.descripcion && (
                    <p className="text-sm text-green-700 mb-3">{equipoAsignado.descripcion}</p>
                  )}
                  
                  {/* Miembros del equipo */}
                  {equipoAsignado.miembros && equipoAsignado.miembros.length > 0 && (
                    <div>
                      <h4 className="font-medium text-green-800 mb-2">Miembros del Equipo ({equipoAsignado.miembros.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {equipoAsignado.miembros.map((miembro, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-green-200">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 font-medium text-sm">
                                  {miembro.nombre_completo.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-green-800">{miembro.nombre_completo}</p>
                                <p className="text-xs text-green-600">{miembro.rol}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {miembro.disponible ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-yellow-600" />
                              )}
                              <span className="text-xs text-green-600">
                                {miembro.disponible ? 'Disponible' : 'No Disponible'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <p className="text-zinc-500 mb-2">No hay equipo de buceo asignado</p>
                <p className="text-sm text-zinc-400">Asigne un equipo de buceo para esta operación</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto p-0">
                  <FullAnexoBravoForm
                    onSubmit={handleCreateAnexoBravo}
                    onCancel={handleCancelAnexoBravo}
                    operacionId={operacionId}
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
