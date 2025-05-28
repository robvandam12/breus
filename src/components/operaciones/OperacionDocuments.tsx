
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Plus, Eye, Edit, AlertTriangle, CheckCircle, Download } from "lucide-react";
import { HPTWizard } from "@/components/hpt/HPTWizard";
import { FullAnexoBravoForm } from "@/components/anexo-bravo/FullAnexoBravoForm";
import { useHPT } from "@/hooks/useHPT";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";

interface OperacionDocumentsProps {
  operacionId: string;
  operacion?: any;
}

export const OperacionDocuments = ({ operacionId, operacion }: OperacionDocumentsProps) => {
  const [showCreateHPT, setShowCreateHPT] = useState(false);
  const [showCreateAnexo, setShowCreateAnexo] = useState(false);
  const [editingHPT, setEditingHPT] = useState<any>(null);
  const [editingAnexo, setEditingAnexo] = useState<any>(null);

  const { hpts, createHPT } = useHPT();
  const { anexosBravo, createAnexoBravo } = useAnexoBravo();

  // Filtrar documentos de esta operación
  const operacionHPTs = hpts.filter(hpt => hpt.operacion_id === operacionId);
  const operacionAnexos = anexosBravo.filter(anexo => anexo.operacion_id === operacionId);

  const handleCreateHPT = async (data: any) => {
    try {
      await createHPT({ ...data, operacion_id: operacionId });
      setShowCreateHPT(false);
    } catch (error) {
      console.error('Error creating HPT:', error);
    }
  };

  const handleCreateAnexo = async (data: any) => {
    try {
      await createAnexoBravo({ ...data, operacion_id: operacionId });
      setShowCreateAnexo(false);
    } catch (error) {
      console.error('Error creating Anexo Bravo:', error);
    }
  };

  const canCreateDocuments = !!operacion?.equipo_buceo_id;

  return (
    <div className="space-y-6">
      {/* Información sutil de la Operación */}
      {operacion && (
        <div className="bg-blue-50/50 border border-blue-200/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-blue-700 font-medium">Documentos para:</span>
            <span className="text-blue-800">{operacion.codigo}</span>
            <span className="text-blue-600">•</span>
            <span className="text-blue-700">{operacion.salmoneras?.nombre}</span>
            <Badge variant="outline" className="bg-blue-100/50 text-blue-700 border-blue-200">
              {operacion.estado}
            </Badge>
          </div>
        </div>
      )}

      {!canCreateDocuments && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-yellow-800">
            <strong>Equipo requerido:</strong> Debe asignar un equipo de buceo a esta operación antes de crear documentos.
          </AlertDescription>
        </Alert>
      )}

      {/* HPT Section */}
      <Card className="bg-white shadow-sm rounded-xl border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <FileText className="w-5 h-5 text-blue-600" />
            Hojas de Planificación de Tarea (HPT)
          </CardTitle>
          <Button 
            onClick={() => setShowCreateHPT(true)} 
            disabled={!canCreateDocuments}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear HPT
          </Button>
        </CardHeader>
        <CardContent>
          {operacionHPTs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No hay HPTs creados para esta operación</p>
              <p className="text-sm text-gray-400">Los HPTs son requeridos antes de realizar inmersiones</p>
            </div>
          ) : (
            <div className="space-y-3">
              {operacionHPTs.map((hpt) => (
                <div key={hpt.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{hpt.codigo || hpt.folio}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">
                          {hpt.fecha ? new Date(hpt.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
                        </span>
                        <Badge 
                          variant={hpt.firmado ? 'default' : 'secondary'}
                          className={hpt.firmado ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}
                        >
                          {hpt.firmado ? (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Firmado
                            </div>
                          ) : (
                            hpt.estado || 'Borrador'
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {!hpt.firmado && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => setEditingHPT(hpt)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Anexo Bravo Section */}
      <Card className="bg-white shadow-sm rounded-xl border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <FileText className="w-5 h-5 text-green-600" />
            Anexos Bravo
          </CardTitle>
          <Button 
            onClick={() => setShowCreateAnexo(true)} 
            disabled={!canCreateDocuments}
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Anexo Bravo
          </Button>
        </CardHeader>
        <CardContent>
          {operacionAnexos.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No hay Anexos Bravo creados para esta operación</p>
              <p className="text-sm text-gray-400">Los Anexos Bravo son requeridos antes de realizar inmersiones</p>
            </div>
          ) : (
            <div className="space-y-3">
              {operacionAnexos.map((anexo) => (
                <div key={anexo.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{anexo.codigo}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">
                          {anexo.fecha ? new Date(anexo.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
                        </span>
                        <Badge 
                          variant={anexo.firmado ? 'default' : 'secondary'}
                          className={anexo.firmado ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}
                        >
                          {anexo.firmado ? (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Firmado
                            </div>
                          ) : (
                            anexo.estado || 'Borrador'
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {!anexo.firmado && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => setEditingAnexo(anexo)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <Dialog open={showCreateHPT} onOpenChange={setShowCreateHPT}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0">
          <HPTWizard 
            operacionId={operacionId}
            onComplete={() => setShowCreateHPT(false)}
            onCancel={() => setShowCreateHPT(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateAnexo} onOpenChange={setShowCreateAnexo}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0">
          <FullAnexoBravoForm
            onSubmit={handleCreateAnexo}
            onCancel={() => setShowCreateAnexo(false)}
            operacionId={operacionId}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingHPT} onOpenChange={() => setEditingHPT(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0">
          <HPTWizard 
            operacionId={operacionId}
            hptId={editingHPT?.id}
            onComplete={() => setEditingHPT(null)}
            onCancel={() => setEditingHPT(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingAnexo} onOpenChange={() => setEditingAnexo(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0">
          <FullAnexoBravoForm
            onSubmit={handleCreateAnexo}
            onCancel={() => setEditingAnexo(null)}
            operacionId={operacionId}
            anexoId={editingAnexo?.id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
