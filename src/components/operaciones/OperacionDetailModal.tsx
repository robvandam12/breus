
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Calendar, Users, FileText, Activity, AlertTriangle, CheckCircle, Plus, Edit, Shield } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { CreateInmersionForm } from '@/components/inmersiones/CreateInmersionForm';
import { OperacionTeamTab } from '@/components/operaciones/OperacionTeamTab';
import { OperacionDocuments } from '@/components/operaciones/OperacionDocuments';
import { OperacionTimeline } from '@/components/operaciones/OperacionTimeline';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

interface OperacionDetailModalProps {
  operacion: any;
  isOpen: boolean;
  onClose: () => void;
}

interface DocumentStatus {
  hpts: any[];
  anexosBravo: any[];
  inmersiones: any[];
  hasTeam: boolean;
}

export const OperacionDetailModal: React.FC<OperacionDetailModalProps> = ({ 
  operacion, 
  isOpen, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('resumen');
  const [showCreateInmersion, setShowCreateInmersion] = useState(false);
  const { profile } = useAuth();

  // Fetch document status and real inmersiones
  const { data: documentStatus, refetch: refetchDocuments } = useQuery({
    queryKey: ['operacion-documents', operacion?.id],
    queryFn: async () => {
      if (!operacion?.id) return null;

      const [hptData, anexoData, inmersionData] = await Promise.all([
        supabase.from('hpt').select('*').eq('operacion_id', operacion.id),
        supabase.from('anexo_bravo').select('*').eq('operacion_id', operacion.id),
        supabase.from('inmersion').select('*').eq('operacion_id', operacion.id).order('fecha_inmersion', { ascending: false })
      ]);

      const hasTeam = !!operacion.equipo_buceo_id;

      return {
        hpts: hptData.data || [],
        anexosBravo: anexoData.data || [],
        inmersiones: inmersionData.data || [],
        hasTeam
      } as DocumentStatus;
    },
    enabled: !!operacion?.id && isOpen
  });

  const handleCreateInmersion = async (data: any) => {
    try {
      const inmersionData = {
        ...data,
        operacion_id: operacion.id
      };
      
      const { error } = await supabase.from('inmersion').insert([inmersionData]);
      if (error) throw error;
      
      setShowCreateInmersion(false);
      refetchDocuments();
    } catch (error) {
      console.error('Error creating Inmersion:', error);
    }
  };

  if (!operacion) return null;

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
    
    const hasValidHPT = documentStatus.hpts.some(h => h.firmado);
    const hasValidAnexo = documentStatus.anexosBravo.some(a => a.firmado);
    const canExecute = hasValidHPT && hasValidAnexo && documentStatus.hasTeam;
    
    return { hasValidHPT, hasValidAnexo, canExecute, hasTeam: documentStatus.hasTeam };
  };

  const compliance = getComplianceStatus();
  const canCreateInmersiones = compliance?.canExecute;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CL');
  };

  const formatEstado = (estado: string) => {
    const estados = {
      'planificada': 'Planificada',
      'en_progreso': 'En Progreso',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return estados[estado as keyof typeof estados] || estado;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{operacion.nombre}</DialogTitle>
              <p className="text-gray-600">Código: {operacion.codigo}</p>
            </div>
            <Badge className={getStatusColor(operacion.estado)}>
              {operacion.estado}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="equipo">Equipo de Buceo</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="inmersiones">Inmersiones</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
          </TabsList>

          <TabsContent value="resumen" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Sitio: {operacion.sitios?.nombre || operacion.sitio_nombre || 'No asignado'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Contratista: {operacion.contratistas?.nombre || operacion.contratista_nombre || 'No asignado'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      Fecha inicio: {formatDate(operacion.fecha_inicio)}
                    </span>
                  </div>
                  {operacion.fecha_fin && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        Fecha fin: {formatDate(operacion.fecha_fin)}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estado de Cumplimiento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Equipo Asignado</span>
                    {compliance?.hasTeam ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">HPT Válido</span>
                    {compliance?.hasValidHPT ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Anexo Bravo Válido</span>
                    {compliance?.hasValidAnexo ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Puede Ejecutar Inmersiones</span>
                    {compliance?.canExecute ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="equipo" className="space-y-4">
            <OperacionTeamTab 
              operacionId={operacion.id} 
              operacion={operacion}
            />
          </TabsContent>

          <TabsContent value="documentos" className="space-y-4">
            <OperacionDocuments 
              operacionId={operacion.id} 
              operacion={operacion}
            />
          </TabsContent>

          <TabsContent value="inmersiones" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Inmersiones ({documentStatus?.inmersiones.length || 0})</CardTitle>
                <Button 
                  onClick={() => setShowCreateInmersion(true)} 
                  size="sm"
                  disabled={!canCreateInmersiones}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Inmersión
                </Button>
              </CardHeader>
              <CardContent>
                {!canCreateInmersiones && (
                  <Alert className="mb-4 border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-yellow-800">
                      Para crear inmersiones necesita: Equipo asignado, HPT firmado y Anexo Bravo firmado
                    </AlertDescription>
                  </Alert>
                )}
                
                {!documentStatus?.inmersiones || documentStatus.inmersiones.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay inmersiones creadas</p>
                ) : (
                  <div className="space-y-3">
                    {documentStatus.inmersiones.map((inmersion) => (
                      <div key={inmersion.inmersion_id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-medium text-lg">{inmersion.codigo}</p>
                              <p className="text-sm text-gray-600">
                                Fecha: {formatDate(inmersion.fecha_inmersion)} | 
                                Hora: {inmersion.hora_inicio} {inmersion.hora_fin ? `- ${inmersion.hora_fin}` : ''}
                              </p>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p><strong>Buzo Principal:</strong> {inmersion.buzo_principal}</p>
                              {inmersion.buzo_asistente && (
                                <p><strong>Buzo Asistente:</strong> {inmersion.buzo_asistente}</p>
                              )}
                              <p><strong>Supervisor:</strong> {inmersion.supervisor}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">{inmersion.objetivo}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Prof. Máx: {inmersion.profundidad_max}m</span>
                            <span>Temp: {inmersion.temperatura_agua}°C</span>
                            <span>Visibilidad: {inmersion.visibilidad}m</span>
                            <span>Corriente: {inmersion.corriente}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={inmersion.estado === 'completada' ? "default" : "secondary"}>
                            {formatEstado(inmersion.estado)}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historial" className="space-y-4">
            <OperacionTimeline operacionId={operacion.id} />
          </TabsContent>
        </Tabs>

        {/* Dialog para crear inmersión */}
        {showCreateInmersion && (
          <Dialog open={showCreateInmersion} onOpenChange={setShowCreateInmersion}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nueva Inmersión</DialogTitle>
              </DialogHeader>
              <CreateInmersionForm
                defaultOperacionId={operacion.id}
                onSubmit={handleCreateInmersion}
                onCancel={() => setShowCreateInmersion(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};
