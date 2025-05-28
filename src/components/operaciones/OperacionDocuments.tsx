import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Calendar, Building, Plus, Eye, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { HPTWizard } from '@/components/hpt/HPTWizard';
import { FullAnexoBravoForm } from '@/components/anexo-bravo/FullAnexoBravoForm';

interface OperacionDocumentsProps {
  operacionId: string;
  operacion?: any;
}

interface DocumentStatus {
  hpts: any[];
  anexosBravo: any[];
  hasTeam: boolean;
}

export const OperacionDocuments = ({ operacionId, operacion }: OperacionDocumentsProps) => {
  const [documentStatus, setDocumentStatus] = useState<DocumentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateHPT, setShowCreateHPT] = useState(false);
  const [showCreateAnexo, setShowCreateAnexo] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Obtener documentos asociados
        const [hptData, anexoData] = await Promise.all([
          supabase.from('hpt').select('*').eq('operacion_id', operacionId),
          supabase.from('anexo_bravo').select('*').eq('operacion_id', operacionId)
        ]);

        // Check if operation has team assigned
        const hasTeam = !!operacion?.equipo_buceo_id;

        setDocumentStatus({
          hpts: hptData.data || [],
          anexosBravo: anexoData.data || [],
          hasTeam
        });

      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [operacionId, operacion]);

  const canCreateDocuments = documentStatus?.hasTeam;

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mx-auto"></div>
        <p className="text-gray-500 mt-2 text-sm">Cargando documentos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Información de la Operación - Más sutil */}
      {operacion && (
        <Card className="border border-blue-100 bg-blue-50/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-blue-900">{operacion.codigo}</span>
                  <span className="text-blue-600">•</span>
                  <span className="text-blue-800">{operacion.nombre}</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                    {operacion.estado}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-blue-600">
                  {operacion.salmoneras && <span>{operacion.salmoneras.nombre}</span>}
                  {operacion.sitios && (
                    <>
                      <span>•</span>
                      <span>{operacion.sitios.nombre}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alertas de prerrequisitos */}
      {!canCreateDocuments && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-amber-800">
            Para crear documentos necesita tener un equipo de buceo asignado a esta operación.
          </AlertDescription>
        </Alert>
      )}

      {/* HPT Documents */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Hojas de Planificación de Tarea (HPT)</CardTitle>
          <Button 
            onClick={() => setShowCreateHPT(true)} 
            size="sm"
            disabled={!canCreateDocuments || documentStatus?.hpts.some(h => !h.firmado)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear HPT
          </Button>
        </CardHeader>
        <CardContent>
          {documentStatus?.hpts.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
              <FileText className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No hay HPTs creados para esta operación</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documentStatus?.hpts.map((hpt) => (
                <div key={hpt.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{hpt.codigo}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(hpt.created_at).toLocaleDateString('es-CL')}</span>
                        <span>•</span>
                        <span>{hpt.supervisor}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={hpt.firmado ? "default" : "secondary"} className={hpt.firmado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {hpt.firmado ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Firmado
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {hpt.estado || 'Borrador'}
                        </div>
                      )}
                    </Badge>
                    <Button variant="outline" size="sm" className="text-gray-600 border-gray-200">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Anexo Bravo Documents */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Anexo Bravo</CardTitle>
          <Button 
            onClick={() => setShowCreateAnexo(true)} 
            size="sm"
            disabled={!canCreateDocuments || documentStatus?.anexosBravo.some(a => !a.firmado)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Anexo Bravo
          </Button>
        </CardHeader>
        <CardContent>
          {documentStatus?.anexosBravo.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
              <FileText className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No hay Anexos Bravo creados para esta operación</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documentStatus?.anexosBravo.map((anexo) => (
                <div key={anexo.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{anexo.codigo}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(anexo.created_at).toLocaleDateString('es-CL')}</span>
                        <span>•</span>
                        <span>{anexo.supervisor}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={anexo.firmado ? "default" : "secondary"} className={anexo.firmado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {anexo.firmado ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Firmado
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {anexo.estado || 'Borrador'}
                        </div>
                      )}
                    </Badge>
                    <Button variant="outline" size="sm" className="text-gray-600 border-gray-200">
                      <Eye className="w-4 h-4" />
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
            onComplete={() => {
              setShowCreateHPT(false);
              // Refresh documents
              window.location.reload();
            }}
            onCancel={() => setShowCreateHPT(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateAnexo} onOpenChange={setShowCreateAnexo}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0">
          <FullAnexoBravoForm
            operacionId={operacionId}
            onSubmit={async (data) => {
              // Handle annexo bravo creation
              setShowCreateAnexo(false);
              window.location.reload();
            }}
            onCancel={() => setShowCreateAnexo(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
