import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, Calendar, Users, FileText, Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface OperacionDetailsProps {
  operacion: any;
  onBack: () => void;
  onUpdate: (operacionId: string, data: any) => Promise<void>;
}

interface DocumentStatus {
  hpts: number;
  hptsFirmados: number;
  anexosBravo: number;
  anexosFirmados: number;
  inmersiones: number;
  bitacoras: number;
}

export const OperacionDetails: React.FC<OperacionDetailsProps> = ({ operacion, onBack, onUpdate }) => {
  const [documentStatus, setDocumentStatus] = useState<DocumentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocumentStatus = async () => {
      if (!operacion?.id) return;
      
      try {
        // Obtener estado de documentos
        const [hptData, anexoData, inmersionData, bitacoraData] = await Promise.all([
          supabase.from('hpt').select('id, firmado').eq('operacion_id', operacion.id),
          supabase.from('anexo_bravo').select('id, firmado').eq('operacion_id', operacion.id),
          supabase.from('inmersion').select('inmersion_id').eq('operacion_id', operacion.id),
          supabase.from('bitacora_supervisor').select('bitacora_id')
        ]);

        setDocumentStatus({
          hpts: hptData.data?.length || 0,
          hptsFirmados: hptData.data?.filter(h => h.firmado).length || 0,
          anexosBravo: anexoData.data?.length || 0,
          anexosFirmados: anexoData.data?.filter(a => a.firmado).length || 0,
          inmersiones: inmersionData.data?.length || 0,
          bitacoras: bitacoraData.data?.length || 0
        });

      } catch (error) {
        console.error('Error fetching document status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentStatus();
  }, [operacion?.id]);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Cargando detalles...</p>
      </div>
    );
  }

  if (!operacion) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No se encontró la operación</p>
      </div>
    );
  }

  const getStatusColor = (estado: string) => {
    const colors = {
      'activa': 'bg-green-100 text-green-700',
      'pausada': 'bg-yellow-100 text-yellow-700',
      'completada': 'bg-blue-100 text-blue-700',
      'cancelada': 'bg-red-100 text-red-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getComplianceStatus = () => {
    if (!documentStatus) return null;
    
    const hasValidHPT = documentStatus.hptsFirmados > 0;
    const hasValidAnexo = documentStatus.anexosFirmados > 0;
    const canExecute = hasValidHPT && hasValidAnexo;
    
    return { hasValidHPT, hasValidAnexo, canExecute };
  };

  const compliance = getComplianceStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{operacion.nombre}</h2>
          <p className="text-gray-600">Código: {operacion.codigo}</p>
        </div>
        <Badge className={getStatusColor(operacion.estado)}>
          {operacion.estado}
        </Badge>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="inmersiones">Inmersiones</TabsTrigger>
          <TabsTrigger value="cumplimiento">Cumplimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{operacion.sitio?.nombre || 'Sin asignar'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Contratista
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{operacion.contratista?.nombre || 'Sin asignar'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Período
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p><span className="text-gray-600">Inicio:</span> {new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}</p>
                  {operacion.fecha_fin && (
                    <p><span className="text-gray-600">Fin:</span> {new Date(operacion.fecha_fin).toLocaleDateString('es-CL')}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Estado General
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {compliance?.canExecute ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  )}
                  <span className={compliance?.canExecute ? 'text-green-600' : 'text-yellow-600'}>
                    {compliance?.canExecute ? 'Operativa' : 'Requiere documentos'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {operacion.tareas && (
            <Card>
              <CardHeader>
                <CardTitle>Descripción de Tareas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{operacion.tareas}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documentos" className="space-y-4">
          {documentStatus && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    HPT (Hoja de Preparación de Trabajo)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-medium">{documentStatus.hpts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Firmados:</span>
                      <span className="font-medium text-green-600">{documentStatus.hptsFirmados}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {documentStatus.hptsFirmados > 0 ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      )}
                      <span className="text-sm">
                        {documentStatus.hptsFirmados > 0 ? 'Válido para inmersión' : 'Requiere firma'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-600" />
                    Anexo Bravo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-medium">{documentStatus.anexosBravo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Firmados:</span>
                      <span className="font-medium text-green-600">{documentStatus.anexosFirmados}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {documentStatus.anexosFirmados > 0 ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      )}
                      <span className="text-sm">
                        {documentStatus.anexosFirmados > 0 ? 'Válido para inmersión' : 'Requiere firma'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="inmersiones" className="space-y-4">
          {documentStatus && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Inmersiones</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">{documentStatus.inmersiones}</p>
                  <p className="text-sm text-gray-600">Total ejecutadas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bitácoras</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-600">{documentStatus.bitacoras}</p>
                  <p className="text-sm text-gray-600">Registros creados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estado</CardTitle>
                </CardHeader>
                <CardContent>
                  {compliance?.canExecute ? (
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-green-600 font-medium">Operativa</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <p className="text-yellow-600 font-medium">Pendiente</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cumplimiento" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Cumplimiento Normativo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-5 h-5 ${compliance?.hasValidHPT ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <p className="font-medium">HPT Firmado</p>
                      <p className="text-sm text-gray-600">Hoja de Preparación de Trabajo autorizada</p>
                    </div>
                  </div>
                  <Badge variant={compliance?.hasValidHPT ? "default" : "secondary"}>
                    {compliance?.hasValidHPT ? 'Completo' : 'Pendiente'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-5 h-5 ${compliance?.hasValidAnexo ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <p className="font-medium">Anexo Bravo Firmado</p>
                      <p className="text-sm text-gray-600">Verificación de equipos y personal</p>
                    </div>
                  </div>
                  <Badge variant={compliance?.hasValidAnexo ? "default" : "secondary"}>
                    {compliance?.hasValidAnexo ? 'Completo' : 'Pendiente'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                  <div className="flex items-center gap-3">
                    <Activity className={`w-5 h-5 ${compliance?.canExecute ? 'text-green-600' : 'text-yellow-600'}`} />
                    <div>
                      <p className="font-medium">Autorización para Inmersión</p>
                      <p className="text-sm text-gray-600">
                        {compliance?.canExecute 
                          ? 'Operación autorizada para ejecutar inmersiones'
                          : 'Se requieren documentos firmados antes de la inmersión'
                        }
                      </p>
                    </div>
                  </div>
                  <Badge variant={compliance?.canExecute ? "default" : "destructive"}>
                    {compliance?.canExecute ? 'Autorizada' : 'Bloqueada'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
